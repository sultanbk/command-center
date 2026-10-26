# Valvoline ServiceNow Managed Services Command Center

A client-side, synthetic-data demonstration of a 90-day ServiceNow transition and ongoing managed services. Demo edits persist in browser localStorage; no backend or customer data is used.

For a presenter-ready walkthrough, sample-data explanations, and manager Q&A, see the [Manager Pitch Guide](MANAGER_PITCH_GUIDE.md).

## Local development

```sh
npm install
npm run dev
npm run build
npm run preview
```

## Static deployment

The app is in the `valvoline2` directory of the GitHub repository. In Vercel, set **Root Directory** to `valvoline2`, use `npm run build` as the build command, and `dist` as the output directory. Vercel's SPA rewrite is defined in `vercel.json`.

For a local production preview, run `npm run build` followed by `npm run preview`. Netlify uses `public/_redirects` (copied into the build output) for SPA routing. No environment variables are required.
