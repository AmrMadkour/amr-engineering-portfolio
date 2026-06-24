# 0009 — Custom Domain via Cloudflare, DNS-Only (No Proxy)

## Status
Accepted

## Context
The custom domain `amrmadkour.com` is registered through Cloudflare. Cloudflare's default behavior proxies DNS records through its edge network (orange cloud), which is usually desirable for caching/DDoS protection — but it intercepts TLS termination, which conflicts with Vercel's own automatic SSL provisioning for custom domains.

## Decision
Both DNS records (`A @ → 76.76.21.21`, `CNAME www → cname.vercel-dns.com`) are set to **DNS-only** (grey cloud, not proxied). `NEXT_PUBLIC_SITE_URL` is the single env var that drives sitemap URLs, canonical tags, OG URLs, and the JSON-LD `Person.url` field — it is the only place the domain needs to be updated if it ever changes.

## Consequences
- No Cloudflare-side caching/WAF on this domain — acceptable, since Vercel's own edge network already serves the frontend.
- SSL certificate provisioning and renewal is fully owned by Vercel, with no manual cert work.
- If the domain is ever re-proxied through Cloudflare (orange cloud) by mistake, Vercel's SSL validation breaks silently — this is the most likely future footgun with this setup.
