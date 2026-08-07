# CyberCookie Academy proxy

This Worker reverse-proxies the Academy deployment at
`aestrea-academy.cybercookie.org` behind the public `/academy` path on
`cybercookie.org`. It does not redirect clients or strip the path.

The `cybercookie.org/academy*` route is more specific than the main site's
`cybercookie.org/*` route, so only Academy traffic invokes this Worker. A path
boundary check passes lookalike paths such as `/academy-news` through to the
existing main-site Worker.

## Deploy

```bash
npm install
npm test
npm run check
npx wrangler deploy
```

The `cybercookie.org` DNS record must remain proxied by Cloudflare. The Academy
Vercel project must retain `aestrea-academy.cybercookie.org` as its production
domain and its Next.js `basePath: "/academy"` configuration.
