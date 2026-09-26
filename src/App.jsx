import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, Menu, X, Presentation,
  MessageSquare, Users, Phone, Ticket, BarChart3, UserPlus,
} from 'lucide-react'
import { PresentMode, usePresent, CopyLinkButton, reducedMotion } from './PresentMode.jsx'

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — everything the page says lives in these arrays.
   Edit here, not in the markup below. The Present mode deck reads the same
   arrays and constants, so an edit here changes the page and the deck.
   ──────────────────────────────────────────────────────────────────────────── */

// Enquiry address for every mailto on the page.
// TODO: confirm with Alina before first external send (set on the
// firstname@next.io pattern; swap here and every button follows).
const CONTACT = 'alina@next.io'

const PRICE = 4000 // EUR, per company, per year — flat, no tiers

// The one product, and how its price reads wherever it appears (hero
// summary, rate card, deck)
const PRODUCT_NAME = 'Annual membership'
const PRICE_UNIT = 'per company · per year'
// the footer's price line; the deck's terms slide repeats it
const PRICE_NOTE = 'All prices EUR, excl. VAT'
// how a company gets in: the fourth hero fact and the deck's membership slide
const AVAILABILITY = 'By application only'

// The hero (the deck's cover repeats it)
const HERO_TITLE = ['The marketing', 'surgery.']
const HERO_LEDE = 'A monthly peer-led session for senior iGaming marketers. One case study, one candid room, fifty-five minutes. Invitation-only — and worth the invitation.'

const HERO_META = [
  'One session a month',
  '55 minutes · virtual',
  'Two seats per company',
  AVAILABILITY,
]

// № 01 — why the community exists (public-safe framing of the objectives)
const WHY = [
  {
    n: '01',
    t: 'Intelligence you can act on',
    b: 'Real campaigns, real budgets, real results — presented by the people who ran them. The session ends with what you would do differently on Monday morning.',
  },
  {
    n: '02',
    t: 'A room with no audience',
    b: 'Everyone in the session runs marketing at a serious iGaming business. No vendors pitching, no juniors observing, no content repurposed for LinkedIn without your say.',
  },
  {
    n: '03',
    t: 'Peers before programme',
    b: 'The format is monthly, but the value is always-on: a curated group of senior marketers who know your market and take each other’s calls.',
  },
]

// № 02 — the anatomy of a session
const FORMAT = [
  {
    step: 'The case',
    b: 'A member — or a notable marketer we bring in — presents a real piece of work: the brief, the numbers, the decisions, what happened.',
  },
  {
    step: 'The surgery',
    // the candour line is carried by the pull-quote directly below this list
    b: 'The room reacts, builds on it and challenges it. Candour is the format.',
  },
  {
    step: 'The takeaway',
    b: 'Every session closes on the concrete: what the room would test, stop or steal. You leave with moves, not notes.',
  },
]

// the pull-quote under the format beats (two lines: the page breaks between
// them from sm up)
const FORMAT_QUOTE = [
  'What gets said in the surgery stays in the surgery —',
  'that is the whole point of the room.',
]

// № 03 — the membership standard
const STANDARD = [
  {
    t: 'Senior only',
    b: 'CMO, Head of Marketing, VP Growth. Not “senior marketing manager”. Not someone attending on behalf of their CMO.',
  },
  {
    t: 'A decade in the discipline',
    // "Not every marketer qualifies." is the section headline, so it is not repeated here
    b: 'Members bring ten or more years in marketing and the scars to show for it.',
  },
  {
    t: 'Two seats, held by the company',
    b: 'Both seats belong to the business’s most senior marketing leaders. Seats stay with the company, not the person.',
  },
  {
    t: 'Vouched for or reviewed',
    b: 'Entry is an application, not a form: who you are, the company you represent, what you would bring to the group. Existing members can nominate. Nobody gets in cold.',
  },
  {
    t: 'The seat can stay open',
    b: 'If the company’s most senior marketer can’t commit, the seat isn’t passed down — it stays open. That is what keeps the room worth being in.',
  },
]

// the closing line under the standard; `strong` is set bold
const STANDARD_CLOSE = {
  text: 'Being part of marketingNEXT should be worth a line on your LinkedIn profile. That only works if the room is ',
  strong: 'genuinely selective.',
}

// № 05 — the 2027 programme (topics set collaboratively; this is the planned arc)
const PROGRAMME = [
  { m: 'Jan', t: 'The ecosystem', b: 'Mapping the year before it starts — strategy the whole room can pressure-test.' },
  { m: 'Feb', t: 'Brand marketing', b: 'Planning the brand year ahead.' },
  { m: 'Mar', t: 'Advertising attribution', b: 'Where is the money actually going?' },
  { m: 'Apr', t: 'Attribution in practice', b: 'A working session on member data.' },
  { m: 'May', t: 'Influencer marketing', b: 'What is working, what is theatre.' },
  { m: 'Jun', t: 'Content strategy', b: 'Making content earn its budget.' },
  { m: 'Jul', t: 'Data-driven creative briefing', b: 'Briefs that start from evidence.' },
  { m: 'Aug', t: 'Agency vs in-house', b: 'The lab setup — what big-agency experience buys, and when to build instead.' },
  { m: 'Sep', t: 'Affiliate marketing', b: 'Understanding the nuances, told through member wins.' },
  { m: 'Oct', t: 'Building brands in new territories', b: 'Entering markets without burning the budget.' },
  { m: 'Nov', t: 'Members’ vote', b: 'The room picks the topic.' },
  { m: 'Dec', t: 'Year-end roundtable', b: 'What worked, what didn’t — said plainly.' },
]

// № 04 — what the annual membership includes (the hero summary lists these
// titles too, so a buyer sees what the price buys on the first screen)
const INCLUDES = [
  {
    icon: Users,
    t: 'Two seats for your two most senior marketers',
    b: 'Seats are held by the company, not the person.',
  },
  {
    icon: MessageSquare,
    t: 'Every monthly surgery',
    b: '55 minutes, case-study led, virtual. Industry leaders, practitioners and guest voices on what is actually working. No theory, no pitches.',
  },
  {
    icon: UserPlus,
    t: 'Four guest passes a year',
    b: 'Bring someone into a session without giving them a seat.',
  },
  {
    icon: Phone,
    t: 'Peer-on-demand access',
    b: 'Every member has agreed to take a call when another member needs one. A peer who has been there, not a helpdesk.',
  },
  {
    icon: Ticket,
    // the event's name held on one line (no-break spaces): the hero summary
    // otherwise broke it as "… to NEXT / Summit Valletta"
    t: 'Two Full Event passes to NEXT\u00a0Summit\u00a0Valletta',
    b: 'Included in membership — the community’s highest-visibility moment of the year.',
  },
  {
    icon: BarChart3,
    t: 'The community benchmarking report',
    b: 'Channel mix, budget allocation, team structures. Data that exists nowhere else, because nobody else shares it.',
  },
]

