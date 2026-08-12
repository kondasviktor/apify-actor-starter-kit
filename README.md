# Apify Actor Starter Kit

**Scaffold a Cheerio Apify Actor in minutes — then replace the parser for your niche.**

[Apify Actor Starter Kit](https://github.com/kondasviktor/apify-actor-starter-kit) is an open **TypeScript + Crawlee Cheerio** teaching Actor — by [Vibe Coder's Life](https://vibecoderslife.com/?utm_source=github&utm_medium=readme&utm_campaign=apify-starter-kit).

It scrapes the public [Books to Scrape](https://books.toscrape.com/) sandbox (catalog → detail pages), pushes structured rows, and demonstrates **pay-per-event charge calls** with a max-charge guard.

> **Do not publish this demo as an Apify Store product.** It is a teaching Actor. Keep cloud runs **private / unpublished**, then swap parsers and product language for a validated niche.

Looking for niches? See [awesome-apify-actor-ideas](https://github.com/kondasviktor/awesome-apify-actor-ideas).

---

## Why this exists

Blank Actor repos waste a weekend on packaging. This kit already has:

- Pure HTML parsers with fixture tests  
- Input + dataset schemas for Apify Console  
- PPE `actor-start` / `item-scraped` with a max-charge guard  
- Dockerfile ordered for TypeScript cloud builds  

The full Playbook adds prompts, checklists, PPE worksheets, and the scored 100-idea list.

---

## Quick start

```bash
git clone https://github.com/kondasviktor/apify-actor-starter-kit.git
cd apify-actor-starter-kit
npm ci
npm test
npm run build
```

Local Actor smoke (Apify CLI):

```bash
# optional: apify login
apify run
# Inspect storage/datasets/default after the run
```

Dev loop without build:

```bash
npm run start:dev
```

---

## Deploy (private is fine)

```bash
npm run build
apify login
apify push
```

Run `login` and `push` as **separate commands**. In Console the Actor slug comes from `.actor/actor.json` `name` (`starter-listing-scraper`).

### Push gotchas (current Apify CLI)

| Check | Requirement |
|-------|-------------|
| `actor.json` `version` | MAJOR.MINOR only — e.g. `0.3`, not `0.1.0` |
| `dataset_schema.json` | `fields` must be a JSON Schema object with `properties` |
| Dockerfile | Copy source **before** `npm run build` |

---

## What it does

- Starts from catalog URLs (prefill: books.toscrape.com)
- Optionally follows pagination (`followPagination`, `maxPages`)
- Opens detail pages for UPC, category, description (`scrapeDetails`)
- Charges `actor-start` once and `item-scraped` per dataset row (capped by `maxItems`)
- Ships unit tests against committed HTML fixtures

### Pricing events (configure in Console)

| Event | When |
|-------|------|
| `actor-start` | Once at run start |
| `item-scraped` | Each successful dataset push (guarded by `maxItems`) |

### Project layout

```
src/main.ts          — crawler + PPE wiring
src/parser.ts        — pure HTML parsers (unit-tested)
src/charging.ts      — Actor.charge helpers + max guard
tests/               — node:test + fixtures
.actor/              — actor.json, input_schema, dataset_schema
INPUT.smoke.json     — fast cloud/local smoke input
```

Optional signup: [apify.com](https://apify.com/?fpr=tmk8u8)

---

## How you can help (please)

1. ⭐ **Star this repo** if the starter helped you ship — stars help others find a real Apify + Crawlee scaffold on GitHub.
2. 🍴 **Fork it** when you replace `parser.ts` for your niche — keep the PPE guard and smoke input habits.
3. 💻 **Run a local / private cloud smoke** (`npm test`, `apify run`, optional private `apify push`) and open an issue if packaging breaks on a new CLI version.
4. ✉️ **[Subscribe to the Vibe Coder's Life newsletter](https://vibecoderslife.com/?utm_source=github&utm_medium=readme&utm_campaign=apify-starter-kit#subscribe-email)** for Actor shipping write-ups.
5. ☕ **[Buy Me a Coffee](https://buymeacoffee.com/kondasviktor)** if you want to support maintenance.

---

## Want the full Playbook?

This kit is free under MIT. **The Vibe Coder's Playbook** adds:

- 90 AI coding prompts + launch checklists  
- PPE margin worksheets and Store packaging guidance  
- The scored **100 Actor ideas** spreadsheet  
- Start-to-finish chapter mirroring this demo  

→ [Vibe Coder's Life](https://vibecoderslife.com/?utm_source=github&utm_medium=readme&utm_campaign=apify-starter-kit) (Playbook sales page goes live with the product launch — until then, subscribe on the homepage.)

More niches: [awesome-apify-actor-ideas](https://github.com/kondasviktor/awesome-apify-actor-ideas).

After the demo: [docs/whats-next.md](./docs/whats-next.md).

---

## License

- **Code:** MIT ([LICENSE](./LICENSE))
- [CONTRIBUTING.md](./CONTRIBUTING.md) · [SECURITY.md](./SECURITY.md)

Apify® is a trademark of Apify Technologies s.r.o. This project is not affiliated with or endorsed by Apify.

Solo-maintained, best-effort issue triage. PRs reviewed when possible.
