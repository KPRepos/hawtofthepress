# hawtof-the-press v0.4

A minimal, monospace, brutalist Ghost theme with first‑class Ghost Portal support.

## Features

- **Layout**: fixed header with brand, navigation, and tags menu bar; simple list feed
- **Typography**: system monospace; optional serif toggles in CSS
- **Tags**: grey tag list; vertical DATE — Title style; dedicated `/tags/` page
- **SEO-native pages**: `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `author.hbs`
- **Members**: Ghost Portal subscribe/sign-in in header and post CTA

## File structure

- `default.hbs`: base template; includes `partials/header.hbs`, `partials/footer.hbs`
- `index.hbs`: home feed with date/title + tags
- `post.hbs`: post template with tags, prev/next, optional Portal CTA
- `page.hbs`: page template with optional title/feature image
- `tag.hbs`, `author.hbs`: archive templates
- `assets/css/screen.css`: theme styles
- `/tags/`: dedicated tags index route via `routes.yaml`
- `routes.yaml`: defaults (using Ghost’s built-in routes)

## Development

This repo is a theme only. To run Ghost locally from the adjacent directory (parent folder):

- **Start in foreground (development)**: `npm run ghost:dev`
- **Start in background (development)**: `npm run ghost:start`
- **Stop**: `npm run ghost:stop`

Assumes a local Ghost instance exists in the parent directory. If not, from the parent run:

```bash
ghost install local
```

Then in Ghost Admin → Settings → Design, upload or link this theme folder in development.

## Compatibility

- Requires **Ghost >= 5.0.0**
- Tested with Ghost Portal members enabled/disabled

## License

MIT
