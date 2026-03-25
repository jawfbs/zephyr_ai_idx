'use client'
import { useState, useEffect, useRef, useCallback } from 'react'

// ── Step definitions ──────────────────────────────────────────────────────────
// target: CSS selector of the real element to highlight
// position: where the tooltip appears relative to the element
const STEPS = [
  {
    id:          'welcome',
    title:       'Welcome to ZephyrAI IDX 👋',
    description: 'The smartest AI-powered real estate platform in the Fargo area. This quick tour will show you everything — click Next or press → to continue.',
    target:      null,
    position:    'center',
    spotlight:   false,
  },
  {
    id:          'search',
    title:       '🔍 Search Any Way You Want',
    description: 'Type a city name, zip code, address, or MLS number here. Try "West Fargo" or "58078" to filter instantly. Press Enter or click Search.',
    target:      'input[placeholder*="City, Zip"]',
    position:    'bottom',
    spotlight:   true,
    pulse:       true,
  },
  {
    id:          'filters',
    title:       '🎯 Smart Filter Bar',
    description: 'Filter by Price, Beds, Home Type, and Sort order. Click "More" to access advanced filters like square footage, year built, lot size, and keywords.',
    target:      '[data-tour="filters"]',
    position:    'bottom',
    spotlight:   true,
  },
  {
    id:          'view_toggle',
    title:       '🗺️ Three Ways to Browse',
    description: 'Switch between Grid, List, and Split Map view. Split view shows listings alongside a live interactive map with 8 different map layers.',
    target:      '[data-tour="view-toggle"]',
    position:    'bottom',
    spotlight:   true,
    pulse:       true,
  },
  {
    id:          'listing_card',
    title:       '🏡 Listing Cards',
    description: 'Each card shows 8 photos — use the ‹ › arrows to cycle through Exterior, Living Room, Kitchen, Bedrooms, Game Room, Pool, and Drone views.',
    target:      '[data-tour="listing-card"]',
    position:    'right',
    spotlight:   true,
  },
  {
    id:          'ai_button',
    title:       '⚡ AI Insights — 30 Tools',
    description: 'This glowing button opens 30 AI-powered analysis tools for any listing — Savage Roast, Hidden Gem Radar, Vibe Match, Negotiate, Climate, ESG, CMA, and much more.',
    target:      '[data-tour="ai-button"]',
    position:    'top',
    spotlight:   true,
    pulse:       true,
  },
  {
    id:          'homes_count',
    title:       '✨ Live Listing Count',
    description: 'This badge updates in real time as you apply filters, showing exactly how many homes match your current criteria.',
    target:      '[data-tour="homes-count"]',
    position:    'bottom',
    spotlight:   true,
  },
  {
    id:          'header_xp',
    title:       '🎮 Gamification — Earn XP',
    description: 'Sign in to earn XP as you explore. View listings, save favorites, use filters, share homes, and contact agents to level up from House Hunter to Market Legend.',
    target:      '[data-tour="xp-badge"]',
    position:    'bottom',
    spotlight:   true,
  },
  {
    id:          'mode_toggle',
    title:       '🌗 Color Mode',
    description: 'Toggle between Light, Mellow, and Dark mode. Your preference is saved in cookies so it persists across visits.',
    target:      '[data-tour="mode-toggle"]',
    position:    'bottom',
    spotlight:   true,
    pulse:       true,
  },
  {
    id:          'settings_menu',
    title:       '⚙️ Settings & Account',
    description: 'Click this menu to access your account, notifications, appearance themes, gamification, all 30 AI feature toggles, help, integrations, and privacy settings.',
    target:      '[data-tour="settings-btn"]',
    position:    'bottom-left',
    spotlight:   true,
    pulse:       true,
  },
  {
    id:          'neighborhood',
    title:       '🌆 Neighborhood Data',
    description: 'Click any listing → open the Neighborhood tab to get live weather, air quality, Walk Score, crime index, nearby schools, and demographic data — all free.',
    target:      '[data-tour="listing-card"]',
    position:    'right',
    spotlight:   true,
  },
  {
    id:          'mortgage',
    title:       '💰 Mortgage Calculator',
    description: 'Every listing has a built-in mortgage calculator. Adjust down payment, interest rate, and loan term with sliders to see your monthly payment instantly.',
    target:      '[data-tour="listing-card"]',
    position:    'right',
    spotlight:   true,
  },
  {
    id:          'finish',
    title:       '🎉 You\'re Ready!',
    description: 'That covers the main features. Sign in to unlock saving, AI insights, gamification, and personalized settings. Happy house hunting!',
    target:      null,
    position:    'center',
    spotlight:   false,
  },
]

