import { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, ArrowUpRight, Check, Menu, X,
  MessageSquare, Users, Phone, Ticket, BarChart3, UserPlus,
} from 'lucide-react'

/* ────────────────────────────────────────────────────────────────────────────
   CONTENT — everything the page says lives in these arrays.
   Edit here, not in the markup below.
   ──────────────────────────────────────────────────────────────────────────── */

// Enquiry address for every mailto on the page.
// TODO: confirm with Alina before first external send (set on the
// firstname@next.io pattern; swap here and every button follows).
const CONTACT = 'alina@next.io'

const PRICE = 4000 // EUR, per company, per year — flat, no tiers

const HERO_META = [
  'One session a month',
  '55 minutes · virtual',
  'Two seats per company',
  'By application only',
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
    b: 'The room reacts, builds on it and challenges it. Candour is the format. What gets said in the session stays in the session.',
  },
  {
    step: 'The takeaway',
    b: 'Every session closes on the concrete: what the room would test, stop or steal. You leave with moves, not notes.',
  },
]

// № 03 — the membership standard
const STANDARD = [
  {
    t: 'Senior only',
    b: 'CMO, Head of Marketing, VP Growth. Not “senior marketing manager”. Not someone attending on behalf of their CMO.',
  },
  {
    t: 'A decade in the discipline',
    b: 'Not every marketer qualifies. Members bring ten or more years in marketing and the scars to show for it.',
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

// № 04 — the 2027 programme (topics set collaboratively; this is the planned arc)
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

// № 05 — what the annual membership includes
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
    t: 'Two Full Event passes to NEXT Summit Valletta',
    b: 'Included in membership — the community’s highest-visibility moment of the year.',
  },
  {
    icon: BarChart3,
    t: 'The community benchmarking report',
    b: 'Channel mix, budget allocation, team structures. Data that exists nowhere else, because nobody else shares it.',
  },
]

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

const NAV = [
  ['why', 'Why it exists'],
  ['format', 'The format'],
  ['standard', 'The standard'],
  ['programme', '2027 programme'],
  ['membership', 'Membership'],
]

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

