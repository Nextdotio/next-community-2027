// ─── Present mode (26 Sep 2026) ────────────────────────────────────────────
// Adapted from the shared reference implementation: the behaviour is the same
// on every NEXT.io brochure; only the classes follow marketingNEXT (mn-*
// tokens, Inter, square controls with tracked uppercase labels, the page's
// film grain, yellow as the only accent).
//
// A presenter shares their screen and walks the buyer through the membership
// one slide at a time. The deck is built in App.jsx from the page's own
// arrays, so nothing on a slide is a new claim and new content appears in it
// automatically.
//
// Open:   ?present             -> the first slide
//         ?present=<slide id>  -> that slide (slide ids match the page's
//                                 section anchors: why, format, standard,
//                                 membership, programme, apply)
// Keys:   → Space PageDown = next · ← PageUp = back · Home End · G = all
//         slides · Esc = close (closes the slide list first when it is open)
// Touch:  swipe left or right; the slide itself scrolls vertically.

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { X, ChevronLeft, ChevronRight, LayoutGrid, Link2, Check } from 'lucide-react'

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// The URL carries the open slide, so a presenter can copy the address bar and
// send the exact slide. replaceState only: opening and moving through the
// deck are not navigations, and Back should not step through slides.
export function readPresentParam() {
  try {
    const p = new URLSearchParams(window.location.search)
    return p.has('present') ? (p.get('present') || '') : null
  } catch { return null }
}
export function writePresentParam(id) {
  try {
    const url = new URL(window.location.href)
    if (id === null) url.searchParams.delete('present')
    else url.searchParams.set('present', id)
    window.history.replaceState(window.history.state, '', url)
  } catch { /* no URL access: the deck still works */ }
}

// App-side state: `present` is null (closed), '' (first slide) or a slide id.
export function usePresent() {
  const [present, setPresent] = useState(readPresentParam)
  const open = useCallback((id = '') => { writePresentParam(id); setPresent(id) }, [])
  const close = useCallback(() => { writePresentParam(null); setPresent(null) }, [])
  return { present, open, close }
}

// ─── Copy link ──────────────────────────────────────────────────────────────
// The link a presenter sends: this page, its current parameters and the
// section's anchor. Never the present parameter.
export function linkTo(id) {
  const url = new URL(window.location.href)
  url.searchParams.delete('present')
  url.hash = id
  return url.href
}
export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch { /* fall back below */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.setAttribute('readonly', '')
    ta.style.position = 'fixed'
    ta.style.top = '-1000px'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(ta)
    return ok
  } catch { return false }
}
export function CopyLinkButton({ id, label = 'Copy link', className = '' }) {
  const [state, setState] = useState(null) // null | 'ok' | 'fail'
  const timer = useRef(null)
  useEffect(() => () => clearTimeout(timer.current), [])
  const onClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    const ok = await copyText(linkTo(id))
    setState(ok ? 'ok' : 'fail')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setState(null), 1800)
  }
  return (
    <button type="button" onClick={onClick} title="Copy a link to the membership"
      className={`inline-flex min-h-11 items-center gap-2 px-3 text-[11px] font-bold uppercase tracking-[0.16em] transition-colors ${className}`}>
      {state === 'ok' ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Link2 className="h-3.5 w-3.5" aria-hidden />}
      <span aria-live="polite">{state === 'ok' ? 'Link copied' : state === 'fail' ? 'Copy failed' : label}</span>
    </button>
  )
}