// ── Tooltip position calculator ───────────────────────────────────────────────
function calcTooltipStyle(rect, position, tooltipW = 320, tooltipH = 180) {
  if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }

  const pad    = 16
  const arrH   = 10
  const vw     = window.innerWidth
  const vh     = window.innerHeight

  let top, left, transform = ''

  switch (position) {
    case 'bottom':
      top  = rect.bottom + arrH + pad
      left = rect.left + rect.width / 2 - tooltipW / 2
      break
    case 'top':
      top  = rect.top - tooltipH - arrH - pad
      left = rect.left + rect.width / 2 - tooltipW / 2
      break
    case 'right':
      top  = rect.top + rect.height / 2 - tooltipH / 2
      left = rect.right + arrH + pad
      break
    case 'left':
      top  = rect.top + rect.height / 2 - tooltipH / 2
      left = rect.left - tooltipW - arrH - pad
      break
    case 'bottom-left':
      top  = rect.bottom + arrH + pad
      left = rect.right - tooltipW
      break
    default:
      return { top:'50%', left:'50%', transform:'translate(-50%,-50%)', position:'fixed' }
  }

  // Clamp to viewport
  left = Math.max(pad, Math.min(left, vw - tooltipW - pad))
  top  = Math.max(pad, Math.min(top,  vh - tooltipH - pad))

  return { top:`${top}px`, left:`${left}px`, position:'fixed' }
}

// ── Arrow direction ───────────────────────────────────────────────────────────
function arrowFor(position) {
  return { bottom:'top', top:'bottom', right:'left', left:'right', 'bottom-left':'top' }[position] || null
}

