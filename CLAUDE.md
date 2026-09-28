# marketingNEXT (next-community-2027) — membership brochure

Single-page React (Vite + Tailwind v4) app selling the marketingNEXT annual
membership. All content lives in `src/App.jsx` as plain arrays near the top
(`WHY`, `FORMAT`, `STANDARD`, `PROGRAMME`, `INCLUDES`, `TERMS`, `APPLY_STEPS`)
plus the `CONTACT` and `PRICE` constants — edit the arrays, not the markup.

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

- Develop on `main`. It became the source of truth on 23 Sep 2026, when the
  working branch was merged in (PR #1). The earlier `claude/...` branches are
  retired; do not develop on them or deploy from them.
- Run `npm run build` to verify changes compile.
- Redeploy gh-pages (see above).
- Commit with a clear message and push `main`. No PR is needed unless
  someone asks for a review first.

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

## The org move — links, Pages and what to verify

The repos moved from the `stuatnext` account to the `Nextdotio` org (Sep 2026).
GitHub redirects `github.com` repo URLs and git remotes on a transfer; it does
**not** redirect GitHub Pages. Every `stuatnext.github.io/...` URL 404s, so any
such link left in shipped code is a dead link on a client-facing page.

- The live site is `https://nextdotio.github.io/next-community-2027/`.
- Sweep `index.html` as well as `src/` and `public/`. `og:url` and `og:image`
  live only in `index.html`, so fixing `src/` alone leaves the page rendering
  correctly while still previewing against a dead URL wherever it is shared.
  Six sites stayed stale exactly that way after the first pass.
- `Published` from `npm run deploy` only means gh-pages accepted the push.
  Verify the deployed artefact, not the local build: fetch the live page, pull
  the hashed `assets/index-*.js` out of it, and grep that for
  `stuatnext.github.io`. It should come back empty.

## This repository is public

`Nextdotio/next-community-2027` is public (checked 28 Sep 2026), so everything
tracked here is world-readable — this file and `README.md` included, not just the built site.
Internal commercial reasoning belongs in a git-ignored file, never in a tracked
one. Some passages here predate that check and still carry pricing rationale the
card itself deliberately withholds, so treat anything written here as readable
by a client or a competitor, and review before adding more.
