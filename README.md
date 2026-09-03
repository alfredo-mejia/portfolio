# Alfredo Mejia — Portfolio

This is my personal portfolio: a place for selected engineering work, writing,
and a little about who I am. It is built with Next.js, React, TypeScript, and
Tailwind CSS.

## Run locally

Install the dependencies and start the development server:

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Preview and deploy

Build the static site and preview it with Cloudflare Workers:

```bash
npm run preview
```

Open [http://localhost:8787](http://localhost:8787) in your browser.

Pushes to `main` are deployed through Cloudflare Workers Builds. The build
command is `npm run build`, and the deploy command is `npx wrangler deploy`.
For a manual deployment, run:

```bash
npm run deploy
```

Next.js exports the site to `out/`. `wrangler.jsonc` tells Cloudflare to serve
that directory as static assets and to return `out/404.html` for missing pages.
Keeping that configuration explicit prevents Cloudflare from treating the site
as a server-rendered Next.js application.