// ─── The deck ───────────────────────────────────────────────────────────────
// slides: [{ id, label, group, ...anything renderSlide needs }]
//   id     unique; section slides use the page's section anchor
//   label  short title, shown on the Next button and in the slide list
//   group  heading the slide sits under in the slide list
// renderSlide(slide, { go, goId, close, index }) returns the slide body.
// title  the top bar's label (rendered in caps, so never a brand name: CSS
//        caps would print MARKETINGNEXT; the logo carries the brand)
// name   the dialog's accessible name
// fallbackFocus  where focus goes on close when nothing on the page opened
//        the deck (a ?present link): returns an element or null
export function PresentMode({ slides, startId, onClose, renderSlide, title, name, logo = null, fallbackFocus }) {
  const [i, setI] = useState(() => {
    const at = slides.findIndex((s) => s.id === startId)
    return at >= 0 ? at : 0
  })
  const [listOpen, setListOpen] = useState(false)
  const [dir, setDir] = useState(0)
  const boxRef = useRef(null)
  const bodyRef = useRef(null)
  const touch = useRef(null)
  const fallbackRef = useRef(fallbackFocus)
  fallbackRef.current = fallbackFocus
  const last = slides.length - 1
  const slide = slides[Math.min(i, last)]

  const go = useCallback((n) => {
    setI((cur) => {
      const next = Math.max(0, Math.min(last, typeof n === 'function' ? n(cur) : n))
      setDir(next > cur ? 1 : next < cur ? -1 : 0)
      return next
    })
    setListOpen(false)
  }, [last])
  const goId = useCallback((id) => {
    const at = slides.findIndex((s) => s.id === id)
    if (at >= 0) go(at)
  }, [slides, go])

  // the address bar follows the slide
  const slideId = slide ? slide.id : null
  useEffect(() => { if (slideId !== null) writePresentParam(slideId) }, [slideId])
  // a new slide starts at its top
  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0 }, [i])

  // keyboard
  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const tag = (e.target && e.target.tagName) || ''
      const typing = /INPUT|TEXTAREA|SELECT/.test(tag) || (e.target && e.target.isContentEditable)
      if (e.key === 'Escape') { e.preventDefault(); if (listOpen) setListOpen(false); else onClose(); return }
      if (typing) return
      // Space on a focused button presses it; only an unfocused Space turns the page
      const onControl = tag === 'BUTTON' || tag === 'A'
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !onControl)) { e.preventDefault(); go((c) => c + 1) }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go((c) => c - 1) }
      else if (e.key === 'Home') { e.preventDefault(); go(0) }
      else if (e.key === 'End') { e.preventDefault(); go(last) }
      else if (e.key === 'g' || e.key === 'G') { e.preventDefault(); setListOpen((v) => !v) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [go, last, listOpen, onClose])

  // Back or Forward to an address without ?present closes the deck
  useEffect(() => {
    const onPop = () => { if (readPresentParam() === null) onClose() }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [onClose])

  // the page behind stays still and out of the tab order; focus returns to
  // whatever opened the deck (or, for a ?present link, the Present button)
  useEffect(() => {
    const root = document.getElementById('root')
    const html = document.documentElement
    const prevOverflow = html.style.overflow
    const opener = document.activeElement
    html.style.overflow = 'hidden'
    if (root) root.setAttribute('inert', '')
    boxRef.current?.focus()
    return () => {
      html.style.overflow = prevOverflow
      if (root) root.removeAttribute('inert')
      const own = opener && opener !== document.body && opener.isConnected ? opener : null
      const back = own || (fallbackRef.current ? fallbackRef.current() : null)
      if (back && typeof back.focus === 'function') back.focus({ preventScroll: true })
    }
  }, [])

  const onTouchStart = (e) => { const t = e.touches[0]; touch.current = { x: t.clientX, y: t.clientY } }
  const onTouchEnd = (e) => {
    const s = touch.current
    touch.current = null
    if (!s) return
    const t = e.changedTouches[0]
    const dx = t.clientX - s.x
    const dy = t.clientY - s.y
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go((c) => c + (dx < 0 ? 1 : -1))
  }

  if (!slide) return null
  const next = slides[i + 1]
  const groups = slides.reduce((acc, s, n) => {
    const g = acc[acc.length - 1]
    if (g && g.group === s.group) g.items.push([s, n])
    else acc.push({ group: s.group, items: [[s, n]] })
    return acc
  }, [])

  return createPortal(
    <div ref={boxRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label={`${name || title}, presentation`}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      className="pm grain fixed inset-0 z-[300] flex flex-col bg-mn-paper text-mn-ink outline-none"
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>

      {/* top bar: what this is, where you are, the way out */}
      <header className="relative z-10 flex items-center gap-3 border-b border-mn-line px-4 py-3 sm:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-4">
          {logo}
          <span className="hidden truncate text-[11px] font-bold uppercase tracking-[0.22em] text-mn-mute min-[420px]:inline">{title}</span>
        </div>
        <button type="button" onClick={() => setListOpen((v) => !v)} aria-expanded={listOpen}
          className="inline-flex h-10 items-center gap-2 border border-mn-ink/20 px-3 text-[12px] font-bold tabular-nums tracking-[0.1em] transition-colors hover:border-mn-red hover:text-mn-red sm:px-4">
          <LayoutGrid className="h-4 w-4" aria-hidden />{i + 1} / {slides.length}
          <span className="sr-only">, show all slides</span>
        </button>
        <button type="button" onClick={onClose} aria-label="Close the presentation"
          className="-mr-2 inline-flex h-10 min-w-10 items-center justify-center gap-2 px-2.5 text-mn-ink/80 transition-colors hover:bg-mn-ink/10 hover:text-mn-ink">
          <X className="h-5 w-5" aria-hidden /><span className="hidden text-[11px] font-bold uppercase tracking-[0.16em] text-mn-mute md:inline">Esc</span>
        </button>
      </header>

      {/* the slide */}
      <main ref={bodyRef} className="relative z-10 flex-1 overflow-y-auto overscroll-contain">
        <div key={slide.id}
          className="mx-auto flex min-h-full w-full max-w-6xl flex-col justify-center px-5 py-8 sm:px-10 sm:py-10"
          style={reducedMotion() ? undefined : { animation: `pm-in-${dir < 0 ? 'back' : 'fwd'} .28s ease-out both` }}>
          {renderSlide(slide, { go, goId, close: onClose, index: i })}
        </div>
      </main>

      {/* bottom bar: back, how far along, next */}
      <footer className="relative z-10 border-t border-mn-line">
        <div className="h-0.5 bg-mn-line" aria-hidden>
          <div className="h-full bg-mn-red transition-[width] duration-300" style={{ width: `${((i + 1) / slides.length) * 100}%` }} />
        </div>
        <div className="flex items-center gap-3 px-4 py-3 sm:px-8">
          <button type="button" onClick={() => go((c) => c - 1)} disabled={i === 0} aria-label="Previous slide"
            className="inline-flex h-11 min-w-11 items-center justify-center gap-1.5 border border-mn-ink/20 px-3 text-[12px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-mn-red hover:text-mn-red disabled:opacity-30 disabled:hover:border-mn-ink/20 disabled:hover:text-mn-ink sm:px-4">
            <ChevronLeft className="h-5 w-5" aria-hidden /><span className="hidden sm:inline">Back</span>
          </button>
          <p className="min-w-0 flex-1 truncate text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-mn-mute">{slide.group}</p>
          <button type="button" onClick={() => go((c) => c + 1)} disabled={!next}
            className="inline-flex h-11 max-w-[62%] items-center justify-center gap-1.5 bg-mn-red px-4 text-[12px] font-bold uppercase tracking-[0.12em] text-mn-paper transition hover:bg-mn-red-deep disabled:opacity-30 sm:px-5 sm:text-[13px]">
            <span className="truncate">{next ? <><span className="hidden md:inline">Next: </span>{next.label}</> : 'End'}</span>
            <ChevronRight className="h-5 w-5 shrink-0" aria-hidden />
          </button>
        </div>
      </footer>

      {/* every slide, grouped: the buyer asks about something, the presenter jumps to it */}
      {listOpen && (
        <div className="absolute inset-0 z-20 flex flex-col bg-mn-paper/[0.97] backdrop-blur-md" role="dialog" aria-label="All slides">
          <div className="flex items-center justify-between gap-3 border-b border-mn-line px-4 py-3 sm:px-8">
            <p className="text-[12px] font-bold uppercase tracking-[0.22em]">All slides</p>
            <button type="button" onClick={() => setListOpen(false)} aria-label="Close the slide list"
              className="inline-flex h-10 min-w-10 items-center justify-center hover:bg-mn-ink/10"><X className="h-5 w-5" aria-hidden /></button>
          </div>
          <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-8">
            <div className="mx-auto max-w-6xl gap-8 sm:columns-2 lg:columns-3">
              {groups.map((g, gi) => (
                <div key={`${g.group}-${gi}`} className="mb-6 break-inside-avoid">
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.22em] text-mn-red">{g.group}</p>
                  <ul>
                    {g.items.map(([s, n]) => (
                      <li key={s.id}>
                        <button type="button" onClick={() => go(n)} aria-current={n === i ? 'step' : undefined}
                          className={`flex min-h-11 w-full items-center gap-3 px-2 py-1.5 text-left text-[15px] transition-colors ${n === i ? 'bg-mn-red font-semibold text-mn-paper' : 'text-mn-ink/85 hover:bg-mn-ink/[0.06]'}`}>
                          <span className={`w-7 shrink-0 text-right text-xs tabular-nums ${n === i ? 'text-mn-paper/70' : 'text-mn-mute'}`}>{n + 1}</span>
                          <span className="min-w-0">{s.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>,
    document.body,
  )
}
