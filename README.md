# hawtof-the-press

Monospace brutalist Ghost theme with first‑class Ghost Portal and built‑in search support.

## Features

- **Header & navigation**: sticky header with brand and primary navigation; responsive mobile drawer
- **Secondary nav (tags/categories)**: optional bar under header using Ghost’s Secondary Navigation
- **Search**: integrates Ghost’s built‑in `{{search}}` helper in the header
- **Feed**: vertical DATE — Title layout with reading time, tags, featured badge, zebra striping
- **Featured posts**: compact featured section on the homepage
- **Accessibility**: skip‑to‑content link, focus styles, semantic landmarks
- **Members**: Portal subscribe/sign‑in in header; post‑page subscribe CTA
- **Typography**: system monospace by default; optional serif toggles via CSS utility classes
- **SEO‑native pages**: `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`

## Navigation setup

- **Primary navigation (pages menu)**: Managed in Ghost Admin → Settings → Navigation. Links appear in the header. The "Home" item is automatically hidden (`.nav-home`) because the logo/title links to home.
- **Secondary navigation (tags/categories)**: Managed in Ghost Admin → Settings → Navigation (Secondary). Appears as a thin bar under the header. You can link tags (e.g. `/tag/news/`, `/tag/guides/`) or any URLs you want to surface.

## File structure

- `default.hbs`: base template; includes `partials/header.hbs`, `partials/footer.hbs`; injects RSS link and icons
- `partials/header.hbs`: brand, `{{navigation}}` (primary), `{{search}}`, Portal links, mobile drawer, and `partials/components/tag-nav.hbs` (secondary nav)
- `partials/footer.hbs`: copyright, "Built with" line, and RSS link (`partials/components/rss-link.hbs`)
- `index.hbs`: homepage with Featured section and feed list + pagination
- `post.hbs`: post template with feature image, content, subscribe CTA, and prev/next nav
- `page.hbs`: page template with optional title/feature image
- `tag.hbs`, `author.hbs`: archive templates with compact headers
- `assets/css/screen.css`: authored theme styles (source)
- `assets/built/screen.css`: compiled/minified output from the build (not linked by default)

## Development

Gulp + PostCSS pipeline builds CSS, live‑reloads with BrowserSync, validates with gscan, and creates a zip for upload.

### Prereqs

- Node >= 18 and pnpm
- Local Ghost at `http://localhost:2368`

### Install deps

```bash
pnpm install
```

### Start dev (Ghost + theme watcher)

```bash
pnpm dev
```

- Proxies Ghost at `http://localhost:2368` for live reload
- Watches `assets/css/**/*.css` and all `.hbs` templates

### Build once (production)

```bash
pnpm build
```

- Processes `assets/css/screen.css` with PostCSS (`postcss-import`, `postcss-nested`, `autoprefixer`)
- Minifies with `cssnano` in production
- Writes output to `assets/built/screen.css`

### Lint theme with gscan

```bash
pnpm lint
```

### Create distributable zip (in `dist/`)

```bash
pnpm zip
```

### Running Ghost locally from the parent directory

From the repository’s parent directory, install Ghost once if needed:

```bash
ghost install local
```

Then use these package scripts from this theme folder:

- `pnpm run ghost:dev` — run Ghost in foreground
- `pnpm run ghost:start` — start Ghost in background
- `pnpm run ghost:stop` — stop Ghost

In Ghost Admin → Settings → Design, upload the zip from `dist/` or symlink this theme for development.

## Notes on CSS

- The theme links `assets/css/screen.css` directly for readability during development. The build also emits a minified copy to `assets/built/screen.css`. If you prefer, you can change the stylesheet link in `default.hbs` to point to the built file for production.

## Compatibility

- Requires **Ghost >= 5.130.2**
- Tested with Ghost Portal members enabled/disabled

## License

MIT