// ── Main Tutorial component ───────────────────────────────────────────────────
export default function Tutorial({ c, t, onClose, onSignIn }) {
  const [step,        setStep]        = useState(0)
  const [rect,        setRect]        = useState(null)
  const [skipNext,    setSkipNext]    = useState(false)
  const [leaving,     setLeaving]     = useState(false)
  const [tooltipSize, setTooltipSize] = useState({ w:320, h:200 })
  const tooltipRef = useRef(null)
  const rafRef     = useRef(null)

  const current  = STEPS[step]
  const isFirst  = step === 0
  const isLast   = step === STEPS.length - 1
  const progress = Math.round((step / (STEPS.length - 1)) * 100)

  // ── Measure target element ────────────────────────────────────────────────
  const measureTarget = useCallback(() => {
    if (!current?.target) { setRect(null); return }
    const el = document.querySelector(current.target)
    if (!el) { setRect(null); return }
    const r = el.getBoundingClientRect()
    setRect({ top:r.top, left:r.left, width:r.width, height:r.height, bottom:r.bottom, right:r.right })
  }, [current?.target])

  useEffect(() => {
    measureTarget()
    // Re-measure on scroll/resize
    const onUpdate = () => { cancelAnimationFrame(rafRef.current); rafRef.current = requestAnimationFrame(measureTarget) }
    window.addEventListener('scroll', onUpdate, true)
    window.addEventListener('resize', onUpdate)
    return () => {
      window.removeEventListener('scroll', onUpdate, true)
      window.removeEventListener('resize', onUpdate)
      cancelAnimationFrame(rafRef.current)
    }
  }, [measureTarget])

  // Measure tooltip height after render
  useEffect(() => {
    if (tooltipRef.current) {
      const r = tooltipRef.current.getBoundingClientRect()
      setTooltipSize({ w: r.width || 320, h: r.height || 200 })
    }
  })

  // Scroll target into view
  useEffect(() => {
    if (!current?.target) return
    const el = document.querySelector(current.target)
    if (el) el.scrollIntoView({ behavior:'smooth', block:'center', inline:'center' })
  }, [step, current?.target])

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') handleNext()
      if (e.key === 'ArrowLeft')                       handlePrev()
      if (e.key === 'Escape')                          handleClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })

  const handleClose = () => {
    if (skipNext) document.cookie = 'zephyr_skip_tutorial=1; max-age=31536000; path=/'
    setLeaving(true)
    setTimeout(() => onClose(), 280)
  }

  const handleNext = () => { if (isLast) handleClose(); else setStep(s => s + 1) }
  const handlePrev = () => { if (!isFirst) setStep(s => s - 1) }

  // Spotlight padding
  const PAD = 10

  // Spotlight rect with padding
  const sRect = rect ? {
    top:    rect.top    - PAD,
    left:   rect.left   - PAD,
    width:  rect.width  + PAD * 2,
    height: rect.height + PAD * 2,
  } : null

  const tooltipStyle  = calcTooltipStyle(rect, current.position, tooltipSize.w, tooltipSize.h)
  const arrowDir      = rect ? arrowFor(current.position) : null

  const arrowStyles = {
    top:    { bottom:'100%', left:'50%', transform:'translateX(-50%)', borderWidth:'0 8px 8px', borderColor:`transparent transparent rgba(20,20,35,0.98) transparent` },
    bottom: { top:'100%',   left:'50%', transform:'translateX(-50%)', borderWidth:'8px 8px 0',  borderColor:`rgba(20,20,35,0.98) transparent transparent transparent` },
    left:   { right:'100%', top:'50%',  transform:'translateY(-50%)',  borderWidth:'8px 8px 8px 0', borderColor:`transparent rgba(20,20,35,0.98) transparent transparent` },
    right:  { left:'100%',  top:'50%',  transform:'translateY(-50%)',  borderWidth:'8px 0 8px 8px', borderColor:`transparent transparent transparent rgba(20,20,35,0.98)` },
  }

  return (
    <div style={{ position:'fixed', inset:0, zIndex:999999, pointerEvents:'none', opacity:leaving?0:1, transition:'opacity 0.28s ease' }}>

      {/* ── Overlay with spotlight cutout ── */}
      {current.spotlight && sRect ? (
        <>
          {/* Top */}
          <div style={{ position:'fixed', top:0, left:0, right:0, height:`${sRect.top}px`, background:'rgba(0,0,0,0.72)', pointerEvents:'auto' }} onClick={handleClose} />
          {/* Bottom */}
          <div style={{ position:'fixed', top:`${sRect.top+sRect.height}px`, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.72)', pointerEvents:'auto' }} onClick={handleClose} />
          {/* Left */}
          <div style={{ position:'fixed', top:`${sRect.top}px`, left:0, width:`${sRect.left}px`, height:`${sRect.height}px`, background:'rgba(0,0,0,0.72)', pointerEvents:'auto' }} onClick={handleClose} />
          {/* Right */}
          <div style={{ position:'fixed', top:`${sRect.top}px`, left:`${sRect.left+sRect.width}px`, right:0, height:`${sRect.height}px`, background:'rgba(0,0,0,0.72)', pointerEvents:'auto' }} onClick={handleClose} />
          {/* Spotlight border glow */}
          <div style={{
            position:     'fixed',
            top:          `${sRect.top}px`,
            left:         `${sRect.left}px`,
            width:        `${sRect.width}px`,
            height:       `${sRect.height}px`,
            borderRadius: '10px',
            border:       `2px solid ${t.accent}`,
            boxShadow:    `0 0 0 3px ${t.accentGlow}, 0 0 30px ${t.accentGlow}`,
            pointerEvents:'none',
            animation:    current.pulse ? 'tourPulse 1.8s ease-in-out infinite' : 'none',
          }} />
        </>
      ) : (
        /* Full dark overlay for non-spotlight steps */
        !current.spotlight && (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.72)', pointerEvents:'auto', backdropFilter:'blur(3px)' }} onClick={handleClose} />
        )
      )}

      {/* ── Tooltip ── */}
      <div
        ref={tooltipRef}
        onClick={e => e.stopPropagation()}
        style={{
          ...tooltipStyle,
          width:         '320px',
          pointerEvents: 'auto',
          background:    'rgba(12,12,22,0.98)',
          border:        `1px solid ${t.accent}60`,
          borderRadius:  '16px',
          boxShadow:     `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${t.accent}20, 0 0 40px ${t.accentGlow}`,
          overflow:      'hidden',
          animation:     'tourSlideIn 0.25s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        {/* Arrow */}
        {arrowDir && arrowStyles[arrowDir] && (
          <div style={{
            position:    'absolute',
            width:       0,
            height:      0,
            borderStyle: 'solid',
            ...arrowStyles[arrowDir],
          }} />
        )}

        {/* Progress bar */}
        <div style={{ height:'3px', background:'rgba(255,255,255,0.06)' }}>
          <div style={{ height:'100%', width:`${progress}%`, background:t.gradient, transition:'width 0.35s ease', boxShadow:`0 0 6px ${t.accentGlow}` }} />
        </div>

        {/* Header */}
        <div style={{ padding:'14px 16px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
            <div style={{ width:'26px', height:'26px', borderRadius:'7px', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:900, color:'#fff', boxShadow:`0 0 10px ${t.accentGlow}`, flexShrink:0 }}>Z</div>
            <span style={{ fontSize:'10px', color:'rgba(255,255,255,0.35)', fontWeight:600 }}>
              {step + 1} / {STEPS.length}
            </span>
          </div>
          <button onClick={handleClose}
            style={{ background:'none', border:'none', color:'rgba(255,255,255,0.3)', cursor:'pointer', fontSize:'16px', lineHeight:1, padding:'2px 4px', transition:'color 0.2s' }}
            onMouseEnter={e=>e.currentTarget.style.color='rgba(255,255,255,0.8)'}
            onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.3)'}>
            ✕
          </button>
        </div>

        {/* Body */}
        <div style={{ padding:'12px 16px 14px' }}>
          <p style={{ fontWeight:800, fontSize:'14px', color:'#fff', margin:'0 0 7px', lineHeight:1.3 }}>
            {current.title}
          </p>
          <p style={{ fontSize:'12px', color:'rgba(255,255,255,0.72)', lineHeight:1.65, margin:0 }}>
            {current.description}
          </p>
        </div>

        {/* Footer */}
        <div style={{ padding:'0 16px 14px', display:'flex', flexDirection:'column', gap:'10px' }}>

          {/* Nav buttons */}
          <div style={{ display:'flex', gap:'8px' }}>
            <button onClick={handlePrev} disabled={isFirst}
              style={{ padding:'8px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.12)', background:'rgba(255,255,255,0.05)', color:isFirst?'rgba(255,255,255,0.2)':'rgba(255,255,255,0.7)', cursor:isFirst?'not-allowed':'pointer', fontSize:'12px', fontWeight:700, transition:'all 0.2s', flexShrink:0 }}
              onMouseEnter={e=>{ if(!isFirst) e.currentTarget.style.background='rgba(255,255,255,0.1)' }}
              onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.05)'}>
              ← Back
            </button>
            <button onClick={handleNext}
              style={{ flex:1, padding:'8px', borderRadius:'8px', border:'none', background:isLast?'#16a34a':t.gradient, color:'#fff', cursor:'pointer', fontSize:'12px', fontWeight:800, boxShadow:`0 2px 12px ${isLast?'rgba(22,163,74,0.4)':t.accentGlow}`, transition:'all 0.2s' }}
              onMouseEnter={e=>e.currentTarget.style.transform='scale(1.02)'}
              onMouseLeave={e=>e.currentTarget.style.transform='scale(1)'}>
              {isLast ? '🎉 Start Exploring!' : step === 0 ? 'Start Tour →' : `Next →`}
            </button>
          </div>

          {/* Dot indicators */}
          <div style={{ display:'flex', justifyContent:'center', gap:'5px', flexWrap:'wrap' }}>
            {STEPS.map((_,i) => (
              <button key={i} onClick={()=>setStep(i)}
                style={{ width:i===step?'18px':'6px', height:'6px', borderRadius:'3px', border:'none', background:i===step?t.accent:i<step?`${t.accent}55`:'rgba(255,255,255,0.18)', cursor:'pointer', padding:0, transition:'all 0.28s', boxShadow:i===step?`0 0 6px ${t.accentGlow}`:'none' }} />
            ))}
          </div>

          {/* Skip next time */}
          <label style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'7px', cursor:'pointer' }}
            onClick={()=>setSkipNext(!skipNext)}>
            <div style={{ width:'16px', height:'16px', borderRadius:'4px', border:`2px solid ${skipNext?t.accent:'rgba(255,255,255,0.2)'}`, background:skipNext?t.accent:'transparent', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' }}>
              {skipNext && <span style={{ color:'#fff', fontSize:'10px', fontWeight:900, lineHeight:1 }}>✓</span>}
            </div>
            <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.35)' }}>Don't show again</span>
          </label>
        </div>
      </div>

      <style>{`
        @keyframes tourPulse {
          0%,100% { box-shadow: 0 0 0 3px ${t.accentGlow}, 0 0 20px ${t.accentGlow}; }
          50%      { box-shadow: 0 0 0 6px ${t.accentGlow}, 0 0 40px ${t.accentGlow}; }
        }
        @keyframes tourSlideIn {
          from { opacity:0; transform: scale(0.92) translateY(6px); }
          to   { opacity:1; transform: scale(1)    translateY(0);   }
        }
      `}</style>
    </div>
  )
}
