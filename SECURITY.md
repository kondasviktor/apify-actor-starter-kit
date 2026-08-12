# Security

## Reporting secrets

If you find an API key, token, or credential in this repository or a run log paste:

1. **Do not open a public issue containing the secret**
2. Email **hello@vibecoderslife.com** with subject `Apify Actor Starter Kit security`
3. We will rotate credentials and scrub history as needed

## Maintainer incident response

1. Revoke the exposed key at the provider (Apify token, etc.)
2. Remove the secret from git history if committed
3. Note the incident privately (without the secret)

## Local / cloud runs

- Keep Apify tokens in the CLI keyring or environment — never in the README or screenshots
- Prefer **private** Actor visibility for learning pushes
- This teaching demo must not be published to Apify Store as a product

Solo-maintained, best-effort response via email.
