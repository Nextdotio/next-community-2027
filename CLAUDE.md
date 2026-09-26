# marketingNEXT (next-community-2027) — membership brochure

Single-page React (Vite + Tailwind v4) app selling the marketingNEXT annual
membership. All content lives in `src/App.jsx` as plain arrays near the top
(`WHY`, `FORMAT`, `STANDARD`, `PROGRAMME`, `INCLUDES`, `TERMS`, `APPLY_STEPS`)
plus the `CONTACT` and `PRICE` constants — edit the arrays, not the markup.
Section titles and leads are in `HEADS`; the hero, price and card lines are
constants beside the arrays (`HERO_TITLE`, `HERO_LEDE`, `PRODUCT_NAME`,
`PRICE_UNIT`, `PRICE_NOTE`, `AVAILABILITY`, `FORMAT_QUOTE`, `STANDARD_CLOSE`,
`MEMBERSHIP_LEDE`). The page and the Present mode deck both read them.

## Deploying to gh-pages — ALWAYS

After any change that affects the site, **redeploy to gh-pages** so the live
site stays current. Do this without being asked, as part of finishing the work:

```
npm run deploy   # = vite build && npx gh-pages -d dist
```

Confirm it prints `Published` before reporting done. Publishes to
`https://nextdotio.github.io/next-community-2027/` once Pages is enabled
for this repo.

## Workflow

- Develop on branch `claude/2027-ticket-pricing-brochure-p79mqg`.
- Run `npm run build` to verify changes compile.
- Redeploy gh-pages (see above).
- Commit with a clear message and push the branch.
- Open a fresh PR into `main` only when asked.

## Branding — the official marketingNEXT identity (logo pack, 2 Sep 2026)

The official lockup is NEXT.io house family: charcoal `#242426` + brand
yellow `#ffcf33`, exactly as sampled from the logo SVGs. The page runs dark
with yellow as the only accent.

- Logo files live in `public/logos/`: `marketingnext-light.svg` (white +
  yellow, for the dark ground — nav and footer), `marketingnext-dark.svg`
  (charcoal + yellow, for light surfaces), `marketingnext-yellow.svg`.
  Always use the `<Wordmark>` component (`variant` picks the colourway);
  never re-set "marketingNEXT" as live text.
- The `mn-*` tokens in `src/index.css` kept their names from the first
  build but now map to the official palette: `mn-paper` is the charcoal
  ground, `mn-ink` is white text, `mn-red` **is brand yellow** (the only
  accent — never add a second). Sections styled `bg-mn-ink text-mn-paper`
  render as inverted white sections.
- Type is Inter throughout (house family), via Google Fonts in
  `index.html`.
- The `.mark-sweep` / `.mark-sweep-paper` utilities are the yellow marker
  stroke behind key words — use sparingly (once per section at most).
  On the dark ground prefer yellow text for emphasis; the sweep reads
  muddy over charcoal (that is why the hero uses `text-mn-red`).

## Content rules — what the page sells

- **One product only**: annual membership, `PRICE` = €4,000 per company per
  year, flat, no tiers, no per-seat uplift (Stuart, 2 Sep 2026 — the brochure
  sells paid membership; the project brief's "free in 2027" framing is
  superseded for this page).
- The includes list is the validated set from the brief's membership block:
  2 senior seats (company-held), all monthly sessions, 4 guest passes,
  peer-on-demand, 2 Valletta Full Event passes, the annual benchmarking
  report. Two further items from the brief (group buying rates, collaborative
  tool discounts) are **deliberately excluded** — Alina flagged them as
  unvalidated ("I don't know how it works in practice"). Do not add them
  until the mechanics are confirmed.
- `CONTACT` is the enquiry address used by every mailto (application CTA is a
  templated mailto). Set on the firstname@next.io pattern — confirm with
  Alina before first external send.

## Internal-only material — never publish

