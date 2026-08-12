import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import * as cheerio from 'cheerio';
import {
  parseCatalogPage,
  parseDetailPage,
  parseNextPageUrl,
  type CheerioRoot,
} from '../src/parser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const fixtures = join(__dirname, 'fixtures');

function load(name: string): CheerioRoot {
  const html = readFileSync(join(fixtures, name), 'utf8');
  return cheerio.load(html) as unknown as CheerioRoot;
}

describe('parseCatalogPage', () => {
  it('extracts book cards and absolute detail URLs', () => {
    const $ = load('catalog-page.html');
    const items = parseCatalogPage($, 'https://books.toscrape.com/');
    assert.equal(items.length, 2);
    assert.equal(items[0].title, 'A Light in the Attic');
    assert.equal(items[0].price, '£51.77');
    assert.equal(items[0].rating, 'Three');
    assert.equal(
      items[0].detailUrl,
      'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html'
    );
    assert.equal(items[1].title, 'Tipping the Velvet');
  });
});

describe('parseNextPageUrl', () => {
  it('resolves the next catalog page', () => {
    const $ = load('catalog-page.html');
    const next = parseNextPageUrl($, 'https://books.toscrape.com/');
    assert.equal(next, 'https://books.toscrape.com/catalogue/page-2.html');
  });
});

describe('parseDetailPage', () => {
  it('extracts title, upc, category, and description', () => {
    const $ = load('detail-page.html');
    const detail = parseDetailPage(
      $,
      'https://books.toscrape.com/catalogue/a-light-in-the-attic_1000/index.html'
    );
    assert.equal(detail.title, 'A Light in the Attic');
    assert.equal(detail.price, '£51.77');
    assert.equal(detail.rating, 'Three');
    assert.equal(detail.upc, 'a897fe39b1053632');
    assert.equal(detail.category, 'Poetry');
    assert.match(detail.description, /Light in the Attic/);
    assert.match(detail.availability, /In stock/);
  });
});
