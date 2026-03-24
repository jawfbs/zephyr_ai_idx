'use client'
import { useState, useEffect } from 'react'

const STEPS = [
  {
    id: 'welcome',
    title: 'Welcome to ZephyrAI IDX 👋',
    emoji: '🏠',
    description: 'The smartest real estate platform in the Fargo area. Let\'s take a quick tour so you can find your perfect home faster.',
    type: 'splash',
    highlight: null,
  },
  {
    id: 'search',
    title: 'Search Any Way You Want',
    emoji: '🔍',
    description: 'Type a city, zip code, address, or MLS number. Try searching "West Fargo" or "58078" to filter instantly.',
    type: 'highlight',
    highlight: 'search',
    tip: 'Pro tip: Search by neighborhood name or school district too',
    interactive: 'Try clicking the search bar →',
  },
  {
    id: 'filters',
    title: 'Smart Filters',
    emoji: '🎯',
    description: 'Filter by price range, bedrooms, home type, and sort order. Combine multiple filters to narrow down exactly what you need.',
    type: 'highlight',
    highlight: 'filters',
    tip: 'Each filter you use earns XP in the gamification system',
    interactive: 'Click Price or Beds to see filter options →',
  },
  {
    id: 'views',
    title: 'Three Ways to Browse',
    emoji: '🗺️',
    description: 'Switch between Grid, List, and Split Map view. The map view shows all listings as pins — click any pin to see details.',
    type: 'highlight',
    highlight: 'views',
    tip: 'Split view lets you browse listings and the map side-by-side',
    interactive: 'Try the view toggle buttons →',
    demo: [
      { icon: '⊞', label: 'Grid — Photo cards in a responsive grid' },
      { icon: '≡', label: 'List — Compact rows with photos' },
      { icon: '⊙', label: 'Split — Listings + live map together' },
    ],
  },
  {
    id: 'cards',
    title: 'Listing Cards',
    emoji: '🏡',
    description: 'Every card shows 8 photos you can cycle through using the arrow buttons. Exterior, living room, kitchen, bedrooms, game room, pool, and drone view.',
    type: 'demo',
    highlight: null,
    tip: 'Click a card to open the full listing modal with all details',
    demo: [
      { icon: '‹›', label: 'Arrow buttons cycle through all 8 room photos' },
      { icon: '❤️', label: 'Save listings to your favorites (sign in required)' },
      { icon: '📤', label: 'Share any listing with a friend' },
      { icon: '🚫', label: 'Hide listings you\'re not interested in' },
      { icon: '⚡ AI', label: 'Open AI Features panel for that listing' },
    ],
  },
  {
    id: 'modal',
    title: 'Full Listing View',
    emoji: '🔎',
    description: 'Click any listing to open the full details modal. Four tabs give you everything you need.',
    type: 'demo',
    highlight: null,
    tip: 'The Neighborhood tab loads live weather, air quality, walk scores, and school data',
    demo: [
      { icon: '🏠', label: 'Details — Beds, baths, sqft, year built, description' },
      { icon: '🌆', label: 'Neighborhood — Live weather, walk score, crime, schools' },
      { icon: '💰', label: 'Mortgage — Interactive payment calculator with sliders' },
      { icon: '📞', label: 'Agent — Contact options and tour scheduling' },
    ],
  },
  {
    id: 'ai_features',
    title: '🤖 AI-Powered Features',
    emoji: '✨',
    description: 'Click the ⚡ AI button on any listing card to unlock 12 unique AI analysis tools — all free, no API key needed.',
    type: 'demo',
    highlight: null,
    tip: 'You can enable or disable individual features under Settings → AI Features',
    demo: [
      { icon: '🔥', label: 'Savage Roast — Brutally honest listing teardown' },
      { icon: '💎', label: 'Hidden Gem Radar — AI value signal analysis' },
      { icon: '🎰', label: 'Vibe Roulette — Spin for a personality-matched listing' },
      { icon: '💝', label: 'Emotional Fit Quiz — 5 questions → personalized match story' },
      { icon: '👻', label: 'Ghost of Homes Past — AI-dramatized home history' },
      { icon: '🎯', label: 'Regret Minimizer — Negotiation path simulator' },
      { icon: '🌀', label: 'Parallel Lives — See your future in this home' },
      { icon: '📊', label: 'Market Intelligence — Real-time comp analysis' },
      { icon: '🔧', label: 'Maintenance Forecast — 5-year cost projection' },
      { icon: '🔨', label: 'Renovation Blender — Describe idea → cost + ROI' },
      { icon: '🌡️', label: 'Climate Fortune — 30-year climate projection' },
      { icon: '📋', label: 'Due Diligence — Risk flags + pre-offer checklist' },
    ],
  },
  {
    id: 'map_layers',
    title: 'Map Layers',
    emoji: '🗺️',
    description: 'In Split or Map view, click the 🌐 Layers button to switch between 8 different map styles.',
    type: 'demo',
    highlight: null,
    tip: 'Satellite view is great for checking lot size and surroundings',
    demo: [
      { icon: '🗺️', label: 'Street — Standard OpenStreetMap' },
      { icon: '🛰️', label: 'Satellite — Esri aerial imagery' },
      { icon: '⛰️', label: 'Topo — Topographic elevation map' },
      { icon: '🚌', label: 'Transit — Public transport routes' },
      { icon: '🌑', label: 'Dark — CARTO dark theme' },
      { icon: '☀️', label: 'Light — CARTO light theme' },
      { icon: '🎨', label: 'Artistic — Stamen watercolor style' },
      { icon: '🚴', label: 'Cycle — CyclOSM bike routes' },
    ],
  },
  {
    id: 'neighborhood',
    title: 'Neighborhood Data',
    emoji: '📊',
    description: 'Open any listing → Neighborhood tab to get live data from real public APIs — all free, no signup required.',
    type: 'demo',
    highlight: null,
    demo: [
      { icon: '🚶', label: 'Walk Score, Transit Score, Bike Score' },
      { icon: '🌤️', label: 'Live weather + 5-day forecast (Open-Meteo)' },
      { icon: '💨', label: 'Air quality index + PM2.5 / PM10 levels' },
      { icon: '🔒', label: 'Safety index with property + violent crime breakdown' },
      { icon: '🏫', label: 'Nearby schools via OpenStreetMap Overpass API' },
      { icon: '📈', label: 'Demographics: median income, density, ownership rate' },
    ],
  },
  {
    id: 'gamification',
    title: 'Earn XP as You Explore 🎮',
    emoji: '🏆',
    description: 'ZephyrAI rewards you for using the platform. Sign in to start earning XP and unlocking achievements.',
    type: 'demo',
    highlight: null,
    tip: 'Sign in to save progress — XP is stored in your account',
    demo: [
      { icon: '👁️ +5',  label: 'View a listing' },
      { icon: '❤️ +10', label: 'Save a listing' },
      { icon: '🔍 +3',  label: 'Search the map' },
      { icon: '🎯 +5',  label: 'Use a filter' },
      { icon: '🗺️ +8',  label: 'Open map view' },
      { icon: '📤 +15', label: 'Share a listing' },
      { icon: '📞 +20', label: 'Contact an agent' },
      { icon: '📅 +10', label: 'Daily login bonus' },
    ],
  },
  {
    id: 'settings',
    title: 'Personalize Everything',
    emoji: '⚙️',
    description: 'Click the menu icon (top right) to access all settings after signing in.',
    type: 'demo',
    highlight: null,
    tip: 'Your theme and color mode preferences are saved automatically',
    demo: [
      { icon: '🎨', label: 'Appearance — 16 themes across 4 categories + 3 color modes' },
      { icon: '🎮', label: 'Gamification — Enable/disable XP system' },
      { icon: '🤖', label: 'AI Features — Toggle each of the 12 AI tools on/off' },
      { icon: '🔔', label: 'Notifications — Email, browser push, price drops' },
      { icon: '🔌', label: 'Integrations — Connect SparkAPI for live MLS data (Pro)' },
      { icon: '🔒', label: 'Privacy — Analytics, cookies, data sharing controls' },
    ],
  },
  {
    id: 'signin',
    title: 'Get the Full Experience',
    emoji: '🔑',
    description: 'Create a free account to unlock saving, AI features, gamification, and personalized settings. No credit card needed.',
    type: 'cta',
    highlight: null,
    demo: [
      { icon: '🔑', label: 'Homebuyer — Save listings, track favorites, get alerts' },
      { icon: '🏡', label: 'Agent — SparkAPI, client tools, marketing features' },
      { icon: '👥', label: 'Team — Multi-agent dashboard, shared searches' },
      { icon: '🏢', label: 'Brokerage — Full platform, custom branding, API access' },
    ],
  },
]

