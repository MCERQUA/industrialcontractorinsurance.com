# QA — Dairy Insurance Site

## Site
dairy-insurance.com
Division of Contractors Choice Agency (NPN #8608479). Niche: dairy farm / dairy operations insurance.

## Build status
Run `pnpm run build` to verify (Next.js 15 app router). Target: GREEN.

## Stack
Next.js 15 · React 19 · TypeScript · Tailwind · `motion` · `lenis` · lucide-react · MDX blog.

## Design system
"Fresh Pasture" — pasture green (#2F6B3E) primary, stream blue (#2E7BB5)
secondary, honey gold (#E0A82E) accent, warm milk-paper cream background.
Headings: Fraunces (serif). Body: Inter. See `ai/research/design-system.md`.

## Services (slugs match SERVICES in src/lib/site.ts)
1. livestock-mortality — Dairy Cattle & Livestock Mortality (FEATURED / Essential)
2. farm-property — Farm Property & Buildings
3. equipment-spoilage — Equipment Breakdown & Milk Spoilage
4. dairy-product-liability — Dairy Product Liability
5. general-liability — General Liability
6. workers-compensation — Workers' Compensation
7. commercial-auto — Commercial Auto & Trucking
8. pollution-environmental — Pollution & Environmental Liability

## Locations (8 region slugs)
wisconsin · california · pacific-northwest · northeast · upper-midwest ·
southwest · southeast · plains

## Blog (5 posts)
- dairy-cattle-mortality-coverage
- milk-spoilage-bulk-tank
- manure-runoff-pollution-coverage
- dairy-workers-comp-class-codes
- dairy-farm-insurance-cost

## SEO checklist
- [x] sitemap.ts (all static + services + locations + posts)
- [x] robots.ts
- [x] llms.txt
- [x] Unique title + meta description per page; canonicals
- [x] OG + Twitter share cards (og-image.jpg 1216×640), per-page OG where relevant
- [x] JSON-LD: InsuranceAgency (org), InsuranceService, FAQPage, BreadcrumbList, BlogPosting
- [x] 20 FAQs on homepage + each service/location page (merged general-FAQ pool) with FAQPage schema
- [x] Semantic HTML, heading hierarchy, optimized image alt text
- [x] ≥10 generated images (12 via HF FLUX.1-schnell)

## Forms
Netlify quote + contact forms. Webhook:
`https://josh.jam-bot.com/social-api/api/leads/webhook/netlify?tenant=josh&site=dairy-insurance.com`
(see netlify.toml + src/app/quote + src/app/contact + public/__forms.html)

## Commit
All files tracked (package.json, next.config, all src/, public/, ai/, scripts/).
