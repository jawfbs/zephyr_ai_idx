'use client'
import { useState } from 'react'
import {
  generateSavageRoast,
  generateHiddenGemAnalysis,
  VIBES, matchVibeToListings,
  PERSONALITY_QUESTIONS, generateEmotionalFitNarrative,
  generateGhostStory,
  generateNegotiationPaths,
  generateParallelLives,
  generateMarketBrief,
  generateMaintenanceForecast,
  generateRenovationPlan,
  generateClimateForecast,
  generateDueDiligencePackage,
} from './AIEngine'
import { formatPrice } from './data'

// ── Shared sub-components ─────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', padding: '16px', ...style }}>
      {children}
    </div>
  )
}

function Badge({ color, children }) {
  return (
    <span style={{ padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, background: `${color}25`, color, border: `1px solid ${color}40` }}>
      {children}
    </span>
  )
}

function ProgressBar({ value, color, label }) {
  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{label}</span>
        <span style={{ fontSize: '12px', fontWeight: 700, color }}>{value}%</span>
      </div>
      <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '6px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${value}%`, background: color, borderRadius: '6px', transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

// ── SAVAGE ROAST ──────────────────────────────────────────────────────────────
function SavageRoastPanel({ listing, t }) {
  const [revealed, setRevealed] = useState(false)
  const roast = generateSavageRoast(listing)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🔥</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Savage Roast Mode</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Brutally honest AI analysis</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ fontSize: '24px', fontWeight: 900, color: roast.score > 70 ? '#22c55e' : roast.score > 50 ? '#f59e0b' : '#ef4444', margin: 0 }}>{roast.score}/100</p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Honest Score</p>
        </div>
      </div>

      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(239,68,68,0.5)', background: 'rgba(239,68,68,0.15)', color: '#ef4444', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
          🔥 Roast This Listing
        </button>
      ) : (
        <div>
          <Card style={{ marginBottom: '12px', borderColor: 'rgba(239,68,68,0.3)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.7, margin: 0 }}>"{roast.headline}"</p>
          </Card>
          {roast.warnings.length > 0 && (
            <div style={{ marginBottom: '12px' }}>
              {roast.warnings.map((w, i) => (
                <div key={i} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', marginBottom: '6px', fontSize: '12px', color: '#fca5a5' }}>{w}</div>
              ))}
            </div>
          )}
          <Card style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.3)' }}>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#fff', margin: 0 }}>Verdict: {roast.verdict}</p>
          </Card>
        </div>
      )}
    </div>
  )
}