// the rate card's one-line summary under the price (the deck's membership
// slide leads with it)
const MEMBERSHIP_LEDE = 'Two senior seats, everything the community does, and both Valletta passes — in one line on one invoice.'

const TERMS = [
  'Membership is per company, billed annually.',
  'Entry is by application and review — existing members can nominate.',
  'Seats are senior-only and stay with the company.',
  'Sessions run under candour rules: what is shared in the room stays in the room.',
]

// № 06 — how to apply
const APPLY_STEPS = [
  {
    n: '1',
    t: 'Apply',
    b: 'Tell us who you are, the company you represent and what you would bring to the group. Three short paragraphs beat a CV.',
  },
  {
    n: '2',
    t: 'Review',
    b: 'The community lead reviews every application against the standard the founding cohort set. Existing members can vouch for you.',
  },
  {
    n: '3',
    t: 'Take your seat',
    b: 'Join the next monthly surgery, meet the room, and put marketingNEXT on your LinkedIn — it will mean something.',
  },
]

// Section order is the page order: the membership (the product) comes straight
// after the standard, ahead of the programme, which is supporting detail.
const NAV = [
  ['why', 'Why it exists'],
  ['format', 'The format'],
  ['standard', 'The standard'],
  ['membership', 'Membership'],
  ['programme', '2027 programme'],
]

// Section heads, in page order: the page's SectionHead and the deck's slides
// both read these, so a retitled section changes in both. `em` is the
// emphasised end of the title, set in italic. `sweep` marks a white section's
// one marker stroke; the deck is charcoal throughout, where the sweep reads
// muddy, so it sets that end in yellow instead.
const HEADS = {
  why: {
    no: '01',
    title: 'Real commercial intelligence, ',
    em: 'shared and acted on.',
    lead: 'Senior marketers in iGaming carry knowledge that never reaches a conference stage. marketingNEXT exists to put it in one trusted, peer-led room — and to make sure it leaves as action.',
  },
  format: {
    no: '02',
    title: 'Fifty-five minutes. ',
    em: 'No theory, no pitches.',
    lead: 'One virtual session a month, built around a single piece of real work. Topics are set with the members, so the programme follows the problems the room actually has.',
  },
  standard: {
    no: '03',
    title: 'Not every marketer ',
    em: 'qualifies.',
    sweep: true,
    lead: 'marketingNEXT is invitation-only. Membership is by application and review, two seats per company, and the founding cohort set the standard every new member is assessed against.',
  },
  membership: {
    no: '04',
    title: 'One membership. ',
    em: 'Flat.',
    lead: 'No tiers, no per-seat uplift, no add-ons to decode. Every member company holds the same two seats in the same room on the same terms.',
  },
  programme: {
    no: '05',
    title: 'The 2027 programme, ',
    em: 'month by month.',
    lead: 'The planned arc for the year. Topics are set collaboratively with members — the programme bends to what the room needs, not the other way round.',
  },
  apply: {
    no: '06',
    title: 'An application, ',
    em: 'not a form.',
    sweep: true,
    // no lead here: it restated steps 1 and 2, which sit directly below
  },
}

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

const eur = (n) => '€' + n.toLocaleString('en-IE')

const applyMailto = () => {
  const subject = 'marketingNEXT membership application'
  const body = [
    'Hi,',
    '',
    'I would like to apply for marketingNEXT membership.',
    '',
    'Who I am (role + years in marketing):',
    '',
    'The company I represent:',
    '',
    'What I would bring to the group:',
    '',
    'Nominated by a current member (if any):',
    '',
  ].join('\n')
  return `mailto:${CONTACT}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.animate-on-scroll')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add('visible')),
      { threshold: 0.12 },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function Wordmark({ className = 'h-8', variant = 'light' }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}logos/marketingnext-${variant}.svg`}
      alt="marketingNEXT"
      className={`w-auto ${className}`}
    />
  )
}

// A brand name inside an uppercase label keeps its own casing: CSS caps would
// render NEXT.IO and MARKETINGNEXT. Check rendered innerText, not the source.
function Brand({ children, className = '' }) {
  return <span className={`normal-case ${className}`}>{children}</span>
}

// The hero's eyebrow (the deck's cover repeats it). Balanced where it is set,
// with the dot bound to the first phrase, so a narrow screen breaks after it
// instead of opening a line with it.
function HeroEyebrow() {
  return <>A <Brand>NEXT.io</Brand> community&nbsp;· iGaming’s senior marketing circle</>
}

// A section title from HEADS. The page sets `em` in italic, with the marker
// sweep where a white (`dark`) section carries its one sweep; the deck sets a
// sweep's words in yellow, the dark-ground emphasis.
function HeadTitle({ head, dark = false, deck = false }) {
  const em = head.sweep ? (deck || !dark ? 'italic text-mn-red' : 'mark-sweep-paper italic') : 'italic'
  return <>{head.title}<span className={em}>{head.em}</span></>
}

