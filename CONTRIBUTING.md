# Contributing

Thanks for helping the Apify Actor Starter Kit stay useful for vibe coders.

## Ways to contribute

- Fix packaging issues (Dockerfile order, dataset schema shape, Apify CLI version notes)
- Improve fixture tests when Books to Scrape markup drifts
- Clarify README quickstart steps (no secrets)

## Rules

1. **No secrets** in issues, PRs, or example inputs — never commit Apify tokens, `.env`, or private dataset dumps
2. Keep the demo on **public** books.toscrape.com; do not add login-wall scrapers
3. Prefer small, reviewable diffs
4. Do not paste proprietary Playbook PDF / prompt-pack content into this repo
5. Code contributions: MIT (see LICENSE)

## Local setup

```bash
npm ci
npm test
npm run build
# optional: apify run
```

## Related

- Ideas teaser: https://github.com/kondasviktor/awesome-apify-actor-ideas
- Site: https://vibecoderslife.com/