The marketingNEXT project brief is an internal document. These must not
reach the site: the €50k ARR target and paying-company count, the projected
budget (community-manager headcount, activation spend), KPI tables and
targets (attendance, NPS, conversion), team responsibilities and time
allocations, the commercialisation framing ("prove the format before
commercialising", 2028 pricing rationale), sponsorship/Q4 monetisation
plans, and the founding-member list — **names, companies, emails and
statuses stay internal**; founding members are described, never named,
and naming one needs their written permission first.

Also note: the brief says "operators only" but the founding cohort is
supplier-heavy — the page deliberately says "senior iGaming marketers"
and doesn't gate by company type. If that gate is ever decided for real,
update the STANDARD array, not just the hero.

## Navigation (23 Sep 2026)

- The first screen carries the offer: `MembershipSummary` in the hero shows
  `PRICE`, "per company · per year" and the six `INCLUDES` titles, with
  "Apply for a seat" (the templated mailto) and "Membership details" (jumps
  to `#membership`). It is a summary: descriptions and terms stay in the
  membership section, and nothing new is claimed there.
- Section order: why → format → standard → membership (№ 04) → programme
  (№ 05) → apply. The product sits ahead of the programme, which is
  supporting detail. `NAV` follows the page order; renumber both together.
- Anchors land by measurement: App measures the fixed header into `--nav-h`
  (ResizeObserver) and `html` uses it as `scroll-padding-top`. Never hardcode
  a nav offset. First-load deep links (`…/#membership`) are re-applied once
  React has rendered and while fonts settle.
- Below lg the header shows a price chip to `#membership` once the hero
  summary has scrolled away (hidden while the membership section is on
  screen); the phone menu lists Membership too.

## Present mode and seller tools (26 Sep 2026)

Stuart: "easy for our sellers to take the buyers through and convince them
to buy". A presenter shares their screen and walks the buyer through the
membership one slide at a time.

- **What exists.** `src/PresentMode.jsx` is the shared NEXT.io Present mode
  (same behaviour on every brochure; only the classes follow this page:
  `mn-*` tokens, Inter, square controls with tracked caps, the page grain).
  `usePresent` holds the open slide, `PresentMode` renders the deck in a
  portal, `CopyLinkButton` copies a section link.
- **The deck (8 slides)** is `SLIDES` in `src/App.jsx`, rendered by
  `renderSlide`: cover (hero copy, price, the four `HERO_META` facts and an
  "In this presentation" list with counts, each a button to its slide) →
  why (`HEADS.why`, `WHY`) → the format (`FORMAT`, `FORMAT_QUOTE`) → the
  standard (`STANDARD`, `STANDARD_CLOSE`) → the membership (the one product:
  `PRODUCT_NAME`, `PRICE`, `PRICE_UNIT`, `MEMBERSHIP_LEDE`, Apply for
  membership through `applyMailto`, Open the card, Copy link, and every
  `INCLUDES` item with its description through `IncludeItem`; past six it
  shows "+ N more on the card") → the 2027 programme (`PROGRAMME`) → terms
  (`HEADS.membership`, the price, `PRICE_NOTE` and `TERMS` through the rate
  card's own `TermsList`) → how to apply (`ApplySteps`, the templated
  application mailto and `CONTACT`). The terms sit on their own slide, so
  the membership slide links to it ("See the terms") instead of repeating
  them.
- **New content appears automatically**: a criterion, inclusion, month, term
  or step added to its array shows on its slide and in the cover's counts. A
  new section needs an entry in `SLIDES` and a case in `renderSlide`. Never
  type copy or figures onto a slide; read the arrays and constants.
- **URLs.** `?present` opens the cover; `?present=<slide id>` opens that
  slide. Slide ids are the page's section anchors (`why`, `format`,
  `standard`, `membership`, `programme`, `apply`) plus `cover` and `terms`.
  The address bar follows the slide (replaceState, so Back leaves the deck
  rather than stepping through slides). Esc drops `present` from the
  address. Copy link gives the page address plus `#membership`, never
  `present`.
- **Keys.** → Space PageDown next · ← PageUp back · Home End · G all slides ·
  Esc closes the slide list, then the deck. Swipe left or right on touch.
- **Entry points.** The nav's Present button (`PresentButton`,
  `data-present-button`): labelled from md to lg and from xl, an icon
  between lg and xl, where the five links and Apply already fill a 1024px
  bar (measured with Inter: 60px spare before it was added). On phones
  Present is in the menu. The rate card carries quiet Present and Copy link
  actions under Apply. The hero summary stays buyer-only (no Present).
  Focus returns to whatever opened the deck; a `?present` link returns it
  to the visible Present button, or the menu button on a phone.
- **No goal chips and no plan link**: one flat product, no goal tags, no
  calculator or plan builder. Do not add either unless the product set
  changes.
- **Rules future edits must keep.** Nothing new is claimed: slides only read
  the page's data. Buyer-facing words only (never seller, sales desk, talk
  track, pitch, objection or close in the selling sense; the button is
  "Present"; the existing "no pitches" copy is about vendors in the room and
  stays). No em dashes in new copy. The deck top bar's title is set in caps, so it never holds a
  brand name (the wordmark carries it); inside any caps label use `<Brand>`.
  The deck is charcoal throughout: a white section's marker sweep becomes
  yellow words on its slide (`HeadTitle deck`), never a sweep. Slides must
  not use `animate-on-scroll` or `hero-rise` (`useReveal` only observes
  elements present at first render, so they would stay invisible). Keep 44px
  targets, and keep every slide inside a 1280x800 (and 1024x800) screen
  without scrolling; phones and a portrait tablet may scroll a long slide.
  Check by walking `?present` with ArrowRight at 390, 1024, 1280 and 1440.