function SectionHead({ head, dark = false }) {
  return (
    <div className={`animate-on-scroll ${dark ? 'rule-t-dark' : 'rule-t'} pt-5`}>
      <div className="flex items-baseline gap-4">
        <span className={`font-display text-sm italic font-semibold ${dark ? 'text-mn-paper' : 'text-mn-red'}`}>№ {head.no}</span>
        {/* /65 on the white sections: /50 was 3.1:1 at 11px */}
        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? 'text-mn-paper/65' : 'text-mn-mute'}`}>
          <Brand className="tracking-[0.06em]">marketingNEXT</Brand> · 2027
        </span>
      </div>
      <h2 className={`mt-5 font-display text-4xl leading-[1.04] font-semibold tracking-tight sm:text-5xl ${dark ? 'text-mn-paper' : 'text-mn-ink'}`}>
        <HeadTitle head={head} dark={dark} />
      </h2>
      {head.lead && (
        <p className={`mt-5 max-w-2xl text-[17px] leading-relaxed ${dark ? 'text-mn-paper/70' : 'text-mn-ink-soft'}`}>
          {head.lead}
        </p>
      )}
    </div>
  )
}

// One inclusion: icon, title, description. The membership section lists all
// six this way and the deck's membership slide reuses it (`compact`), so the
// two always match.
function IncludeItem({ inc, compact = false, className = '' }) {
  const Icon = inc.icon
  return (
    <div className={`flex bg-mn-paper ${compact ? 'gap-4 py-3' : 'gap-5 py-6'} ${className}`}>
      <span className={`mt-0.5 flex shrink-0 items-center justify-center border border-mn-ink/20 ${compact ? 'h-8 w-8' : 'h-9 w-9'}`}>
        <Icon className={`text-mn-red ${compact ? 'h-4 w-4' : 'h-4.5 w-4.5'}`} strokeWidth={2.2} aria-hidden />
      </span>
      <div>
        <h3 className={`font-display font-semibold tracking-tight ${compact ? 'text-lg leading-snug' : 'text-xl'}`}>{inc.t}</h3>
        <p className={`max-w-xl text-mn-ink-soft ${compact ? 'mt-1 text-[14.5px] leading-snug' : 'mt-1.5 text-[15px] leading-relaxed'}`}>{inc.b}</p>
      </div>
    </div>
  )
}

// The terms, word for word: small print on the rate card, full size on the
// deck's terms slide.
function TermsList({ size = 'card', className = '' }) {
  if (size === 'slide') {
    return (
      <ul className={`border-t border-mn-line ${className}`}>
        {TERMS.map((t) => (
          <li key={t} className="flex gap-4 border-b border-mn-line py-4 text-lg leading-snug text-mn-ink-soft sm:py-5 sm:text-xl">
            <span className="mt-[0.5em] h-1.5 w-1.5 shrink-0 rounded-full bg-mn-red" aria-hidden />
            {t}
          </li>
        ))}
      </ul>
    )
  }
  return (
    <ul className={`space-y-2.5 ${className}`}>
      {TERMS.map((t) => (
        <li key={t} className="flex gap-2.5 text-[13.5px] leading-snug text-mn-mute">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mn-red" aria-hidden />
          {t}
        </li>
      ))}
    </ul>
  )
}

// The application steps as a numbered timeline: yellow step markers joined by
// a rail, horizontal from sm up, a vertical spine on phones. `onWhite` for the
// page's white section; the deck's apply slide renders it on charcoal.
function ApplySteps({ onWhite = false, reveal = false, className = '' }) {
  return (
    <ol className={`grid sm:grid-cols-3 sm:gap-8 lg:gap-12 ${className}`}>
      {APPLY_STEPS.map((s, i) => (
        <li
          key={s.n}
          style={reveal ? { transitionDelay: `${i * 90}ms` } : undefined}
          className={`${reveal ? 'animate-on-scroll ' : ''}relative pb-10 pl-16 last:pb-0 sm:pb-0 sm:pl-0`}
        >
          {i < APPLY_STEPS.length - 1 && (
            <span
              aria-hidden
              className={`absolute bottom-3 left-5 top-[3.25rem] w-px sm:bottom-auto sm:left-[3.25rem] sm:right-[-1.25rem] sm:top-5 sm:h-px sm:w-auto lg:right-[-2.25rem] ${onWhite ? 'bg-mn-paper/15' : 'bg-mn-ink/15'}`}
            />
          )}
          <span className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center bg-mn-red font-display text-lg font-bold tabular-nums text-mn-paper sm:static">
            {s.n}
          </span>
          <h3 className={`pt-1 font-display text-2xl font-semibold tracking-tight sm:mt-7 sm:pt-0 ${onWhite ? 'text-mn-paper' : 'text-mn-ink'}`}>{s.t}</h3>
          <p className={`mt-3 max-w-sm leading-relaxed ${onWhite ? 'text-mn-paper/70' : 'text-mn-ink-soft'}`}>{s.b}</p>
        </li>
      ))}
    </ol>
  )
}

// The first screen's answer to "what can I buy and what does it cost": the one
// product, its price and the six deliverables by name, read from PRICE and
// INCLUDES. A summary only - descriptions and terms stay in the membership
// section, which "Membership details" jumps to. Price, then actions, then the
// list (the pricing-card order), so on a phone both buttons sit on the first
// screen; from sm to lg the list takes a second column.
function MembershipSummary({ summaryRef }) {
  return (
    <aside
      ref={summaryRef}
      aria-labelledby="summary-label"
      className="hero-rise hero-d4 border border-mn-line bg-mn-paper-deep p-5 min-[360px]:p-6 sm:grid sm:grid-cols-[minmax(0,15.5rem)_1fr] sm:gap-x-10 sm:p-8 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:block lg:self-start lg:p-7"
    >
      <div>
        <p id="summary-label" className="text-[12px] font-bold uppercase tracking-[0.24em] text-mn-red">{PRODUCT_NAME}</p>
        <p className="mt-3 font-display text-5xl font-semibold leading-none tracking-tight sm:text-6xl">{eur(PRICE)}</p>
        <p className="mt-2.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-mn-mute">{PRICE_UNIT}</p>
        <div className="mt-6 grid gap-2.5">
          <a
            href={applyMailto()}
            className="inline-flex h-12 items-center justify-center gap-2 bg-mn-red px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-mn-paper transition hover:bg-mn-red-deep"
          >
            Apply for a seat <ArrowUpRight className="h-4 w-4" />
          </a>
          <a
            href="#membership"
            className="inline-flex h-11 items-center justify-center gap-2 border border-mn-ink/30 px-4 text-[13px] font-bold uppercase tracking-[0.12em] text-mn-ink transition hover:border-mn-red hover:text-mn-red"
          >
            Membership details <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
      <ul className="mt-6 space-y-2.5 border-t border-mn-line pt-5 sm:mt-0 sm:border-t-0 sm:pt-0 lg:mt-6 lg:border-t lg:pt-5">
        {INCLUDES.map((inc) => (
          <li key={inc.t} className="flex gap-2.5 text-[14px] leading-snug text-mn-ink-soft">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-mn-red" strokeWidth={2.5} aria-hidden />
            {inc.t}
          </li>
        ))}
      </ul>
    </aside>
  )
}

// The nav's way into Present mode (data-present-button: where focus returns
// when a ?present link opened the deck). Labelled where the bar has room;
// `labelClass` hides the word where it has not, and the aria-label keeps the
// name "Present" either way.
function PresentButton({ onClick, className = '', labelClass = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Present"
      title="Present"
      data-present-button
      className={`h-10 items-center justify-center gap-2 border border-mn-ink/25 text-[13px] font-bold uppercase tracking-[0.14em] text-mn-ink transition hover:border-mn-red hover:text-mn-red ${className}`}
    >
      <Presentation className="h-4 w-4 shrink-0" aria-hidden />
      <span className={labelClass}>Present</span>
    </button>
  )
}

// quiet actions (Present, Copy link) on the rate card: never louder than the
// price or the Apply button
const QUIET = 'inline-flex min-h-11 items-center gap-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] text-mn-mute transition-colors hover:text-mn-ink'

/* ────────────────────────────────────────────────────────────────────────────
   Present mode: the deck
   ──────────────────────────────────────────────────────────────────────────── */

// Built from the arrays above, in page order: the cover, the three sections
// that make the case, the membership (the one product), the programme, then
// the terms and how to apply. A new criterion, inclusion, month, term or step
// appears on its slide automatically. Slide ids are the page's section
// anchors, so ?present=membership and #membership name the same thing.
const NAV_LABEL = Object.fromEntries(NAV)
const SLIDES = [
  { id: 'cover', label: 'Cover', group: 'Start' },
  { id: 'why', label: NAV_LABEL.why, group: 'The community', count: `${WHY.length} reasons` },
  { id: 'format', label: NAV_LABEL.format, group: 'The community', count: `${FORMAT.length} beats` },
  { id: 'standard', label: NAV_LABEL.standard, group: 'The community', count: `${STANDARD.length} criteria` },
  { id: 'membership', label: PRODUCT_NAME, group: NAV_LABEL.membership, count: `${eur(PRICE)} · ${INCLUDES.length} included` },
  { id: 'programme', label: NAV_LABEL.programme, group: NAV_LABEL.programme, count: `${PROGRAMME.length} months` },
  { id: 'terms', label: 'Terms', group: 'Next steps', count: `${TERMS.length} terms` },
  { id: 'apply', label: 'How to apply', group: 'Next steps', count: `${APPLY_STEPS.length} steps` },
]
// the membership slide shows up to six inclusions, then "+ N more on the card"
const SLIDE_INCLUDES = 6

function SlideEyebrow({ children }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-mn-red sm:text-xs">{children}</p>
}

function SlideTitle({ head, className = '' }) {
  return (
    <h2 className={`font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl ${className}`}>
      <HeadTitle head={head} deck />
    </h2>
  )
}

function SlideLead({ children, className = '' }) {
  return <p className={`max-w-2xl text-base leading-relaxed text-mn-ink-soft sm:text-lg ${className}`}>{children}</p>
}

function PriceLine({ className = '' }) {
  return (
    <p className={`flex flex-wrap items-baseline gap-x-4 gap-y-1 ${className}`}>
      <span className="font-display text-4xl font-semibold leading-none tracking-tight sm:text-5xl">{eur(PRICE)}</span>
      <span className="text-[12px] font-semibold uppercase tracking-[0.14em] text-mn-mute">{PRICE_UNIT}</span>
    </p>
  )
}

function CoverSlide({ goId }) {
  return (
    <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-x-14">
      <div className="lg:col-span-7">
        <Wordmark className="h-10 sm:h-12" />
        <p className="mt-7 text-balance text-[11px] font-bold uppercase tracking-[0.24em] text-mn-red sm:text-xs">
          <HeroEyebrow />
        </p>
        <h2 className="mt-4 font-display text-[clamp(2.5rem,12vw,3.75rem)] font-semibold leading-[0.98] tracking-tight sm:text-6xl xl:text-7xl">
          {HERO_TITLE[0]}<br />
          <span className="italic text-mn-red">{HERO_TITLE[1]}</span>
        </h2>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-mn-ink-soft sm:text-lg">{HERO_LEDE}</p>
        <div className="mt-7 rule-t pt-6">
          <PriceLine />
          <ul className="mt-5 grid gap-y-2 sm:grid-cols-2 sm:gap-x-8">
            {HERO_META.map((m) => (
              <li key={m} className="text-[12px] font-semibold uppercase tracking-[0.16em] text-mn-mute">{m}</li>
            ))}
          </ul>
        </div>
      </div>
      <nav aria-labelledby="pm-contents" className="lg:col-span-5">
        <p id="pm-contents" className="text-[11px] font-bold uppercase tracking-[0.24em] text-mn-mute">In this presentation</p>
        <ol className="mt-3 border-t border-mn-line">
          {SLIDES.slice(1).map((s, n) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => goId(s.id)}
                className="flex min-h-12 w-full items-center gap-4 border-b border-mn-line py-2 text-left transition-colors hover:text-mn-red"
              >
                <span className="w-5 shrink-0 text-[12px] tabular-nums text-mn-mute">{n + 2}</span>
                <span className="min-w-0 flex-1 font-display text-[17px] font-semibold tracking-tight sm:text-lg">{s.label}</span>
                <span className="shrink-0 text-right text-[13px] text-mn-mute">{s.count}</span>
              </button>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-[13px] text-mn-mute">Use the arrow keys, or swipe</p>
      </nav>
    </div>
  )
}

function WhySlide({ slide }) {
  return (
    <div>
      <SlideEyebrow>{slide.label}</SlideEyebrow>
      <SlideTitle head={HEADS.why} className="mt-4" />
      <SlideLead className="mt-5">{HEADS.why.lead}</SlideLead>
      <div className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
        {WHY.map((w) => (
          <div key={w.n} className="rule-t pt-5">
            <span className="font-display text-4xl font-light italic leading-none text-mn-red sm:text-5xl">{w.n}</span>
            <h3 className="mt-4 font-display text-xl font-semibold tracking-tight sm:text-2xl">{w.t}</h3>
            <p className="mt-2 leading-relaxed text-mn-ink-soft">{w.b}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

function FormatSlide({ slide }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
      <div className="lg:col-span-5">
        <SlideEyebrow>{slide.label}</SlideEyebrow>
        <SlideTitle head={HEADS.format} className="mt-4" />
        <SlideLead className="mt-5">{HEADS.format.lead}</SlideLead>
      </div>
      <ol className="border-t border-mn-line lg:col-span-7">
        {FORMAT.map((f, i) => (
          <li key={f.step} className="grid gap-1 border-b border-mn-line py-5 sm:grid-cols-[5.5rem_1fr] sm:items-baseline sm:gap-x-6">
            <span className="font-display text-base italic text-mn-mute">Beat {i + 1}</span>
            <div>
              <h3 className="font-display text-2xl font-semibold tracking-tight">{f.step}</h3>
              <p className="mt-1.5 leading-relaxed text-mn-ink-soft">{f.b}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="font-display text-xl italic leading-snug sm:text-2xl lg:col-span-12">
        “{FORMAT_QUOTE.join(' ')}”
      </p>
    </div>
  )
}

function StandardSlide({ slide }) {
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-x-14">
      <div className="lg:col-span-5">
        <SlideEyebrow>{slide.label}</SlideEyebrow>
        <SlideTitle head={HEADS.standard} className="mt-4" />
        <SlideLead className="mt-5">{HEADS.standard.lead}</SlideLead>
        <p className="mt-8 font-display text-xl italic leading-snug text-mn-ink/90">
          {STANDARD_CLOSE.text}<span className="not-italic font-bold text-mn-ink">{STANDARD_CLOSE.strong}</span>
        </p>
      </div>
      <ol className="border-t border-mn-line lg:col-span-7">
        {STANDARD.map((s, i) => (
          <li key={s.t} className="grid grid-cols-[2.25rem_1fr] items-baseline gap-x-3 border-b border-mn-line py-4 lg:py-3 xl:py-4">
            <span className="font-display text-lg font-light italic tabular-nums text-mn-red">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="font-display text-xl font-semibold tracking-tight">{s.t}</h3>
              <p className="mt-1 text-[15px] leading-relaxed text-mn-ink-soft">{s.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// The one product: name, price as the card states it, the card's own summary
// line, the ways to act on it (apply through the page's mailto, open the rate
// card, copy its link) and what the membership includes.
function MembershipSlide({ goId, onOpenCard }) {
  const shown = INCLUDES.slice(0, SLIDE_INCLUDES)
  const more = INCLUDES.length - shown.length
  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-14">
      <div className="lg:col-span-5">
        <SlideEyebrow>{NAV_LABEL.membership} · {AVAILABILITY}</SlideEyebrow>
        <h2 className="mt-4 font-display text-4xl font-semibold leading-[1.04] tracking-tight sm:text-5xl">{PRODUCT_NAME}</h2>
        <p className="mt-6 font-display text-6xl font-semibold leading-none tracking-tight sm:text-7xl">{eur(PRICE)}</p>
        <p className="mt-3 text-[12px] font-semibold uppercase tracking-[0.14em] text-mn-mute sm:text-sm">{PRICE_UNIT}</p>
        <p className="mt-6 max-w-md text-base leading-relaxed text-mn-ink-soft sm:text-lg">{MEMBERSHIP_LEDE}</p>
        <div className="mt-8 grid gap-2.5 sm:max-w-sm">
          <a
            href={applyMailto()}
            className="inline-flex h-12 items-center justify-center gap-2 bg-mn-red px-5 text-[13px] font-bold uppercase tracking-[0.12em] text-mn-paper transition hover:bg-mn-red-deep"
          >
            Apply for membership <ArrowUpRight className="h-4 w-4" aria-hidden />
          </a>
          <button
            type="button"
            onClick={() => onOpenCard('membership')}
            className="inline-flex h-11 items-center justify-center gap-2 border border-mn-ink/30 px-5 text-[13px] font-bold uppercase tracking-[0.12em] text-mn-ink transition hover:border-mn-red hover:text-mn-red"
          >
            Open the card <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="mt-2 flex flex-wrap items-center">
          <CopyLinkButton id="membership" className="-ml-3 text-mn-mute hover:text-mn-ink" />
          <button type="button" onClick={() => goId('terms')} className={QUIET}>
            See the terms <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="lg:col-span-7">
        <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-mn-mute">What you get</p>
        <div className="mt-3 space-y-px border-y border-mn-line bg-mn-line">
          {shown.map((inc) => <IncludeItem key={inc.t} inc={inc} compact />)}
        </div>
        {more > 0 && <p className="mt-4 text-[13px] text-mn-mute">+ {more} more on the card</p>}
      </div>
    </div>
  )
}

function ProgrammeSlide({ slide }) {
  return (
    <div>
      <div className="grid gap-5 lg:grid-cols-12 lg:items-end lg:gap-x-14">
        <div className="lg:col-span-7">
          <SlideEyebrow>{slide.label}</SlideEyebrow>
          <SlideTitle head={HEADS.programme} className="mt-4" />
        </div>
        <SlideLead className="lg:col-span-5 lg:text-base xl:text-lg">{HEADS.programme.lead}</SlideLead>
      </div>
      {/* the page's wall calendar, two rows of six (the two halves of the
          year) on a wide screen; an agenda list on phones */}
      <ol className="mt-8 border-y border-mn-line sm:grid sm:grid-cols-2 sm:gap-px sm:border sm:bg-mn-line md:grid-cols-3 lg:mt-6 lg:grid-cols-4 xl:mt-8 xl:grid-cols-6">
        {PROGRAMME.map((p, i) => (
          <li
            key={p.m}
            className="grid grid-cols-[3.25rem_1fr] items-baseline gap-x-3 border-t border-mn-line py-3 first:border-t-0 sm:block sm:border-t-0 sm:bg-mn-paper sm:p-4 lg:p-3.5 xl:p-4"
          >
            <time dateTime={`2027-${String(i + 1).padStart(2, '0')}`} className="font-display text-xl font-light italic leading-none tracking-tight text-mn-red sm:text-2xl">
              {p.m}
            </time>
            <div className="sm:mt-3 lg:mt-2 xl:mt-3">
              <h3 className="font-display text-[15px] font-semibold leading-snug tracking-tight">{p.t}</h3>
              <p className="mt-1 text-[13px] leading-snug text-mn-ink-soft">{p.b}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function TermsSlide({ slide }) {
  return (
    <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-x-14">
      <div className="lg:col-span-6">
        <SlideEyebrow>{slide.label}</SlideEyebrow>
        <SlideTitle head={HEADS.membership} className="mt-4" />
        <SlideLead className="mt-5">{HEADS.membership.lead}</SlideLead>
        <div className="mt-8 rule-t pt-6">
          <PriceLine />
          <p className="mt-3 text-[13px] text-mn-mute">{PRICE_NOTE}</p>
        </div>
      </div>
      <TermsList size="slide" className="lg:col-span-6" />
    </div>
  )
}

function ApplySlide({ slide }) {
  return (
    <div>
      <SlideEyebrow>{slide.label}</SlideEyebrow>
      <SlideTitle head={HEADS.apply} className="mt-4" />
      <ApplySteps className="mt-10" />
      <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4 rule-t pt-8">
        <a
          href={applyMailto()}
          className="inline-flex h-12 w-full items-center justify-center gap-2 bg-mn-red px-8 text-[13px] font-bold uppercase tracking-[0.12em] text-mn-paper transition hover:bg-mn-red-deep sm:w-auto"
        >
          Start your application <ArrowUpRight className="h-4 w-4" aria-hidden />
        </a>
        <p className="text-sm text-mn-ink-soft">
          Or write to <a href={`mailto:${CONTACT}`} className="-my-3 inline-block py-3 font-semibold text-mn-ink underline decoration-mn-red underline-offset-4">{CONTACT}</a>
        </p>
      </div>
    </div>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   Page
   ──────────────────────────────────────────────────────────────────────────── */

export default function App() {
  useReveal()
  const [open, setOpen] = useState(false)
  const year = new Date().getFullYear()
  const headerRef = useRef(null)
  const summaryRef = useRef(null)
  const menuButtonRef = useRef(null)

  // Present mode: ?present opens the deck (see PresentMode.jsx)
  const { present, open: openDeck, close: closeDeck } = usePresent()

  // "Open the card": close the deck, then land on the section once the page
  // is unlocked again (two frames: the deck has unmounted by then)
  const openCard = useCallback((id) => {
    closeDeck()
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const el = document.getElementById(id)
      if (!el) return
      try {
        const url = new URL(window.location.href)
        url.hash = id
        window.history.replaceState(window.history.state, '', url)
      } catch { /* the jump still happens */ }
      el.scrollIntoView({ behavior: reducedMotion() ? 'instant' : 'smooth', block: 'start' })
    }))
  }, [closeDeck])

  // a ?present link has no opener to hand focus back to: use the Present
  // button on screen, or the menu button that holds it on a phone
  const presentReturn = useCallback(() => {
    const shown = (el) => el.getClientRects().length > 0
    return [...document.querySelectorAll('[data-present-button]')].find(shown) || menuButtonRef.current
  }, [])

  const renderSlide = useCallback((slide, { goId }) => {
    switch (slide.id) {
      case 'cover': return <CoverSlide goId={goId} />
      case 'why': return <WhySlide slide={slide} />
      case 'format': return <FormatSlide slide={slide} />
      case 'standard': return <StandardSlide slide={slide} />
      case 'membership': return <MembershipSlide goId={goId} onOpenCard={openCard} />
      case 'programme': return <ProgrammeSlide slide={slide} />
      case 'terms': return <TermsSlide slide={slide} />
      case 'apply': return <ApplySlide slide={slide} />
      default: return null
    }
  }, [openCard])

  // Anchors land below the fixed header by measurement, not a hardcoded
  // offset: --nav-h feeds html's scroll-padding-top (index.css). Measured with
  // the phone menu closed - a menu tap closes it before the page moves.
  useEffect(() => {
    const el = headerRef.current
    if (!el) return
    const root = document.documentElement
    const set = () => {
      if (el.dataset.open !== 'true') root.style.setProperty('--nav-h', `${el.offsetHeight}px`)
    }
    set()
    const ro = new ResizeObserver(set)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Deep links (…/#membership) on first load: the browser looks for the target
  // before React has rendered it, so jump once the page exists, then keep the
  // target pinned while Inter swaps in and the layout settles (any resize of
  // the page re-jumps) - until the reader takes over or 2.5s pass.
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    if (!id || id === 'top' || !document.getElementById(id)) return
    const html = document.documentElement
    const jump = () => {
      const target = document.getElementById(id)
      if (!target) return
      const prev = html.style.scrollBehavior
      html.style.scrollBehavior = 'auto'
      target.scrollIntoView({ block: 'start' })
      html.style.scrollBehavior = prev
    }
    const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown']
    let live = true
    const ro = new ResizeObserver(() => { if (live) jump() })
    const release = () => {
      live = false
      ro.disconnect()
      clearTimeout(timer)
      inputs.forEach((e) => window.removeEventListener(e, release))
    }
    const timer = setTimeout(release, 2500)
    inputs.forEach((e) => window.addEventListener(e, release, { passive: true }))
    jump()
    ro.observe(document.body)
    document.fonts?.ready.then(() => { if (live) jump() })
    return release
  }, [])

  // Phones and tablets: a price chip in the header once the hero summary has
  // scrolled away, hidden again while the membership section is on screen.
  // Desktop already carries "Membership" in the nav.
  const [chip, setChip] = useState(false)
  useEffect(() => {
    let raf = 0
    const measure = () => {
      const navH = headerRef.current?.offsetHeight || 64
      const s = summaryRef.current?.getBoundingClientRect()
      const m = document.getElementById('membership')?.getBoundingClientRect()
      const past = s ? s.bottom < navH : false
      const onMembership = m ? m.top < window.innerHeight && m.bottom > navH : false
      setChip(past && !onMembership)
    }
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(measure) }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    measure()
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])
  const chipOn = chip && !open

  return (
    <div className="grain min-h-screen bg-mn-paper text-mn-ink">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header ref={headerRef} data-open={open} className="fixed inset-x-0 top-0 z-50 border-b border-mn-line bg-mn-paper/90 backdrop-blur">
        {/* 74.5rem = the sections' max-w-6xl plus this bar's own px-5, so the
            wordmark and Apply sit on the same edges as the page content */}
        <div className="mx-auto flex h-16 max-w-[74.5rem] items-center justify-between px-5">
          <a href="#top" className="flex h-16 items-center">
            <Wordmark className="h-9" />
          </a>
          {/* Present is an icon between lg and xl, where the five links and
              Apply already fill a 1024px bar; labelled from xl */}
          <nav className="hidden items-center gap-5 lg:flex xl:gap-7">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="flex h-10 items-center text-[13px] font-semibold uppercase tracking-[0.14em] text-mn-ink-soft transition hover:text-mn-red">
                {label}
              </a>
            ))}
            <PresentButton onClick={() => openDeck()} className="flex w-10 xl:w-auto xl:px-4" labelClass="hidden xl:inline" />
            <a
              href={applyMailto()}
              className="inline-flex h-10 items-center gap-2 bg-mn-ink px-5 text-[13px] font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red"
            >
              Apply <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="#membership"
              aria-hidden={!chipOn}
              tabIndex={chipOn ? 0 : -1}
              className={`inline-flex h-10 items-center gap-1.5 border border-mn-ink/25 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-mn-ink transition duration-300 hover:border-mn-red hover:text-mn-red ${chipOn ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
            >
              <span className="hidden sm:inline">Membership ·&nbsp;</span>{eur(PRICE)}/yr <ArrowRight className="h-3.5 w-3.5" />
            </a>
            {/* tablets: the bar has room for a labelled Present; phones
                find it in the menu */}
            <PresentButton onClick={() => { setOpen(false); openDeck() }} className="hidden px-4 md:inline-flex" />
            <button
              ref={menuButtonRef}
              className="-mr-2.5 flex h-11 w-11 items-center justify-center"
              onClick={() => setOpen(!open)}
              aria-label="Menu"
              aria-expanded={open}
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {open && (
          <nav className="border-t border-mn-line bg-mn-paper px-5 py-3 lg:hidden">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="flex h-11 items-center text-sm font-semibold uppercase tracking-[0.14em] text-mn-ink-soft">
                {label}
              </a>
            ))}
            <button
              type="button"
              onClick={() => { setOpen(false); openDeck() }}
              className="flex h-11 w-full items-center gap-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-mn-ink-soft md:hidden"
            >
              <Presentation className="h-4 w-4" aria-hidden /> Present
            </button>
            <a href={applyMailto()} className="mt-2 mb-1 inline-flex h-11 items-center gap-2 bg-mn-ink px-5 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper">
              Apply <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      {/* Two columns from lg: the pitch on the left with its four facts
          bottom-aligned to the membership summary on the right, so the whole
          offer sits on a 1280 x 800 first screen. Below lg the summary follows
          the pitch; on a phone its price and both buttons stay above the fold. */}
      <section id="top" className="relative overflow-hidden px-5 pb-16 pt-28 sm:pb-20 sm:pt-36">
        <div className="mx-auto grid max-w-6xl gap-y-10 lg:grid-cols-[minmax(0,1fr)_22rem] lg:grid-rows-[auto_1fr] lg:gap-x-12 xl:grid-cols-[minmax(0,1fr)_24rem] xl:gap-x-16">
          <div className="lg:col-start-1 lg:row-start-1">
            <p className="hero-rise hero-d1 text-balance text-[12px] font-bold uppercase tracking-[0.26em] text-mn-red">
              <HeroEyebrow />
            </p>
            {/* sized to the viewport below sm so "The marketing" holds one line
                (at 60px it broke to The / marketing / surgery.) */}
            <h1 className="hero-rise hero-d2 mt-6 font-display text-[clamp(2.5rem,13vw,3.75rem)] font-semibold leading-[0.98] tracking-tight sm:text-7xl xl:text-8xl">
              {HERO_TITLE[0]}<br />
              <span className="text-mn-red italic">{HERO_TITLE[1]}</span>
            </h1>
            <p className="hero-rise hero-d3 mt-6 max-w-2xl text-lg leading-relaxed text-mn-ink-soft sm:mt-8 sm:text-xl">
              {HERO_LEDE}
            </p>
          </div>
          <MembershipSummary summaryRef={summaryRef} />
          {/* one column on phones, 2 × 2 from sm (a wrapped row strands the
              last fact on its own line) */}
          <ul className="hero-rise hero-d4 grid gap-y-3 rule-t pt-6 sm:grid-cols-2 sm:gap-x-8 lg:col-start-1 lg:row-start-2 lg:self-end">
            {HERO_META.map((m) => (
              <li key={m} className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mn-mute">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── № 01 · WHY ──────────────────────────────────────────────────── */}
      <section id="why" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead head={HEADS.why} />
          <div className="mt-12 grid gap-px bg-mn-line sm:grid-cols-3">
            {WHY.map((w) => (
              <div key={w.n} className="animate-on-scroll bg-mn-paper py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-5xl font-light italic text-mn-red">{w.n}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight">{w.t}</h3>
                <p className="mt-3 leading-relaxed text-mn-ink-soft">{w.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── № 02 · FORMAT ───────────────────────────────────────────────── */}
      <section id="format" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead head={HEADS.format} />
          <div className="mt-12 space-y-px bg-mn-line">
            {FORMAT.map((f, i) => (
              <div key={f.step} className="animate-on-scroll grid gap-4 bg-mn-paper py-8 sm:grid-cols-[140px_220px_1fr] sm:items-baseline">
                <span className="font-display text-lg italic text-mn-mute">Beat {i + 1}</span>
                <h3 className="font-display text-3xl font-semibold tracking-tight">{f.step}</h3>
                <p className="max-w-2xl leading-relaxed text-mn-ink-soft">{f.b}</p>
              </div>
            ))}
          </div>
          <p className="animate-on-scroll rule-t mt-px pt-8 font-display text-2xl italic leading-snug text-mn-ink sm:text-3xl">
            “{FORMAT_QUOTE[0]}{' '}<br className="hidden sm:block" />
            {FORMAT_QUOTE[1]}”
          </p>
        </div>
      </section>

      {/* ── № 03 · THE STANDARD (dark) ──────────────────────────────────── */}
      <section id="standard" className="bg-mn-ink px-5 py-20 text-mn-paper sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead dark head={HEADS.standard} />
          {/* the five criteria read as one list (same row anatomy as the format
              beats) - a 2-col grid stranded the fifth on its own. Numerals are
              charcoal here: thin yellow type on white all but disappears (/65:
              /45 was 2.7:1). From xl the title column fits every criterion on
              one line, so no row breaks the rhythm. */}
          <ol className="mt-12 border-b border-mn-line-dark">
            {STANDARD.map((s, i) => (
              <li
                key={s.t}
                className="animate-on-scroll rule-t-dark grid grid-cols-[2.5rem_1fr] items-baseline gap-x-3 gap-y-2 py-7 sm:grid-cols-[3.5rem_1fr] sm:gap-x-4 lg:grid-cols-[4.5rem_minmax(0,19rem)_1fr] lg:gap-x-8 xl:grid-cols-[4.5rem_minmax(0,23rem)_1fr]"
              >
                <span className="font-display text-xl font-light italic tabular-nums text-mn-paper/65 sm:text-2xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-mn-paper">{s.t}</h3>
                <p className="col-start-2 max-w-2xl leading-relaxed text-mn-paper/70 lg:col-start-3">{s.b}</p>
              </li>
            ))}
          </ol>
          {/* bold, not a second sweep: the headline already carries this section's one */}
          <p className="animate-on-scroll mt-14 max-w-3xl font-display text-2xl italic leading-snug text-mn-paper/90 sm:text-3xl">
            {STANDARD_CLOSE.text}<span className="not-italic font-bold text-mn-paper">{STANDARD_CLOSE.strong}</span>
          </p>
        </div>
      </section>

      {/* ── № 04 · MEMBERSHIP ───────────────────────────────────────────── */}
      <section id="membership" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead head={HEADS.membership} />
          <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(320px,420px)_1fr]">
            {/* the rate card */}
            <div className="animate-on-scroll self-start border-2 border-mn-ink bg-mn-paper-deep p-6 sm:p-10">
              <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-mn-red">{PRODUCT_NAME}</p>
              <div className="mt-4 font-display text-6xl font-semibold tracking-tight min-[360px]:text-7xl">
                {eur(PRICE)}
              </div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-mn-mute">
                {PRICE_UNIT}
              </p>
              {/* "flat, no tiers, no per-seat uplift" is the section lead just above */}
              <p className="mt-5 leading-relaxed text-mn-ink-soft">
                {MEMBERSHIP_LEDE}
              </p>
              <a
                href={applyMailto()}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 text-center bg-mn-red px-3 py-4 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red-deep sm:px-6"
              >
                Apply for membership <ArrowUpRight className="h-4 w-4" />
              </a>
              {/* quiet: walk a buyer through it on a call, or send them here */}
              <div className="mt-2 flex flex-wrap items-center justify-center">
                <button type="button" onClick={() => openDeck('membership')} className={QUIET}>
                  <Presentation className="h-3.5 w-3.5" aria-hidden /> Present
                </button>
                <CopyLinkButton id="membership" className="text-mn-mute hover:text-mn-ink" />
              </div>
              <TermsList className="mt-5 rule-t pt-6" />
            </div>
            {/* what's included */}
            <div className="space-y-px bg-mn-line">
              {INCLUDES.map((inc) => (
                <IncludeItem key={inc.t} inc={inc} className="animate-on-scroll" />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── № 05 · PROGRAMME ────────────────────────────────────────────── */}
      <section id="programme" className="px-5 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead head={HEADS.programme} />
          {/* A wall calendar: months run left to right, a row per third of the
              year on desktop and a quarter per row on tablets; phones get an
              agenda list with the month as the date block. The month stands
              alone - an index beside it ("01 Jan") read as a date. */}
          <ol className="mt-12 border-y border-mn-line sm:grid sm:grid-cols-2 sm:gap-px sm:border sm:bg-mn-line md:grid-cols-3 lg:grid-cols-4">
            {PROGRAMME.map((p, i) => (
              <li
                key={p.m}
                style={{ transitionDelay: `${(i % 4) * 70}ms` }}
                className="animate-on-scroll grid grid-cols-[3.5rem_1fr] items-baseline gap-x-4 border-t border-mn-line py-5 first:border-t-0 sm:flex sm:flex-col sm:border-t-0 sm:bg-mn-paper sm:p-6 lg:p-7"
              >
                <time
                  dateTime={`2027-${String(i + 1).padStart(2, '0')}`}
                  className="font-display text-2xl font-light italic leading-none tracking-tight text-mn-red sm:text-4xl"
                >
                  {p.m}
                </time>
                <div className="sm:mt-7">
                  <h3 className="font-display text-lg font-semibold leading-snug tracking-tight sm:text-xl">{p.t}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-mn-ink-soft">{p.b}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── № 06 · APPLY ────────────────────────────────────────────────── */}
      <section id="apply" className="bg-mn-ink px-5 py-20 text-mn-paper sm:py-24">
        <div className="mx-auto max-w-6xl">
          <SectionHead dark head={HEADS.apply} />
          <ApplySteps onWhite reveal className="mt-12" />
          <div className="animate-on-scroll mt-14 flex flex-wrap items-center gap-5 rule-t-dark pt-10">
            <a
              href={applyMailto()}
              className="inline-flex w-full items-center justify-center gap-2 text-center bg-mn-red px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red-deep sm:w-auto"
            >
              Start your application <ArrowUpRight className="h-4 w-4" />
            </a>
            {/* "three short paragraphs beat a CV" is step 1, directly above */}
            <p className="text-sm text-mn-paper/70">
              Or write to <a href={`mailto:${CONTACT}`} className="-my-3 inline-block py-3 font-semibold text-mn-paper underline decoration-mn-red underline-offset-4">{CONTACT}</a>
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-mn-line px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <Wordmark className="h-11" />
            {/* "A NEXT.io" held together, so a wrap never leaves the A behind */}
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mn-mute">
              A monthly peer-led marketing surgery for senior iGaming marketers.
              A&nbsp;NEXT.io portfolio project.
            </p>
          </div>
          <div className="text-sm text-mn-mute">
            <a href={`mailto:${CONTACT}`} className="-my-3 inline-block py-3 font-semibold text-mn-ink transition hover:text-mn-red">{CONTACT}</a>
            <p className="mt-1">© {year} NEXT.io · {PRICE_NOTE}</p>
          </div>
        </div>
      </footer>

      {present !== null && (
        <PresentMode
          slides={SLIDES}
          startId={present}
          onClose={closeDeck}
          renderSlide={renderSlide}
          title="Membership 2027"
          name="marketingNEXT membership 2027"
          logo={<Wordmark className="h-7" />}
          fallbackFocus={presentReturn}
        />
      )}
    </div>
  )
}
