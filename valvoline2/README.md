# Valvoline ServiceNow Managed Services Command Center

A client-side, synthetic-data demonstration of a 90-day ServiceNow transition and ongoing managed services. Demo edits persist in browser localStorage; no backend or customer data is used.

## Local development

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Static deployment

Build with `npm run build` and publish the `dist` directory. Vercel uses `vercel.json` for SPA rewrites. Netlify uses `public/_redirects` (copied into the build output) for SPA routing. No environment variables are required.