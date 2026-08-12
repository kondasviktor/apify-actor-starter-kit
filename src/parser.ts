/**
 * Pure HTML parsers for books.toscrape.com.
 * No Apify/Crawlee imports — unit-testable offline with cheerio.load().
 */

export interface BookListItem {
  title: string;
  detailUrl: string;
  price: string;
  availability: string;
  rating: string;
}

export interface BookDetail {
  title: string;
  price: string;
  availability: string;
  rating: string;
  category: string;
  upc: string;
  description: string;
  productUrl: string;
}

/** Minimal Cheerio-compatible surface used by the parsers. */
export type CheerioRoot = {
  (selector: string): CheerioSelection;
};

type CheerioSelection = {
  each(cb: (i: number, el: unknown) => void): void;
  map(cb: (i: number, el: unknown) => string): { get(): string[] };
  first(): CheerioSelection;
  find(selector: string): CheerioSelection;
  next(selector?: string): CheerioSelection;
  text(): string;
  attr(name: string): string | undefined;
};

function absoluteUrl(baseUrl: string, href: string | undefined): string {
  if (!href) return baseUrl;
  try {
    return new URL(href, baseUrl).href;
  } catch {
    return href;
  }
}

function ratingFromClass(className: string | undefined): string {
  if (!className) return '';
  const match = className.match(/\b(One|Two|Three|Four|Five)\b/i);
  return match ? match[1] : '';
}

function wrap($: CheerioRoot, el: unknown): CheerioSelection {
  return $(el as never);
}

/** Parse a catalog listing page into book cards. */
export function parseCatalogPage($: CheerioRoot, pageUrl: string): BookListItem[] {
  const items: BookListItem[] = [];
  $('article.product_pod').each((_i, el) => {
    const card = wrap($, el);
    const anchor = card.find('h3 a').first();
    const title = (anchor.attr('title') || anchor.text()).trim();
    const detailUrl = absoluteUrl(pageUrl, anchor.attr('href'));
    const price = card.find('.price_color').first().text().trim();
    const availability = card.find('.availability').first().text().replace(/\s+/g, ' ').trim();
    const rating = ratingFromClass(card.find('p.star-rating').first().attr('class'));
    if (!title || !detailUrl) return;
    items.push({ title, detailUrl, price, availability, rating });
  });
  return items;
}

/** Parse a product detail page. */
export function parseDetailPage($: CheerioRoot, productUrl: string): BookDetail {
  const title =
    $('div.product_main h1').first().text().trim() || $('h1').first().text().trim();
  const price = $('p.price_color').first().text().trim();
  const availability = $('p.availability').first().text().replace(/\s+/g, ' ').trim();
  const rating = ratingFromClass($('p.star-rating').first().attr('class'));

  const crumbLabels = $('ul.breadcrumb li a')
    .map((_i, el) => wrap($, el).text().trim())
    .get();
  const category = crumbLabels[2] || crumbLabels[1] || '';

  let upc = '';
  $('table.table.table-striped tr').each((_i, el) => {
    const row = wrap($, el);
    const th = row.find('th').first().text().trim();
    const td = row.find('td').first().text().trim();
    if (th === 'UPC') upc = td;
  });

  const description = $('#product_description').next('p').first().text().trim();

  return {
    title,
    price,
    availability,
    rating,
    category,
    upc,
    description,
    productUrl,
  };
}

/** Next catalog page URL if present. */
export function parseNextPageUrl($: CheerioRoot, pageUrl: string): string | null {
  const href = $('li.next a').first().attr('href');
  if (!href) return null;
  return absoluteUrl(pageUrl, href);
}