// ── HIDDEN GEM ────────────────────────────────────────────────────────────────
function HiddenGemPanel({ listing, allListings, t }) {
  const gem = generateHiddenGemAnalysis(listing, allListings)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>💎</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Hidden Gem Radar</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>AI value signal analysis</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: gem.gemScore > 75 ? 'rgba(34,197,94,0.2)' : 'rgba(251,191,36,0.2)', border: `2px solid ${gem.gemScore > 75 ? '#22c55e' : '#fbbf24'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
            <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff' }}>{gem.gemScore}</span>
          </div>
        </div>
      </div>
      <Card style={{ marginBottom: '12px' }}>
        <p style={{ fontWeight: 700, fontSize: '13px', color: gem.gemScore > 75 ? '#22c55e' : '#fbbf24', marginBottom: '8px' }}>{gem.label}</p>
        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{gem.narrative}</p>
      </Card>
      {gem.signals.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Value Signals</p>
          {gem.signals.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', marginBottom: '6px' }}>
              <span>{s.icon}</span>
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)' }}>{s.text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── VIBE ROULETTE ─────────────────────────────────────────────────────────────
function VibeRoulettePanel({ listing, allListings, t, onSelectListing }) {
  const [spinning,     setSpinning]     = useState(false)
  const [currentVibe,  setCurrentVibe]  = useState(null)
  const [matches,      setMatches]      = useState([])
  const [spinAngle,    setSpinAngle]    = useState(0)

  const spin = () => {
    setSpinning(true)
    const newAngle = spinAngle + 1440 + Math.random() * 720
    setSpinAngle(newAngle)
    setTimeout(() => {
      const vibe = VIBES[Math.floor(Math.random() * VIBES.length)]
      setCurrentVibe(vibe)
      setMatches(matchVibeToListings(vibe, allListings))
      setSpinning(false)
    }, 1800)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🎰</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Vibe Roulette</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Spin for a surprise match</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '16px' }}>
        {VIBES.map(v => (
          <div key={v.id} style={{ padding: '5px 12px', borderRadius: '20px', background: `${v.color}20`, border: `1px solid ${v.color}40`, fontSize: '12px', color: v.color, fontWeight: 600 }}>
            {v.emoji} {v.label}
          </div>
        ))}
      </div>

      <button onClick={spin} disabled={spinning}
        style={{ width: '100%', padding: '16px', borderRadius: '12px', border: 'none', background: spinning ? 'rgba(255,255,255,0.1)' : `linear-gradient(135deg, ${t.accent}, ${t.accent}99)`, color: '#fff', cursor: spinning ? 'not-allowed' : 'pointer', fontSize: '16px', fontWeight: 800, marginBottom: '16px', transition: 'all 0.3s', transform: spinning ? `rotate(${spinAngle}deg)` : 'none' }}>
        {spinning ? '🌀 Spinning…' : '🎰 Spin the Vibe Wheel'}
      </button>

      {currentVibe && !spinning && (
        <div>
          <Card style={{ marginBottom: '12px', background: `${currentVibe.color}15`, borderColor: `${currentVibe.color}40` }}>
            <p style={{ fontWeight: 900, fontSize: '20px', color: currentVibe.color, marginBottom: '4px' }}>{currentVibe.emoji} {currentVibe.label}</p>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0 }}>{currentVibe.desc}</p>
          </Card>
          <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Top Matches</p>
          {matches.map((m, i) => (
            <div key={m.id} onClick={() => onSelectListing && onSelectListing(m)}
              style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '8px', cursor: 'pointer', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}>
              <img src={m.photo} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#fff', margin: 0 }}>{formatPrice(m.price)}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.address}</p>
              </div>
              <span style={{ fontSize: '11px', fontWeight: 700, color: currentVibe.color }}>#{i + 1}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── EMOTIONAL FIT ─────────────────────────────────────────────────────────────
function EmotionalFitPanel({ listing, t }) {
  const [answers,  setAnswers]  = useState({})
  const [result,   setResult]   = useState(null)
  const [step,     setStep]     = useState(0)

  const allAnswered = Object.keys(answers).length >= PERSONALITY_QUESTIONS.length

  const handleAnswer = (qId, idx) => {
    const next = { ...answers, [qId]: idx }
    setAnswers(next)
    if (step < PERSONALITY_QUESTIONS.length - 1) setStep(step + 1)
  }

  const generate = () => setResult(generateEmotionalFitNarrative(answers, listing))

  if (result) {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>💝 Your Emotional Fit</p>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontWeight: 900, fontSize: '28px', color: t.accent, margin: 0 }}>{result.score}%</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Match Score</p>
          </div>
        </div>
        <Card style={{ marginBottom: '16px' }}>
          <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0, fontStyle: 'italic' }}>"{result.narrative}"</p>
        </Card>
        {result.compatibilityBreakdown.map(item => (
          <ProgressBar key={item.label} value={item.score} color={t.accent} label={`${item.icon} ${item.label}`} />
        ))}
        <button onClick={() => { setResult(null); setAnswers({}); setStep(0) }}
          style={{ marginTop: '12px', width: '100%', padding: '10px', borderRadius: '10px', border: `1px solid ${t.accent}50`, background: `${t.accent}15`, color: t.accent, cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
          Retake Quiz
        </button>
      </div>
    )
  }

  const q = PERSONALITY_QUESTIONS[step]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>💝</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Emotional Fit Quiz</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Question {step + 1} of {PERSONALITY_QUESTIONS.length}</p>
        </div>
      </div>
      <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', marginBottom: '20px', overflow: 'hidden' }}>
        <div style={{ height: '100%', width: `${((step) / PERSONALITY_QUESTIONS.length) * 100}%`, background: t.gradient, transition: 'width 0.3s' }} />
      </div>
      <p style={{ fontWeight: 700, fontSize: '15px', color: '#fff', marginBottom: '16px' }}>{q.q}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => handleAnswer(q.id, i)}
            style={{ padding: '12px 16px', borderRadius: '10px', border: `1px solid ${answers[q.id] === i ? t.accent : 'rgba(255,255,255,0.15)'}`, background: answers[q.id] === i ? `${t.accent}20` : 'rgba(255,255,255,0.05)', color: answers[q.id] === i ? t.accent : 'rgba(255,255,255,0.8)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, textAlign: 'left', transition: 'all 0.2s' }}>
            {opt}
          </button>
        ))}
      </div>
      {allAnswered && (
        <button onClick={generate}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: t.gradient, color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 800, boxShadow: `0 4px 16px ${t.accentGlow}` }}>
          💝 Reveal My Match
        </button>
      )}
    </div>
  )
}

// ── GHOST STORY ───────────────────────────────────────────────────────────────
function GhostStoryPanel({ listing, t }) {
  const [revealed, setRevealed] = useState(false)
  const [votes,    setVotes]    = useState({ believe: 0, bs: 0 })
  const story = generateGhostStory(listing)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>👻</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Ghost of Homes Past</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>{story.era} • Historical AI Narrative</p>
        </div>
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid rgba(167,139,250,0.4)', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
          👻 Reveal the Story
        </button>
      ) : (
        <div>
          <Card style={{ marginBottom: '12px', borderColor: 'rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.08)' }}>
            <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, margin: 0 }}>{story.story}</p>
          </Card>
          {story.mysteryHint && (
            <Card style={{ marginBottom: '12px', borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)' }}>
              <p style={{ fontSize: '12px', color: '#fbbf24', margin: 0 }}>🕵️ {story.mysteryHint}</p>
            </Card>
          )}
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '10px' }}>Does this story feel true?</p>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setVotes(v => ({ ...v, believe: v.believe + 1 }))}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.4)', background: 'rgba(34,197,94,0.1)', color: '#22c55e', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              ✅ Believe It ({votes.believe})
            </button>
            <button onClick={() => setVotes(v => ({ ...v, bs: v.bs + 1 }))}
              style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid rgba(239,68,68,0.4)', background: 'rgba(239,68,68,0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
              🚫 Total BS ({votes.bs})
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── REGRET MINIMIZER ──────────────────────────────────────────────────────────
function RegretMinimizerPanel({ listing, t }) {
  const [budget,   setBudget]   = useState(listing.price)
  const [revealed, setRevealed] = useState(false)
  const paths = generateNegotiationPaths(listing, budget)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🎯</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Regret Minimizer</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>AI negotiation path simulator</p>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Your Max Budget: ${budget.toLocaleString()}</label>
        <input type="range" min={listing.price * 0.85} max={listing.price * 1.1} step={1000} value={budget} onChange={e => setBudget(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: t.accent }} />
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: t.gradient, color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 700, boxShadow: `0 4px 16px ${t.accentGlow}` }}>
          🎯 Simulate Negotiation Paths
        </button>
      ) : (
        <div>
          {paths.map((path, i) => (
            <Card key={i} style={{ marginBottom: '10px', borderColor: `${path.color}40`, background: `${path.color}08` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '14px', color: path.color }}>{path.label}</span>
                <span style={{ fontWeight: 900, fontSize: '16px', color: '#fff' }}>${path.offerPrice.toLocaleString()}</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
                <div style={{ textAlign: 'center', flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: 800, fontSize: '16px', color: '#22c55e', margin: 0 }}>{path.acceptance}%</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Acceptance</p>
                </div>
                <div style={{ textAlign: 'center', flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: 800, fontSize: '16px', color: '#ef4444', margin: 0 }}>{path.cashBuyerRisk}%</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Cash Risk</p>
                </div>
                <div style={{ textAlign: 'center', flex: 1, padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)' }}>
                  <p style={{ fontWeight: 800, fontSize: '16px', color: t.accent, margin: 0 }}>${path.monthly.toLocaleString()}</p>
                  <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Monthly</p>
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', margin: 0 }}>{path.narrative}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── PARALLEL LIVES ────────────────────────────────────────────────────────────
function ParallelLivesPanel({ listing, t }) {
  const [vars,     setVars]     = useState({ kids: false, wfh: true, retire: false })
  const [revealed, setRevealed] = useState(false)
  const lives = generateParallelLives(listing, vars)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🌀</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Parallel Lives Simulator</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Your future in this home</p>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
        {[['kids', '👶 Kids in 3 yrs'], ['wfh', '💻 Work from Home'], ['retire', '🌅 Retire Here']].map(([key, label]) => (
          <button key={key} onClick={() => setVars(v => ({ ...v, [key]: !v[key] }))}
            style={{ padding: '8px 14px', borderRadius: '20px', border: `1px solid ${vars[key] ? t.accent : 'rgba(255,255,255,0.2)'}`, background: vars[key] ? `${t.accent}20` : 'transparent', color: vars[key] ? t.accent : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
            {label}
          </button>
        ))}
      </div>
      {!revealed ? (
        <button onClick={() => setRevealed(true)}
          style={{ width: '100%', padding: '13px', borderRadius: '10px', border: 'none', background: t.gradient, color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: 700 }}>
          🌀 Simulate My Future Here
        </button>
      ) : (
        <div>
          {lives.map((life, i) => (
            <Card key={i} style={{ marginBottom: '10px', borderColor: life.isAlternate ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)', background: life.isAlternate ? 'rgba(239,68,68,0.06)' : undefined }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '24px' }}>{life.emoji}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: life.isAlternate ? '#ef4444' : t.accent, margin: 0 }}>{life.label}</p>
                  {life.probability && <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{life.probability}% likely scenario</p>}
                </div>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{life.scenario}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

// ── MARKET INTELLIGENCE ───────────────────────────────────────────────────────
function MarketIntelPanel({ listing, allListings, t }) {
  const brief = generateMarketBrief(listing, allListings)
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>📊</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Market Intelligence Brief</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Confidence: {brief.confidence}%</p>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
        {brief.metrics.map(m => (
          <Card key={m.label}>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.5px', margin: '0 0 4px' }}>{m.label}</p>
            <p style={{ fontWeight: 800, fontSize: '14px', color: m.trend === 'good' ? '#22c55e' : m.trend === 'up' ? '#ef4444' : m.trend === 'down' ? '#22c55e' : '#f59e0b', margin: 0 }}>{m.val}</p>
          </Card>
        ))}
      </div>
      <Card>
        <p style={{ fontSize: '12px', fontWeight: 700, color: t.accent, marginBottom: '6px' }}>{brief.appreciation}</p>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6, margin: 0 }}>{brief.brief}</p>
      </Card>
    </div>
  )
}

// ── MAINTENANCE FORECAST ──────────────────────────────────────────────────────
function MaintenancePanel({ listing, t }) {
  const data = generateMaintenanceForecast(listing)
  const priorityColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e', Monitor: '#3b82f6' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🔧</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Maintenance Forecast</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>5-year cost projection</p>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <p style={{ fontWeight: 900, fontSize: '18px', color: '#f59e0b', margin: 0 }}>${data.monthly}/mo</p>
          <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Reserve budget</p>
        </div>
      </div>
      <Card style={{ marginBottom: '14px', borderColor: 'rgba(251,191,36,0.3)', background: 'rgba(251,191,36,0.08)' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{data.summary}</p>
      </Card>
      {data.items.map(item => (
        <div key={item.system} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '10px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '6px' }}>
          <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: '13px', color: '#fff', margin: 0 }}>{item.system}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>~${item.cost.toLocaleString()} · in ~{item.years} years</p>
          </div>
          <Badge color={priorityColor[item.priority]}>{item.priority}</Badge>
        </div>
      ))}
    </div>
  )
}

// ── RENOVATION BLENDER ────────────────────────────────────────────────────────
function RenovationBlenderPanel({ listing, t }) {
  const [idea,   setIdea]   = useState('')
  const [result, setResult] = useState(null)
  const [loading,setLoading]= useState(false)

  const generate = () => {
    if (!idea.trim()) return
    setLoading(true)
    setTimeout(() => { setResult(generateRenovationPlan(listing, idea)); setLoading(false) }, 800)
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🔨</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Renovation Blender</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>AI cost + ROI breakdown</p>
        </div>
      </div>
      <textarea value={idea} onChange={e => setIdea(e.target.value)}
        placeholder="Describe your renovation dream... 'Turn the basement into a home gym and bar' or 'Full kitchen remodel with island'"
        style={{ width: '100%', padding: '12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', background: 'rgba(255,255,255,0.05)', color: '#fff', fontSize: '13px', resize: 'vertical', minHeight: '80px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }}
        onFocus={e => e.target.style.borderColor = t.accent}
        onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.15)'}
      />
      <button onClick={generate} disabled={!idea.trim() || loading}
        style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: !idea.trim() ? 'rgba(255,255,255,0.1)' : t.gradient, color: '#fff', cursor: !idea.trim() ? 'not-allowed' : 'pointer', fontSize: '14px', fontWeight: 700, marginBottom: '16px' }}>
        {loading ? '⏳ Analyzing…' : '🔨 Blend My Renovation'}
      </button>
      {result && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
            {[
              { label: 'Cost Range',   val: `$${Math.round(result.low/1000)}k–$${Math.round(result.high/1000)}k`, color: '#f59e0b' },
              { label: 'ROI Score',    val: `${result.roi}%`,       color: '#22c55e' },
              { label: 'Timeline',     val: result.timeline,         color: '#3b82f6' },
            ].map(({ label, val, color }) => (
              <Card key={label} style={{ textAlign: 'center' }}>
                <p style={{ fontWeight: 900, fontSize: '16px', color, margin: 0 }}>{val}</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{label}</p>
              </Card>
            ))}
          </div>
          <Card style={{ marginBottom: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e', marginBottom: '6px' }}>New Estimated Value: ${result.newValue.toLocaleString()} (+${result.valueGain.toLocaleString()})</p>
            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>Project Phases</p>
            {result.phases.map((phase, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ width: '18px', height: '18px', borderRadius: '50%', background: t.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 800, color: '#fff', flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>{phase}</span>
              </div>
            ))}
          </Card>
        </div>
      )}
    </div>
  )
}

// ── CLIMATE FORTUNE ───────────────────────────────────────────────────────────
function ClimateFortunPanel({ listing, t }) {
  const [year, setYear] = useState(2035)
  const data = generateClimateForecast(listing, year)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>🌡️</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Climate Fortune Teller</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>NOAA-based projection</p>
        </div>
      </div>
      <div style={{ marginBottom: '16px' }}>
        <label style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Forecast Year: {year}</label>
        <input type="range" min={2026} max={2055} step={1} value={year} onChange={e => setYear(parseInt(e.target.value))}
          style={{ width: '100%', accentColor: t.accent }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '2px' }}>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>2026</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>2055</span>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
        {[
          { label: 'Snow Days', val: Math.round(data.projections.snowDays), icon: '❄️', color: '#38bdf8' },
          { label: 'Heat Days 90°F+', val: Math.round(data.projections.heatDays), icon: '☀️', color: '#f97316' },
          { label: 'Flood Risk', val: `${Math.round(data.projections.floodRisk)}%`, icon: '🌊', color: '#3b82f6' },
          { label: 'Storm Events/yr', val: Math.round(data.projections.stormEvents), icon: '⛈️', color: '#8b5cf6' },
        ].map(({ label, val, icon, color }) => (
          <Card key={label} style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '20px' }}>{icon}</span>
            <p style={{ fontWeight: 900, fontSize: '18px', color, margin: '4px 0 2px' }}>{val}</p>
            <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{label}</p>
          </Card>
        ))}
      </div>
      <Card style={{ marginBottom: '10px' }}>
        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6, margin: 0 }}>{data.narrative}</p>
      </Card>
      <div style={{ padding: '10px 14px', borderRadius: '10px', background: data.recommendation.startsWith('⚠️') ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)', border: `1px solid ${data.recommendation.startsWith('⚠️') ? 'rgba(239,68,68,0.3)' : 'rgba(34,197,94,0.3)'}` }}>
        <p style={{ fontSize: '12px', fontWeight: 700, color: data.recommendation.startsWith('⚠️') ? '#fca5a5' : '#86efac', margin: 0 }}>{data.recommendation}</p>
      </div>
    </div>
  )
}

// ── DUE DILIGENCE ─────────────────────────────────────────────────────────────
function DueDiligencePanel({ listing, t }) {
  const [checked,  setChecked]  = useState({})
  const data = generateDueDiligencePackage(listing)
  const riskColor = { High: '#ef4444', Medium: '#f59e0b', Low: '#22c55e' }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <span style={{ fontSize: '28px' }}>📋</span>
        <div>
          <p style={{ fontWeight: 800, fontSize: '16px', color: '#fff', margin: 0 }}>Due Diligence Package</p>
          <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>Risk: {data.riskScore}</p>
        </div>
      </div>
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px' }}>Risk Flags</p>
      {data.risks.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: `${riskColor[r.level]}10`, border: `1px solid ${riskColor[r.level]}30`, marginBottom: '8px' }}>
          <Badge color={riskColor[r.level]}>{r.level}</Badge>
          <div>
            <p style={{ fontWeight: 700, fontSize: '12px', color: '#fff', margin: 0 }}>{r.item}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)', margin: '2px 0 0' }}>{r.detail}</p>
          </div>
        </div>
      ))}
      <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '1px', margin: '14px 0 8px' }}>Pre-Offer Checklist</p>
      {data.checklist.map((item, i) => (
        <button key={i} onClick={() => setChecked(p => ({ ...p, [i]: !p[i] }))}
          style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', border: 'none', background: checked[i] ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.04)', cursor: 'pointer', marginBottom: '4px', textAlign: 'left', transition: 'background 0.2s' }}>
          <div style={{ width: '18px', height: '18px', borderRadius: '4px', border: `2px solid ${checked[i] ? '#22c55e' : 'rgba(255,255,255,0.3)'}`, background: checked[i] ? '#22c55e' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {checked[i] && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 900 }}>✓</span>}
          </div>
          <span style={{ fontSize: '12px', color: checked[i] ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.8)', textDecoration: checked[i] ? 'line-through' : 'none' }}>{item.item}</span>
          {item.priority === 1 && <Badge color="#ef4444" style={{ marginLeft: 'auto', flexShrink: 0 }}>Priority</Badge>}
        </button>
      ))}
      <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textAlign: 'center', marginTop: '10px' }}>
        {Object.values(checked).filter(Boolean).length}/{data.checklist.length} items completed
      </p>
    </div>
  )
}

// ── MAIN FEATURE PANEL ────────────────────────────────────────────────────────
export default function FeaturePanel({ listing, allListings, t, c, enabledFeatures, onClose, onSelectListing }) {
  const [activeFeature, setActiveFeature] = useState('savage_mode')

  const availableFeatures = [
    { id: 'savage_mode',     label: '🔥 Roast',       component: <SavageRoastPanel    listing={listing} t={t} /> },
    { id: 'hidden_gem',      label: '💎 Gem Radar',   component: <HiddenGemPanel      listing={listing} allListings={allListings} t={t} /> },
    { id: 'vibe_roulette',   label: '🎰 Vibes',       component: <VibeRoulettePanel   listing={listing} allListings={allListings} t={t} onSelectListing={onSelectListing} /> },
    { id: 'emotional_fit',   label: '💝 Fit Quiz',    component: <EmotionalFitPanel   listing={listing} t={t} /> },
    { id: 'ghost_stories',   label: '👻 History',     component: <GhostStoryPanel     listing={listing} t={t} /> },
    { id: 'regret_minimizer',label: '🎯 Negotiate',   component: <RegretMinimizerPanel listing={listing} t={t} /> },
    { id: 'parallel_lives',  label: '🌀 Future',      component: <ParallelLivesPanel  listing={listing} t={t} /> },
    { id: 'market_intelligence',label:'📊 Market',    component: <MarketIntelPanel    listing={listing} allListings={allListings} t={t} /> },
    { id: 'maintenance_forecast',label:'🔧 Upkeep',   component: <MaintenancePanel    listing={listing} t={t} /> },
    { id: 'renovation_blender',label:'🔨 Reno',       component: <RenovationBlenderPanel listing={listing} t={t} /> },
    { id: 'climate_fortune', label: '🌡️ Climate',    component: <ClimateFortunPanel  listing={listing} t={t} /> },
    { id: 'due_diligence',   label: '📋 DD Package',  component: <DueDiligencePanel   listing={listing} t={t} /> },
  ].filter(f => enabledFeatures?.[f.id] !== false)

  const active = availableFeatures.find(f => f.id === activeFeature) || availableFeatures[0]

  if (!availableFeatures.length) return null

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9997, backdropFilter: 'blur(8px)', padding: '16px' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background: 'linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%)', border: `1px solid ${t.accent}40`, borderRadius: '20px', width: '100%', maxWidth: '580px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: `0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px ${t.accent}20` }}>

        {/* Header */}
        <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${t.accentGlow}` }}>
              <span style={{ fontWeight: 900, color: '#fff', fontSize: '14px' }}>Z</span>
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '14px', color: '#fff', margin: 0 }}>ZephyrAI Features</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>{listing.address}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
        </div>

        {/* Feature tabs */}
        <div style={{ display: 'flex', overflowX: 'auto', padding: '10px 14px', gap: '6px', flexShrink: 0, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          {availableFeatures.map(f => (
            <button key={f.id} onClick={() => setActiveFeature(f.id)}
              style={{ padding: '6px 12px', borderRadius: '20px', border: `1px solid ${activeFeature === f.id ? t.accent : 'rgba(255,255,255,0.15)'}`, background: activeFeature === f.id ? `${t.accent}25` : 'transparent', color: activeFeature === f.id ? t.accent : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, whiteSpace: 'nowrap', transition: 'all 0.2s', flexShrink: 0 }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Active feature content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>
          {active?.component}
        </div>
      </div>
    </div>
  )
}
