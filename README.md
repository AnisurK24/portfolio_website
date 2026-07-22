# anisurkhan.com

Personal portfolio. Single-page Next.js 15 + TypeScript + Tailwind CSS v4 app.

## Stack

- [Next.js 15](https://nextjs.org/) with App Router and React 19
- [TypeScript](https://www.typescriptlang.org/) strict mode
- [Tailwind CSS v4](https://tailwindcss.com/) with CSS-first theme tokens
- No client-side JavaScript framework dependencies beyond React

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Build

```bash
npm run build
npm start
```

## Deploy

### Vercel (recommended)

1. Push to `main`.
2. Import the repo at vercel.com.
3. Add the `anisurkhan.com` custom domain in Vercel settings.

Vercel auto-detects Next.js and configures everything.

### GitHub Pages (static export)

If you want to keep this on GitHub Pages:

1. Uncomment `output: 'export'` in `next.config.mjs`.
2. Run `npm run build`. This produces an `out/` folder.
3. Either commit `out/` to a `gh-pages` branch, or set up a GitHub Actions workflow to deploy on push.

Note: Some Next.js features like server components, API routes, and Image
optimization are limited or unavailable in static export mode.

## Updating content

The whole site lives in one file: `app/page.tsx`. The sections are split into
small components inside that file:

- `Header` – top navigation
- `Hero` – name, tagline, open-to-work badge
- `About` – bio
- `Specialties` – four-card grid
- `Work` – project cards (edit the `projects` array)
- `Stack` – tech stack groups (edit the `groups` array)
- `Contact` – email and social links
- `Footer`

To add a project, append an object to the `projects` array in the `Work`
function. To add a tech, append to the relevant `items` array in the `Stack`
function.

Metadata (SEO, Open Graph, Twitter cards) lives in `app/layout.tsx`.

## Theme

Theme tokens are defined in `app/globals.css` under the `@theme` block. Change
the CSS custom properties there to adjust the color palette globally.

## Legacy

The previous HTML5 UP template version is preserved in `legacy/`. It is not
served and is not part of the build.
