# Changelog — starter-listing-scraper

## 0.3 — 2026-08-12

- Fix Dockerfile: copy source before TypeScript build (cloud build was failing).
- Fix `dataset_schema.json`: nested JSON Schema object for Apify CLI validation.
- Set `actor.json` version to Apify MAJOR.MINOR format (`0.3`).

## 0.1.0 — 2026-08-12

- Complete books.toscrape.com demo: catalog + detail parsers, pagination, PPE `actor-start` / `item-scraped` with max-charge guard
- Dataset schema for Console table view
- Unit tests (`node:test`) with committed HTML fixtures
- Examples: sample dataset row + sample run log excerpt
- Input schema: `maxPages`, `followPagination`, `scrapeDetails`

## 0.0.1 — 2026-07

- Initial minimal title+url Cheerio starter for the Playbook toolkit
