# Design System — dairy-insurance.com
## "Fresh Pasture" — light, clean, agricultural-editorial

Distinct identity for the dairy niche. Light/corporate palette (NOT dark).

### Palette (exact hexes)
| Token | Hex | Use |
|------|-----|-----|
| `cream` (paper) | `#FBF9F4` | page background (warm milk paper) |
| `sand` | `#EEF2EA` | alt section background (soft sage) |
| `clay` (primary) | `#2F6B3E` | pasture green — primary brand, buttons, nav |
| `clay-dark` | `#21502E` | hover / deep green |
| `sage` (secondary) | `#2E7BB5` | stream/sky blue — secondary accents |
| `gold` (accent) | `#E0A82E` | honey gold — highlights, stars, badges |
| `espresso` | `#1B2A22` | headings (deep green-charcoal) |
| `cocoa` | `#44544A` | body text |
| `mocha` | `#6E7B71` | muted text |
| `adobe` | `#DCE6D8` | soft green borders |

Primary duo: **pasture green + stream blue**, with honey-gold accent. Clean,
fresh, agricultural — evokes pasture, milk, sky.

### Typography
- **Headings: "Fraunces"** (400–900 variable serif) — warm, editorial, premium,
  pastoral feel. Distinct from Archivo/Sora/Inter used by sibling sites.
- **Body: "Inter"** (400–700) — clean, highly legible modern sans for dense
  coverage copy.

### Motif / shape language — "pasture" (rolling green hills)
- **Field band** (`horizon-band`): layered green/blue/gold horizontal bands
  reading as a rolling-pasture horizon — section dividers, hero accent, footer
  top edge.
- **Pasture card** (`card-arch`): white card with a green→blue→gold top edge.
- **Leaf-tick bullet** in blog prose (green/gold/blue laminate mark).
- Generous radius (1–2rem), pill buttons (`rounded-full`).

### Component treatment
Same shared component architecture as the rest of the fleet (token NAMES
preserved, VALUES remapped): `clay→pasture green`, `sage→stream blue`,
`gold→honey`. All niche copy centralized in `src/lib/site.ts` (SITE/BRAND/
SERVICES) and `src/lib/content.ts` (COPY/PROCESS/WHY/FAQs/SERVICE_DETAIL) so
components stay generic.

### Image treatment
Warm, clean agricultural photography — green pastures, Holstein herds, red
barns, modern milking parlors, stainless-steel bulk tanks. 12 generated
images via HF FLUX.1-schnell. OG image branded green/gold (1216×640).

### Motion
`motion` scroll-reveal, slow zoom, animated stat counters, FAQ accordion,
`lenis` smooth scroll, sticky responsive nav. `prefers-reduced-motion`
respected.