function SectionHead({ no, title, lead, dark = false }) {
  return (
    <div className={`animate-on-scroll ${dark ? 'rule-t-dark' : 'rule-t'} pt-5`}>
      <div className="flex items-baseline gap-4">
        <span className={`font-display text-sm italic font-semibold ${dark ? 'text-mn-paper' : 'text-mn-red'}`}>№ {no}</span>
        <span className={`text-[11px] font-bold uppercase tracking-[0.22em] ${dark ? 'text-mn-paper/50' : 'text-mn-mute'}`}>
          marketingNEXT · 2027
        </span>
      </div>
      <h2 className={`mt-5 font-display text-4xl leading-[1.04] font-semibold tracking-tight sm:text-5xl ${dark ? 'text-mn-paper' : 'text-mn-ink'}`}>
        {title}
      </h2>
      {lead && (
        <p className={`mt-5 max-w-2xl text-[17px] leading-relaxed ${dark ? 'text-mn-paper/70' : 'text-mn-ink-soft'}`}>
          {lead}
        </p>
      )}
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

  return (
    <div className="grain min-h-screen bg-mn-paper text-mn-ink">

      {/* ── NAV ─────────────────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50 border-b border-mn-line bg-mn-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <a href="#top" className="flex items-center">
            <Wordmark className="h-9" />
          </a>
          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} className="text-[13px] font-semibold uppercase tracking-[0.14em] text-mn-ink-soft transition hover:text-mn-red">
                {label}
              </a>
            ))}
            <a
              href={applyMailto()}
              className="inline-flex items-center gap-2 bg-mn-ink px-5 py-2.5 text-[13px] font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red"
            >
              Apply <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
        {open && (
          <nav className="border-t border-mn-line bg-mn-paper px-5 py-4 lg:hidden">
            {NAV.map(([id, label]) => (
              <a key={id} href={`#${id}`} onClick={() => setOpen(false)} className="block py-2.5 text-sm font-semibold uppercase tracking-[0.14em] text-mn-ink-soft">
                {label}
              </a>
            ))}
            <a href={applyMailto()} className="mt-2 inline-flex items-center gap-2 bg-mn-ink px-5 py-2.5 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper">
              Apply <ArrowUpRight className="h-4 w-4" />
            </a>
          </nav>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section id="top" className="relative overflow-hidden px-5 pb-20 pt-36 sm:pt-44">
        {/* oversized year, set like a folio number */}
        <div aria-hidden className="pointer-events-none absolute -right-6 top-24 hidden select-none font-display text-[16rem] font-black leading-none tracking-tighter text-mn-ink/[0.05] lg:block">
          ’27
        </div>
        <div className="mx-auto max-w-6xl">
          <p className="hero-rise hero-d1 text-[12px] font-bold uppercase tracking-[0.26em] text-mn-red">
            A NEXT.io community · iGaming’s senior marketing circle
          </p>
          <h1 className="hero-rise hero-d2 mt-6 max-w-4xl font-display text-6xl font-semibold leading-[0.98] tracking-tight sm:text-7xl lg:text-8xl">
            The marketing<br />
            <span className="text-mn-red italic">surgery.</span>
          </h1>
          <p className="hero-rise hero-d3 mt-8 max-w-2xl text-lg leading-relaxed text-mn-ink-soft sm:text-xl">
            A monthly peer-led session for senior iGaming marketers. One case study,
            one candid room, fifty-five minutes. Invitation-only — and worth the invitation.
          </p>
          <div className="hero-rise hero-d4 mt-10 flex flex-wrap items-center gap-4">
            <a href="#membership" className="inline-flex items-center gap-2 bg-mn-red px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red-deep">
              Membership · {eur(PRICE)}/yr <ArrowRight className="h-4 w-4" />
            </a>
            <a href={applyMailto()} className="inline-flex items-center gap-2 border border-mn-ink px-7 py-3.5 text-sm font-bold uppercase tracking-[0.14em] text-mn-ink transition hover:border-mn-red hover:text-mn-red">
              Apply for a seat
            </a>
          </div>
          <ul className="hero-rise hero-d4 mt-12 flex flex-wrap gap-x-8 gap-y-3 rule-t pt-6">
            {HERO_META.map((m) => (
              <li key={m} className="text-[13px] font-semibold uppercase tracking-[0.16em] text-mn-mute">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── № 01 · WHY ──────────────────────────────────────────────────── */}
      <section id="why" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            no="01"
            title={<>Real commercial intelligence, <span className="italic">shared and acted on.</span></>}
            lead="Senior marketers in iGaming carry knowledge that never reaches a conference stage. marketingNEXT exists to put it in one trusted, peer-led room — and to make sure it leaves as action."
          />
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
      <section id="format" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            no="02"
            title={<>Fifty-five minutes. <span className="italic">No theory, no pitches.</span></>}
            lead="One virtual session a month, built around a single piece of real work. Topics are set with the members, so the programme follows the problems the room actually has."
          />
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
            “What gets said in the surgery stays in the surgery —<br className="hidden sm:block" />
            that is the whole point of the room.”
          </p>
        </div>
      </section>

      {/* ── № 03 · THE STANDARD (dark) ──────────────────────────────────── */}
      <section id="standard" className="bg-mn-ink px-5 py-24 text-mn-paper">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            dark
            no="03"
            title={<>Not every marketer <span className="mark-sweep-paper italic">qualifies.</span></>}
            lead="marketingNEXT is invitation-only. Membership is by application and review, two seats per company, and the founding cohort set the standard every new member is assessed against."
          />
          <div className="mt-12 grid gap-x-12 gap-y-10 sm:grid-cols-2">
            {STANDARD.map((s, i) => (
              <div key={s.t} className={`animate-on-scroll rule-t-dark pt-6 ${i === STANDARD.length - 1 ? 'sm:col-span-2 sm:max-w-2xl' : ''}`}>
                <h3 className="font-display text-2xl font-semibold tracking-tight text-mn-paper">
                  <span className="mr-3 font-light italic text-mn-red">{String(i + 1).padStart(2, '0')}</span>
                  {s.t}
                </h3>
                <p className="mt-3 leading-relaxed text-mn-paper/70">{s.b}</p>
              </div>
            ))}
          </div>
          <p className="animate-on-scroll mt-14 max-w-3xl font-display text-2xl italic leading-snug text-mn-paper/90 sm:text-3xl">
            Being part of marketingNEXT should be worth a line on your LinkedIn profile.
            That only works if the room is <span className="not-italic font-bold mark-sweep-paper">genuinely selective.</span>
          </p>
        </div>
      </section>

      {/* ── № 04 · PROGRAMME ────────────────────────────────────────────── */}
      <section id="programme" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            no="04"
            title={<>The 2027 programme, <span className="italic">month by month.</span></>}
            lead="The planned arc for the year. Topics are set collaboratively with members — the programme bends to what the room needs, not the other way round."
          />
          <div className="mt-12 grid gap-x-12 lg:grid-cols-2">
            {PROGRAMME.map((p, i) => (
              <div key={p.m} className="animate-on-scroll rule-t grid grid-cols-[64px_1fr] gap-4 py-5">
                <div>
                  <span className="font-display text-sm italic text-mn-red">{String(i + 1).padStart(2, '0')}</span>
                  <div className="text-[12px] font-bold uppercase tracking-[0.18em] text-mn-mute">{p.m}</div>
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight">{p.t}</h3>
                  <p className="mt-1 text-[15px] leading-relaxed text-mn-ink-soft">{p.b}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── № 05 · MEMBERSHIP ───────────────────────────────────────────── */}
      <section id="membership" className="px-5 py-20">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            no="05"
            title={<>One membership. <span className="italic">Flat.</span></>}
            lead="No tiers, no per-seat uplift, no add-ons to decode. Every member company holds the same two seats in the same room on the same terms."
          />
          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(320px,420px)_1fr]">
            {/* the rate card */}
            <div className="animate-on-scroll self-start border-2 border-mn-ink bg-mn-paper-deep p-8 sm:p-10">
              <p className="text-[12px] font-bold uppercase tracking-[0.24em] text-mn-red">Annual membership</p>
              <div className="mt-4 font-display text-7xl font-semibold tracking-tight">
                {eur(PRICE)}
              </div>
              <p className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-mn-mute">
                per company · per year
              </p>
              <p className="mt-5 leading-relaxed text-mn-ink-soft">
                Flat. No tiers. No per-seat uplift. Two senior seats, everything the community
                does, and both Valletta passes — in one line on one invoice.
              </p>
              <a
                href={applyMailto()}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 bg-mn-red px-6 py-4 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red-deep"
              >
                Apply for membership <ArrowUpRight className="h-4 w-4" />
              </a>
              <ul className="mt-8 space-y-2.5 rule-t pt-6">
                {TERMS.map((t) => (
                  <li key={t} className="flex gap-2.5 text-[13.5px] leading-snug text-mn-mute">
                    <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-mn-red" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            {/* what's included */}
            <div className="space-y-px bg-mn-line">
              {INCLUDES.map((inc) => (
                <div key={inc.t} className="animate-on-scroll flex gap-5 bg-mn-paper py-6">
                  <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-mn-ink/20">
                    <inc.icon className="h-4.5 w-4.5 text-mn-red" strokeWidth={2.2} />
                  </span>
                  <div>
                    <h3 className="flex items-start gap-2 font-display text-xl font-semibold tracking-tight">
                      {inc.t}
                    </h3>
                    <p className="mt-1.5 max-w-xl text-[15px] leading-relaxed text-mn-ink-soft">{inc.b}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── № 06 · APPLY ────────────────────────────────────────────────── */}
      <section id="apply" className="bg-mn-ink px-5 py-24 text-mn-paper">
        <div className="mx-auto max-w-6xl">
          <SectionHead
            dark
            no="06"
            title={<>An application, <span className="mark-sweep-paper italic">not a form.</span></>}
            lead="Candidates submit who they are, what company they represent and what they would bring to the group. The community lead reviews every application; existing members can nominate."
          />
          <div className="mt-12 grid gap-px bg-mn-line-dark sm:grid-cols-3">
            {APPLY_STEPS.map((s) => (
              <div key={s.n} className="animate-on-scroll bg-mn-ink py-8 sm:px-8 sm:first:pl-0 sm:last:pr-0">
                <span className="font-display text-5xl font-light italic text-mn-red">{s.n}</span>
                <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight text-mn-paper">{s.t}</h3>
                <p className="mt-3 leading-relaxed text-mn-paper/70">{s.b}</p>
              </div>
            ))}
          </div>
          <div className="animate-on-scroll mt-14 flex flex-wrap items-center gap-5 rule-t-dark pt-10">
            <a
              href={applyMailto()}
              className="inline-flex items-center gap-2 bg-mn-red px-8 py-4 text-sm font-bold uppercase tracking-[0.14em] text-mn-paper transition hover:bg-mn-red-deep"
            >
              Start your application <ArrowUpRight className="h-4 w-4" />
            </a>
            <p className="text-sm text-mn-paper/60">
              Or write to <a href={`mailto:${CONTACT}`} className="font-semibold text-mn-paper underline decoration-mn-red underline-offset-4">{CONTACT}</a> — three short paragraphs beat a CV.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────── */}
      <footer className="border-t border-mn-line px-5 py-12">
        <div className="mx-auto flex max-w-6xl flex-wrap items-end justify-between gap-6">
          <div>
            <Wordmark className="h-11" />
            <p className="mt-2 max-w-md text-sm leading-relaxed text-mn-mute">
              A monthly peer-led marketing surgery for senior iGaming marketers.
              A NEXT.io portfolio project.
            </p>
          </div>
          <div className="text-sm text-mn-mute">
            <a href={`mailto:${CONTACT}`} className="font-semibold text-mn-ink transition hover:text-mn-red">{CONTACT}</a>
            <p className="mt-1">© {year} NEXT.io · All prices EUR, excl. VAT</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
