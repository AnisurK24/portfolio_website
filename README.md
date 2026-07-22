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

Live at https://www.anisurkhan.com, hosted on Netlify. The domain is
registered at Namecheap with DNS delegated to Netlify.

Pushes to `main` build automatically. To deploy by hand:

```bash
npx netlify-cli deploy --build --prod
```

### Environment variables

Set these on the host, not just in `.env.local`:

| Variable | Required | Notes |
| --- | --- | --- |
| `ANTHROPIC_API_KEY` | yes | Chat returns a 500 without it. Store as a secret. |
| `NEXT_PUBLIC_SITE_URL` | yes | Without it `metadataBase` falls back to localhost and every link preview breaks, silently: pages still render fine. |
| `ANTHROPIC_MODEL` | no | Defaults to `claude-haiku-4-5`. |
| `CHAT_RATE_LIMIT_PER_HOUR` | no | Defaults to 20. |

After changing any of these, redeploy: environment changes do not apply to
existing deploys.

### Why not GitHub Pages

The chat route is a real server endpoint, so a static export fails on it:

```
Error: export const dynamic = "force-dynamic" on page "/api/chat"
cannot be used with "output: export"
```

Calling the Anthropic API from the browser instead would put the API key in
client-side JavaScript on a public site, so the server route stays.

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
