# codesthings-resources

Shared assets and profile content for the codesthings.com projects. It changes on its own schedule: a site only picks up a change when it deliberately syncs.

## Consumers

| Resource | Consumed by |
|---|---|
| ct monogram, favicon set, og-logo (`brand/`) | base-website, cv, campsnap-filters |
| Logo sources (`brand/source/`, Git LFS) | none (sources) |
| Icons (`icons/`) | base-website, cv |
| Tokens and font-face rules (`design/`) | base-website, cv, campsnap-filters |
| Fonts (`fonts/`) | base-website, cv, campsnap-filters |
| Theme scripts (`js/`) | base-website, cv |
| Profile photo (`images/profile/`) | cv, base-website |
| Profile content (`profiles/`) | none; text to paste into each platform |

Most of this is still to come. Only `sync/` exists so far, and `profiles/` is coming next.

## How a consumer syncs

Each consumer commits a `shared/` folder and `shared/resources.json`:

```json
{ "resources": "<sha>", "files": [{ "from": "design/tokens.css", "to": "src/css/tokens.css" }] }
```

`node shared/sync-resources.js` (a vendored copy of `sync/sync-resources.js`) copies the listed files verbatim from `RESOURCES_DIR` (default `../resources`) and records the resources commit in `resources`. It refuses to run when resources has uncommitted changes, when a listed path is missing, or when a source is a Git LFS pointer. Builds only read the consumer's own `shared/`.

## Tests

`npm test` (Node 24, no dependencies).

## Rules

- No phone number anywhere.
- Git LFS only for `brand/source/` and photos under `profiles/`; anything a consumer vendors is a plain git object.
