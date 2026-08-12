import { Actor, log } from 'apify';
import { CheerioCrawler, Dataset } from 'crawlee';
import { createChargeGuard } from './charging.js';
import {
  parseCatalogPage,
  parseDetailPage,
  parseNextPageUrl,
  type CheerioRoot,
} from './parser.js';

interface Input {
  startUrls: { url: string }[];
  maxItems?: number;
  maxPages?: number;
  maxConcurrency?: number;
  followPagination?: boolean;
  scrapeDetails?: boolean;
  proxyConfiguration?: object;
}

interface OutputRow {
  title: string;
  price: string;
  availability: string;
  rating: string;
  category: string;
  upc: string;
  description: string;
  productUrl: string;
  sourceUrl: string;
}

await Actor.init();

const input = (await Actor.getInput<Input>()) ?? {
  startUrls: [{ url: 'https://books.toscrape.com/' }],
};

const {
  startUrls,
  maxItems = 10,
  maxPages = 3,
  maxConcurrency = 2,
  followPagination = true,
  scrapeDetails = true,
  proxyConfiguration,
} = input;

const proxyConfigurationResolved = await Actor.createProxyConfiguration(proxyConfiguration);
const charge = createChargeGuard({ maxItemCharges: maxItems });
await charge.chargeStart();

let pushed = 0;
let pagesSeen = 0;

const crawler = new CheerioCrawler({
  maxConcurrency,
  maxRequestsPerCrawl: Math.max(maxItems * 2, maxPages * 20),
  proxyConfiguration: proxyConfigurationResolved,
  async requestHandler(ctx) {
    const { request, $, enqueueLinks } = ctx;
    const $root = $ as unknown as CheerioRoot;
    const label = request.label || 'CATALOG';

    if (label === 'DETAIL') {
      if (pushed >= maxItems || !charge.canChargeItem) return;
      const detail = parseDetailPage($root, request.loadedUrl ?? request.url);
      if (!detail.title) {
        log.warning('Detail page missing title — skip', { url: request.url });
        return;
      }
      const row: OutputRow = {
        title: detail.title,
        price: detail.price,
        availability: detail.availability,
        rating: detail.rating,
        category: detail.category,
        upc: detail.upc,
        description: detail.description,
        productUrl: detail.productUrl,
        sourceUrl: request.url,
      };
      await Dataset.pushData(row);
      const charged = await charge.chargeItem();
      if (!charged) {
        log.info('Max item charges reached — stopping further pushes');
        return;
      }
      pushed += 1;
      log.info(`Pushed detail ${pushed}/${maxItems}`, {
        title: row.title,
        upc: row.upc,
        price: row.price,
      });
      return;
    }

    pagesSeen += 1;
    const pageUrl = request.loadedUrl ?? request.url;
    const listings = parseCatalogPage($root, pageUrl);
    log.info(`Catalog page ${pagesSeen}: ${listings.length} cards`, { url: pageUrl });

    if (scrapeDetails) {
      const remaining = maxItems - pushed;
      const toEnqueue = listings.slice(0, Math.max(0, remaining)).map((item) => ({
        url: item.detailUrl,
        label: 'DETAIL' as const,
        userData: { listTitle: item.title },
      }));
      if (toEnqueue.length) {
        await crawler.addRequests(toEnqueue);
      }
    } else {
      for (const item of listings) {
        if (pushed >= maxItems || !charge.canChargeItem) break;
        const row: OutputRow = {
          title: item.title,
          price: item.price,
          availability: item.availability,
          rating: item.rating,
          category: '',
          upc: '',
          description: '',
          productUrl: item.detailUrl,
          sourceUrl: pageUrl,
        };
        await Dataset.pushData(row);
        const charged = await charge.chargeItem();
        if (!charged) break;
        pushed += 1;
        log.info(`Pushed list item ${pushed}/${maxItems}`, { title: row.title });
      }
    }

    if (followPagination && pagesSeen < maxPages && pushed < maxItems) {
      const nextUrl = parseNextPageUrl($root, pageUrl);
      if (nextUrl) {
        await enqueueLinks({
          urls: [nextUrl],
          label: 'CATALOG',
        });
      }
    }
  },
});

const urls = startUrls.map((entry) => entry.url).filter(Boolean);
await crawler.run(urls.map((url) => ({ url, label: 'CATALOG' })));

log.info('Run complete', {
  pushed,
  pagesSeen,
  itemCharges: charge.itemCharges,
  maxItems,
});

await Actor.exit();