export default function Tutorial({ c, t, onClose, onSignIn }) {
  const [step,    setStep]    = useState(0)
  const [skipNext,setSkipNext]= useState(false)
  const [leaving, setLeaving] = useState(false)

  const current  = STEPS[step]
  const isFirst  = step === 0
  const isLast   = step === STEPS.length - 1
  const progress = ((step) / (STEPS.length - 1)) * 100

  const handleClose = () => {
    if (skipNext) document.cookie = 'zephyr_skip_tutorial=1; max-age=31536000; path=/'
    setLeaving(true)
    setTimeout(() => onClose(), 300)
  }

  const handleNext = () => {
    if (isLast) { handleClose(); return }
    setStep(s => s + 1)
  }

  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1)
  }

  const handleDotClick = (i) => setStep(i)

  return (
    <div
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.85)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 99999, backdropFilter: 'blur(8px)',
        padding: '16px',
        opacity: leaving ? 0 : 1,
        transition: 'opacity 0.3s ease',
      }}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%)',
          border: `1px solid ${t.accent}50`,
          borderRadius: '24px',
          width: '100%', maxWidth: '620px',
          maxHeight: '88vh',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px ${t.accent}20, 0 0 60px ${t.accentGlow}`,
          animation: 'tutorialIn 0.4s cubic-bezier(.34,1.56,.64,1)',
        }}
      >
        {/* ── Progress bar ── */}
        <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', flexShrink: 0 }}>
          <div style={{
            height: '100%', width: `${progress}%`,
            background: t.gradient, transition: 'width 0.4s ease',
            boxShadow: `0 0 8px ${t.accentGlow}`,
          }} />
        </div>

        {/* ── Header ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              background: t.gradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '14px', fontWeight: 900, color: '#fff',
              boxShadow: `0 0 12px ${t.accentGlow}`,
            }}>Z</div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '13px', color: '#fff', margin: 0 }}>ZephyrAI IDX</p>
              <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', margin: 0 }}>
                Step {step + 1} of {STEPS.length}
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              padding: '6px 14px', borderRadius: '8px',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(255,255,255,0.05)',
              color: 'rgba(255,255,255,0.5)', cursor: 'pointer',
              fontSize: '12px', fontWeight: 600,
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#fff' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)' }}
          >
            Skip Tour
          </button>
        </div>

        {/* ── Body ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 16px' }}>

          {/* Step icon + title */}
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: `${t.accent}20`, border: `2px solid ${t.accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', margin: '0 auto 16px',
              boxShadow: `0 0 30px ${t.accentGlow}`,
            }}>
              {current.emoji}
            </div>
            <h2 style={{ fontWeight: 900, fontSize: '22px', color: '#fff', margin: '0 0 10px' }}>
              {current.title}
            </h2>
            <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, margin: 0, maxWidth: '480px', marginLeft: 'auto', marginRight: 'auto' }}>
              {current.description}
            </p>
          </div>

          {/* Tip banner */}
          {current.tip && (
            <div style={{
              display: 'flex', alignItems: 'flex-start', gap: '10px',
              padding: '12px 14px', borderRadius: '12px',
              background: `${t.accent}12`, border: `1px solid ${t.accent}35`,
              marginBottom: '20px',
            }}>
              <span style={{ fontSize: '16px', flexShrink: 0 }}>💡</span>
              <p style={{ fontSize: '12px', color: t.accent, fontWeight: 600, margin: 0, lineHeight: 1.5 }}>
                {current.tip}
              </p>
            </div>
          )}

          {/* Interactive hint */}
          {current.interactive && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '10px 14px', borderRadius: '10px',
              background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
              marginBottom: '20px', animation: 'tutorialPulse 2s infinite',
            }}>
              <span style={{ fontSize: '14px' }}>👆</span>
              <p style={{ fontSize: '12px', color: '#86efac', fontWeight: 700, margin: 0 }}>
                {current.interactive}
              </p>
            </div>
          )}

          {/* Demo items grid */}
          {current.demo && current.demo.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: current.demo.length > 6 ? '1fr 1fr' : '1fr',
              gap: '8px',
              marginBottom: '8px',
            }}>
              {current.demo.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 14px', borderRadius: '10px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.2s',
                    animation: `tutorialSlideIn 0.3s ease ${i * 0.06}s both`,
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = `${t.accent}15`
                    e.currentTarget.style.borderColor = `${t.accent}40`
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.transform = 'translateX(0)'
                  }}
                >
                  <span style={{
                    fontSize: current.demo.length > 6 ? '14px' : '18px',
                    flexShrink: 0, minWidth: '32px',
                    fontWeight: 700, color: t.accent,
                  }}>
                    {item.icon}
                  </span>
                  <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.4 }}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* CTA step special content */}
          {current.type === 'cta' && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>
              <button
                onClick={() => { handleClose(); setTimeout(() => onSignIn?.(), 300) }}
                style={{
                  padding: '14px 32px', borderRadius: '12px', border: 'none',
                  background: t.gradient, color: '#fff', cursor: 'pointer',
                  fontSize: '15px', fontWeight: 800,
                  boxShadow: `0 8px 24px ${t.accentGlow}`,
                  marginBottom: '12px', width: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = `0 12px 32px ${t.accentGlow}` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 8px 24px ${t.accentGlow}` }}
              >
                🚀 Create Free Account
              </button>
              <button
                onClick={handleClose}
                style={{
                  padding: '12px 32px', borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.15)',
                  background: 'transparent', color: 'rgba(255,255,255,0.6)',
                  cursor: 'pointer', fontSize: '14px', fontWeight: 600, width: '100%',
                }}
              >
                Browse Without Account
              </button>
            </div>
          )}

        </div>

        {/* ── Footer ── */}
        <div style={{
          padding: '16px 28px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          flexShrink: 0,
        }}>
          {/* Dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
            {STEPS.map((_, i) => (
              <button
                key={i}
                onClick={() => handleDotClick(i)}
                style={{
                  width: i === step ? '20px' : '7px',
                  height: '7px', borderRadius: '4px', border: 'none',
                  background: i === step ? t.accent : i < step ? `${t.accent}60` : 'rgba(255,255,255,0.2)',
                  cursor: 'pointer', padding: 0,
                  transition: 'all 0.3s',
                  boxShadow: i === step ? `0 0 6px ${t.accentGlow}` : 'none',
                }}
              />
            ))}
          </div>

          {/* Nav buttons */}
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={handlePrev}
              disabled={isFirst}
              style={{
                padding: '11px 20px', borderRadius: '10px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                color: isFirst ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.7)',
                cursor: isFirst ? 'not-allowed' : 'pointer',
                fontSize: '13px', fontWeight: 700, flexShrink: 0,
                transition: 'all 0.2s',
              }}
            >
              ← Back
            </button>

            <button
              onClick={handleNext}
              style={{
                flex: 1, padding: '12px', borderRadius: '10px', border: 'none',
                background: isLast ? '#16a34a' : t.gradient,
                color: '#fff', cursor: 'pointer',
                fontSize: '14px', fontWeight: 800,
                boxShadow: `0 4px 16px ${isLast ? 'rgba(22,163,74,0.4)' : t.accentGlow}`,
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
            >
              {isLast ? '🎉 Start Exploring!' : step === 0 ? '🚀 Start Tour →' : `Next: ${STEPS[step + 1]?.title?.split(' ').slice(0, 3).join(' ')}… →`}
            </button>
          </div>

          {/* Skip next time */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px' }}>
            <button
              onClick={() => setSkipNext(!skipNext)}
              style={{
                width: '18px', height: '18px', borderRadius: '5px', border: 'none',
                background: skipNext ? t.accent : 'rgba(255,255,255,0.15)',
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0, transition: 'background 0.2s',
              }}
            >
              {skipNext && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 900 }}>✓</span>}
            </button>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}
              onClick={() => setSkipNext(!skipNext)}>
              Don't show this again (saved in cookies)
            </span>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tutorialIn {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1)    translateY(0);    }
        }
        @keyframes tutorialSlideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes tutorialPulse {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.6; }
        }
      `}</style>
    </div>
  )
}
