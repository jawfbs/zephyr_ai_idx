'use client'
import { useState } from 'react'
import {
  generateSavageRoast, generateHiddenGemAnalysis,
  VIBES, matchVibeToListings,
  PERSONALITY_QUESTIONS, generateEmotionalFitNarrative,
  generateGhostStory, generateNegotiationPaths,
  generateParallelLives, generateMarketBrief,
  generateMaintenanceForecast, generateRenovationPlan,
  generateClimateForecast, generateDueDiligencePackage,
  generateLeadQualification, generateBuyerEducation,
  generateVendorCoordination, generateIntelligenceBrief,
  generateInspectionPlan, generateFinancingScenarios,
  generateTitleInsights, generateSustainabilityRebates,
  generateRelocationPlan, generateReferralEngine,
  generateInvestmentSimulator, generateNeighborhoodResilience,
  generateClosingPredictor, generateESGScore,
  generateCMAReport, generateMarketingPackage,
  generateBuyerJourney, generatePostClosingAdvisor,
} from './AIEngine'
import { formatPrice } from './data'

// ── Shared sub-components ─────────────────────────────────────────────────────
function Card({ children, style={} }) {
  return <div style={{ background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'12px', padding:'14px', ...style }}>{children}</div>
}
function Badge({ color, children }) {
  return <span style={{ padding:'2px 8px', borderRadius:'16px', fontSize:'10px', fontWeight:700, background:`${color}25`, color, border:`1px solid ${color}40` }}>{children}</span>
}
function Bar({ value, color, label }) {
  return (
    <div style={{ marginBottom:'8px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'3px' }}>
        <span style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)' }}>{label}</span>
        <span style={{ fontSize:'11px', fontWeight:700, color }}>{value}%</span>
      </div>
      <div style={{ height:'5px', background:'rgba(255,255,255,0.1)', borderRadius:'5px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${value}%`, background:color, borderRadius:'5px', transition:'width 1s ease' }} />
      </div>
    </div>
  )
}
function Section({ title, children }) {
  return <div style={{ marginBottom:'16px' }}><p style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>{title}</p>{children}</div>
}

// ── EXISTING PANELS ───────────────────────────────────────────────────────────

function SavageRoastPanel({ listing, t }) {
  const [rev,setRev]=useState(false)
  const r=generateSavageRoast(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'16px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}>
          <span style={{ fontSize:'28px' }}>🔥</span>
          <div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Savage Roast Mode</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Brutally honest AI analysis</p></div>
        </div>
        <div style={{ textAlign:'right' }}><p style={{ fontSize:'24px',fontWeight:900,color:r.score>70?'#22c55e':r.score>50?'#f59e0b':'#ef4444',margin:0 }}>{r.score}/100</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>Honest Score</p></div>
      </div>
      {!rev ? (
        <button onClick={()=>setRev(true)} style={{ width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid rgba(239,68,68,0.5)',background:'rgba(239,68,68,0.15)',color:'#ef4444',cursor:'pointer',fontSize:'14px',fontWeight:700 }}>🔥 Roast This Listing</button>
      ) : (
        <div>
          <Card style={{ marginBottom:'10px',borderColor:'rgba(239,68,68,0.3)' }}><p style={{ fontSize:'13px',color:'rgba(255,255,255,0.85)',lineHeight:1.7,margin:0,fontStyle:'italic' }}>"{r.headline}"</p></Card>
          {r.warnings.map((w,i)=><div key={i} style={{ padding:'8px 12px',borderRadius:'8px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.2)',marginBottom:'6px',fontSize:'12px',color:'#fca5a5' }}>{w}</div>)}
          <Card style={{ background:'rgba(239,68,68,0.1)',borderColor:'rgba(239,68,68,0.3)' }}><p style={{ fontSize:'13px',fontWeight:700,color:'#fff',margin:0 }}>Verdict: {r.verdict}</p></Card>
        </div>
      )}
    </div>
  )
}

function HiddenGemPanel({ listing, allListings, t }) {
  const g=generateHiddenGemAnalysis(listing, allListings)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}>
        <div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>💎</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Hidden Gem Radar</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>AI value signal analysis</p></div></div>
        <div style={{ width:'52px',height:'52px',borderRadius:'50%',background:g.gemScore>75?'rgba(34,197,94,0.2)':'rgba(251,191,36,0.2)',border:`2px solid ${g.gemScore>75?'#22c55e':'#fbbf24'}`,display:'flex',alignItems:'center',justifyContent:'center',flexDirection:'column' }}><span style={{ fontWeight:900,fontSize:'15px',color:'#fff' }}>{g.gemScore}</span></div>
      </div>
      <Card style={{ marginBottom:'10px' }}><p style={{ fontWeight:700,fontSize:'12px',color:g.gemScore>75?'#22c55e':'#fbbf24',marginBottom:'6px' }}>{g.label}</p><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0 }}>{g.narrative}</p></Card>
      {g.signals.map((s,i)=><div key={i} style={{ display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',background:'rgba(34,197,94,0.08)',border:'1px solid rgba(34,197,94,0.2)',marginBottom:'5px' }}><span>{s.icon}</span><span style={{ fontSize:'12px',color:'rgba(255,255,255,0.8)' }}>{s.text}</span></div>)}
    </div>
  )
}

function VibeRoulettePanel({ listing, allListings, t, onSelectListing }) {
  const [spinning,setSpinning]=useState(false)
  const [vibe,setVibe]=useState(null)
  const [matches,setMatches]=useState([])
  const spin=()=>{ setSpinning(true); setTimeout(()=>{ const v=VIBES[Math.floor(Math.random()*VIBES.length)]; setVibe(v); setMatches(matchVibeToListings(v,allListings)); setSpinning(false) },1600) }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px' }}><span style={{ fontSize:'28px' }}>🎰</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Vibe Roulette</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Spin for a surprise match</p></div></div>
      <div style={{ display:'flex',flexWrap:'wrap',gap:'5px',marginBottom:'12px' }}>{VIBES.map(v=><div key={v.id} style={{ padding:'3px 8px',borderRadius:'16px',background:`${v.color}20`,border:`1px solid ${v.color}40`,fontSize:'10px',color:v.color,fontWeight:600 }}>{v.emoji} {v.label}</div>)}</div>
      <button onClick={spin} disabled={spinning} style={{ width:'100%',padding:'14px',borderRadius:'12px',border:'none',background:spinning?'rgba(255,255,255,0.1)':`linear-gradient(135deg,${t.accent},${t.accent}99)`,color:'#fff',cursor:spinning?'not-allowed':'pointer',fontSize:'15px',fontWeight:800,marginBottom:'14px' }}>{spinning?'🌀 Spinning…':'🎰 Spin the Vibe Wheel'}</button>
      {vibe && !spinning && (
        <div>
          <Card style={{ marginBottom:'10px',background:`${vibe.color}15`,borderColor:`${vibe.color}40` }}><p style={{ fontWeight:900,fontSize:'18px',color:vibe.color,marginBottom:'3px' }}>{vibe.emoji} {vibe.label}</p><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.7)',margin:0 }}>{vibe.desc}</p></Card>
          <p style={{ fontSize:'10px',fontWeight:700,color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'1px',marginBottom:'6px' }}>Top Matches</p>
          {matches.map((m,i)=><div key={m.id} onClick={()=>onSelectListing?.(m)} style={{ display:'flex',alignItems:'center',gap:'10px',padding:'8px',borderRadius:'8px',background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.1)',marginBottom:'6px',cursor:'pointer' }} onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.1)'} onMouseLeave={e=>e.currentTarget.style.background='rgba(255,255,255,0.06)'}><img src={m.photo} alt="" style={{ width:'44px',height:'44px',borderRadius:'6px',objectFit:'cover',flexShrink:0 }} /><div style={{ flex:1,minWidth:0 }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',margin:0 }}>{formatPrice(m.price)}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{m.address}</p></div><span style={{ fontSize:'10px',fontWeight:700,color:vibe.color }}>#{i+1}</span></div>)}
        </div>
      )}
    </div>
  )
}

function EmotionalFitPanel({ listing, t }) {
  const [answers,setAnswers]=useState({})
  const [result,setResult]=useState(null)
  const [step,setStep]=useState(0)
  const allAnswered=Object.keys(answers).length>=PERSONALITY_QUESTIONS.length
  const handleAnswer=(qId,idx)=>{ const n={...answers,[qId]:idx}; setAnswers(n); if(step<PERSONALITY_QUESTIONS.length-1) setStep(step+1) }
  if(result) return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>💝 Your Emotional Fit</p><div style={{ textAlign:'right' }}><p style={{ fontWeight:900,fontSize:'26px',color:t.accent,margin:0 }}>{result.score}%</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>Match</p></div></div>
      <Card style={{ marginBottom:'12px' }}><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.85)',lineHeight:1.75,margin:0,fontStyle:'italic' }}>"{result.narrative}"</p></Card>
      {result.compatibilityBreakdown.map(item=><Bar key={item.label} value={item.score} color={t.accent} label={`${item.icon} ${item.label}`} />)}
      <button onClick={()=>{setResult(null);setAnswers({});setStep(0)}} style={{ marginTop:'10px',width:'100%',padding:'9px',borderRadius:'10px',border:`1px solid ${t.accent}50`,background:`${t.accent}15`,color:t.accent,cursor:'pointer',fontSize:'12px',fontWeight:700 }}>Retake Quiz</button>
    </div>
  )
  const q=PERSONALITY_QUESTIONS[step]
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'12px' }}><div style={{ display:'flex',alignItems:'center',gap:'8px' }}><span style={{ fontSize:'24px' }}>💝</span><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Emotional Fit Quiz</p></div><span style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)' }}>{step+1}/{PERSONALITY_QUESTIONS.length}</span></div>
      <div style={{ height:'3px',background:'rgba(255,255,255,0.1)',borderRadius:'3px',marginBottom:'16px',overflow:'hidden' }}><div style={{ height:'100%',width:`${(step/PERSONALITY_QUESTIONS.length)*100}%`,background:t.gradient }} /></div>
      <p style={{ fontWeight:700,fontSize:'14px',color:'#fff',marginBottom:'12px' }}>{q.q}</p>
      <div style={{ display:'flex',flexDirection:'column',gap:'6px',marginBottom:'14px' }}>
        {q.opts.map((opt,i)=><button key={i} onClick={()=>handleAnswer(q.id,i)} style={{ padding:'10px 14px',borderRadius:'10px',border:`1px solid ${answers[q.id]===i?t.accent:'rgba(255,255,255,0.15)'}`,background:answers[q.id]===i?`${t.accent}20`:'rgba(255,255,255,0.04)',color:answers[q.id]===i?t.accent:'rgba(255,255,255,0.8)',cursor:'pointer',fontSize:'12px',fontWeight:600,textAlign:'left' }}>{opt}</button>)}
      </div>
      {allAnswered&&<button onClick={()=>setResult(generateEmotionalFitNarrative(answers,listing))} style={{ width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:t.gradient,color:'#fff',cursor:'pointer',fontSize:'13px',fontWeight:800,boxShadow:`0 4px 16px ${t.accentGlow}` }}>💝 Reveal My Match</button>}
    </div>
  )
}

function GhostStoryPanel({ listing, t }) {
  const [rev,setRev]=useState(false)
  const [votes,setVotes]=useState({believe:0,bs:0})
  const s=generateGhostStory(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px' }}><span style={{ fontSize:'28px' }}>👻</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Ghost of Homes Past</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>{s.era} · Historical AI Narrative</p></div></div>
      {!rev ? <button onClick={()=>setRev(true)} style={{ width:'100%',padding:'14px',borderRadius:'12px',border:'1px solid rgba(167,139,250,0.4)',background:'rgba(167,139,250,0.1)',color:'#a78bfa',cursor:'pointer',fontSize:'14px',fontWeight:700 }}>👻 Reveal the Story</button>
      : <div><Card style={{ marginBottom:'10px',borderColor:'rgba(167,139,250,0.3)',background:'rgba(167,139,250,0.08)' }}><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.85)',lineHeight:1.75,margin:0 }}>{s.story}</p></Card>
        {s.mysteryHint&&<Card style={{ marginBottom:'10px',borderColor:'rgba(251,191,36,0.3)',background:'rgba(251,191,36,0.08)' }}><p style={{ fontSize:'11px',color:'#fbbf24',margin:0 }}>🕵️ {s.mysteryHint}</p></Card>}
        <div style={{ display:'flex',gap:'8px' }}>
          <button onClick={()=>setVotes(v=>({...v,believe:v.believe+1}))} style={{ flex:1,padding:'9px',borderRadius:'10px',border:'1px solid rgba(34,197,94,0.4)',background:'rgba(34,197,94,0.1)',color:'#22c55e',cursor:'pointer',fontSize:'12px',fontWeight:700 }}>✅ Believe It ({votes.believe})</button>
          <button onClick={()=>setVotes(v=>({...v,bs:v.bs+1}))} style={{ flex:1,padding:'9px',borderRadius:'10px',border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.1)',color:'#ef4444',cursor:'pointer',fontSize:'12px',fontWeight:700 }}>🚫 Total BS ({votes.bs})</button>
        </div>
      </div>}
    </div>
  )
}

function RegretMinimizerPanel({ listing, t }) {
  const [budget,setBudget]=useState(listing.price)
  const [rev,setRev]=useState(false)
  const paths=generateNegotiationPaths(listing,budget)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🎯</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Regret Minimizer</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Negotiation path simulator</p></div></div>
      <div style={{ marginBottom:'14px' }}><label style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',fontWeight:600,display:'block',marginBottom:'5px' }}>Max Budget: ${budget.toLocaleString()}</label><input type="range" min={listing.price*0.85} max={listing.price*1.1} step={1000} value={budget} onChange={e=>setBudget(parseInt(e.target.value))} style={{ width:'100%',accentColor:t.accent }} /></div>
      {!rev ? <button onClick={()=>setRev(true)} style={{ width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:t.gradient,color:'#fff',cursor:'pointer',fontSize:'13px',fontWeight:700,boxShadow:`0 4px 16px ${t.accentGlow}` }}>🎯 Simulate Paths</button>
      : paths.map((p,i)=><Card key={i} style={{ marginBottom:'8px',borderColor:`${p.color}40`,background:`${p.color}08` }}>
          <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'6px' }}><span style={{ fontWeight:700,fontSize:'13px',color:p.color }}>{p.label}</span><span style={{ fontWeight:900,fontSize:'14px',color:'#fff' }}>${p.offerPrice.toLocaleString()}</span></div>
          <div style={{ display:'flex',gap:'6px',marginBottom:'6px' }}>
            {[{label:'Accept',val:`${p.acceptance}%`,c:'#22c55e'},{label:'Cash Risk',val:`${p.cashBuyerRisk}%`,c:'#ef4444'},{label:'Monthly',val:`$${p.monthly.toLocaleString()}`,c:t.accent}].map(x=><div key={x.label} style={{ flex:1,textAlign:'center',padding:'6px',borderRadius:'6px',background:'rgba(255,255,255,0.05)' }}><p style={{ fontWeight:800,fontSize:'13px',color:x.c,margin:0 }}>{x.val}</p><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',margin:0 }}>{x.label}</p></div>)}
          </div>
          <p style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',margin:0 }}>{p.narrative}</p>
        </Card>)}
    </div>
  )
}

function ParallelLivesPanel({ listing, t }) {
  const [vars,setVars]=useState({kids:false,wfh:true,retire:false})
  const [rev,setRev]=useState(false)
  const lives=generateParallelLives(listing,vars)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🌀</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Parallel Lives Simulator</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Your future in this home</p></div></div>
      <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'14px' }}>
        {[['kids','👶 Kids in 3yr'],['wfh','💻 WFH Forever'],['retire','🌅 Retire Here']].map(([k,l])=><button key={k} onClick={()=>setVars(v=>({...v,[k]:!v[k]}))} style={{ padding:'6px 12px',borderRadius:'16px',border:`1px solid ${vars[k]?t.accent:'rgba(255,255,255,0.2)'}`,background:vars[k]?`${t.accent}20`:'transparent',color:vars[k]?t.accent:'rgba(255,255,255,0.6)',cursor:'pointer',fontSize:'11px',fontWeight:600 }}>{l}</button>)}
      </div>
      {!rev ? <button onClick={()=>setRev(true)} style={{ width:'100%',padding:'12px',borderRadius:'10px',border:'none',background:t.gradient,color:'#fff',cursor:'pointer',fontSize:'13px',fontWeight:700 }}>🌀 Simulate My Future Here</button>
      : lives.map((l,i)=><Card key={i} style={{ marginBottom:'8px',borderColor:l.isAlternate?'rgba(239,68,68,0.3)':'rgba(255,255,255,0.1)',background:l.isAlternate?'rgba(239,68,68,0.06)':undefined }}>
          <div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'6px' }}><span style={{ fontSize:'20px' }}>{l.emoji}</span><div style={{ flex:1 }}><p style={{ fontWeight:700,fontSize:'12px',color:l.isAlternate?'#ef4444':t.accent,margin:0 }}>{l.label}</p>{l.probability&&<p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0 }}>{l.probability}% likely</p>}</div></div>
          <p style={{ fontSize:'12px',color:'rgba(255,255,255,0.75)',lineHeight:1.6,margin:0 }}>{l.scenario}</p>
        </Card>)}
    </div>
  )
}

function MarketIntelPanel({ listing, allListings, t }) {
  const b=generateMarketBrief(listing, allListings)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>📊</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Market Intelligence</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Confidence: {b.confidence}%</p></div></div></div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px',marginBottom:'12px' }}>
        {b.metrics.map(m=><Card key={m.label}><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',letterSpacing:'0.5px',margin:'0 0 3px' }}>{m.label}</p><p style={{ fontWeight:800,fontSize:'13px',color:m.trend==='good'?'#22c55e':m.trend==='up'?'#ef4444':m.trend==='down'?'#22c55e':'#f59e0b',margin:0 }}>{m.val}</p></Card>)}
      </div>
      <Card><p style={{ fontSize:'11px',fontWeight:700,color:t.accent,marginBottom:'5px' }}>{b.appreciation}</p><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.75)',lineHeight:1.6,margin:0 }}>{b.brief}</p></Card>
    </div>
  )
}

function MaintenancePanel({ listing, t }) {
  const d=generateMaintenanceForecast(listing)
  const pc={ High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e', Monitor:'#3b82f6' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>🔧</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Maintenance Forecast</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>5-year projection</p></div></div><div style={{ textAlign:'right' }}><p style={{ fontWeight:900,fontSize:'16px',color:'#f59e0b',margin:0 }}>${d.monthly}/mo</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>Reserve</p></div></div>
      <Card style={{ marginBottom:'12px',borderColor:'rgba(251,191,36,0.3)',background:'rgba(251,191,36,0.08)' }}><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0 }}>{d.summary}</p></Card>
      {d.items.map(item=><div key={item.system} style={{ display:'flex',alignItems:'center',gap:'10px',padding:'8px 10px',borderRadius:'8px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'5px' }}><span style={{ fontSize:'18px',flexShrink:0 }}>{item.icon}</span><div style={{ flex:1 }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',margin:0 }}>{item.system}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0 }}>~${item.cost.toLocaleString()} · in ~{item.years}yr</p></div><Badge color={pc[item.priority]}>{item.priority}</Badge></div>)}
    </div>
  )
}

function RenovationBlenderPanel({ listing, t }) {
  const [idea,setIdea]=useState('')
  const [result,setResult]=useState(null)
  const [loading,setLoading]=useState(false)
  const generate=()=>{ if(!idea.trim()) return; setLoading(true); setTimeout(()=>{ setResult(generateRenovationPlan(listing,idea)); setLoading(false) },700) }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🔨</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Renovation Blender</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>AI cost + ROI breakdown</p></div></div>
      <textarea value={idea} onChange={e=>setIdea(e.target.value)} placeholder="Describe your renovation idea... 'full kitchen remodel' or 'finish the basement'" style={{ width:'100%',padding:'10px',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'10px',background:'rgba(255,255,255,0.05)',color:'#fff',fontSize:'12px',resize:'vertical',minHeight:'70px',outline:'none',boxSizing:'border-box',marginBottom:'8px' }} onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor='rgba(255,255,255,0.15)'} />
      <button onClick={generate} disabled={!idea.trim()||loading} style={{ width:'100%',padding:'11px',borderRadius:'10px',border:'none',background:!idea.trim()?'rgba(255,255,255,0.1)':t.gradient,color:'#fff',cursor:!idea.trim()?'not-allowed':'pointer',fontSize:'13px',fontWeight:700,marginBottom:'14px' }}>{loading?'⏳ Analyzing…':'🔨 Blend My Renovation'}</button>
      {result&&<div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'10px' }}>
          {[{label:'Cost Range',val:`$${Math.round(result.low/1000)}k–$${Math.round(result.high/1000)}k`,color:'#f59e0b'},{label:'ROI Score',val:`${result.roi}%`,color:'#22c55e'},{label:'Timeline',val:result.timeline,color:'#3b82f6'}].map(({label,val,color})=><Card key={label} style={{ textAlign:'center' }}><p style={{ fontWeight:900,fontSize:'14px',color,margin:0 }}>{val}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:'2px 0 0' }}>{label}</p></Card>)}
        </div>
        <Card><p style={{ fontSize:'11px',fontWeight:700,color:'#22c55e',marginBottom:'6px' }}>New Est. Value: ${result.newValue.toLocaleString()} (+${result.valueGain.toLocaleString()})</p>{result.phases.map((ph,i)=><div key={i} style={{ display:'flex',alignItems:'center',gap:'7px',marginBottom:'4px' }}><span style={{ width:'16px',height:'16px',borderRadius:'50%',background:t.accent,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:800,color:'#fff',flexShrink:0 }}>{i+1}</span><span style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)' }}>{ph}</span></div>)}</Card>
      </div>}
    </div>
  )
}

function ClimatePanel({ listing, t }) {
  const [year,setYear]=useState(2035)
  const d=generateClimateForecast(listing,year)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🌡️</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Climate Fortune Teller</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>NOAA-based projection</p></div></div>
      <div style={{ marginBottom:'14px' }}><label style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',fontWeight:600,display:'block',marginBottom:'4px' }}>Forecast Year: {year}</label><input type="range" min={2026} max={2055} step={1} value={year} onChange={e=>setYear(parseInt(e.target.value))} style={{ width:'100%',accentColor:t.accent }} /><div style={{ display:'flex',justifyContent:'space-between',marginTop:'2px' }}><span style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)' }}>2026</span><span style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)' }}>2055</span></div></div>
      <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'10px' }}>
        {[{label:'Snow Days',val:Math.round(d.projections.snowDays),icon:'❄️',color:'#38bdf8'},{label:'Heat Days 90°F+',val:Math.round(d.projections.heatDays),icon:'☀️',color:'#f97316'},{label:'Flood Risk',val:`${Math.round(d.projections.floodRisk)}%`,icon:'🌊',color:'#3b82f6'},{label:'Storm Events/yr',val:Math.round(d.projections.stormEvents),icon:'⛈️',color:'#8b5cf6'}].map(({label,val,icon,color})=><Card key={label} style={{ textAlign:'center' }}><span style={{ fontSize:'18px' }}>{icon}</span><p style={{ fontWeight:900,fontSize:'16px',color,margin:'3px 0 1px' }}>{val}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0 }}>{label}</p></Card>)}
      </div>
      <Card style={{ marginBottom:'8px' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0 }}>{d.narrative}</p></Card>
      <div style={{ padding:'9px 12px',borderRadius:'10px',background:d.recommendation.startsWith('⚠️')?'rgba(239,68,68,0.1)':'rgba(34,197,94,0.1)',border:`1px solid ${d.recommendation.startsWith('⚠️')?'rgba(239,68,68,0.3)':'rgba(34,197,94,0.3)'}` }}><p style={{ fontSize:'11px',fontWeight:700,color:d.recommendation.startsWith('⚠️')?'#fca5a5':'#86efac',margin:0 }}>{d.recommendation}</p></div>
    </div>
  )
}

function DueDiligencePanel({ listing, t }) {
  const [checked,setChecked]=useState({})
  const d=generateDueDiligencePackage(listing)
  const rc={ High:'#ef4444', Medium:'#f59e0b', Low:'#22c55e' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>📋</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Due Diligence Package</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Risk: {d.riskScore}</p></div></div></div>
      <Section title="Risk Flags">{d.risks.map((r,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'8px',padding:'9px 10px',borderRadius:'9px',background:`${rc[r.level]}10`,border:`1px solid ${rc[r.level]}30`,marginBottom:'6px' }}><Badge color={rc[r.level]}>{r.level}</Badge><div><p style={{ fontWeight:700,fontSize:'11px',color:'#fff',margin:0 }}>{r.item}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.6)',margin:'2px 0 0' }}>{r.detail}</p></div></div>)}</Section>
      <Section title="Pre-Offer Checklist">{d.checklist.map((item,i)=><button key={i} onClick={()=>setChecked(p=>({...p,[i]:!p[i]}))} style={{ width:'100%',display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',border:'none',background:checked[i]?'rgba(34,197,94,0.1)':'rgba(255,255,255,0.04)',cursor:'pointer',marginBottom:'3px',textAlign:'left' }}><div style={{ width:'16px',height:'16px',borderRadius:'4px',border:`2px solid ${checked[i]?'#22c55e':'rgba(255,255,255,0.3)'}`,background:checked[i]?'#22c55e':'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0 }}>{checked[i]&&<span style={{ color:'#fff',fontSize:'10px',fontWeight:900 }}>✓</span>}</div><span style={{ fontSize:'11px',color:checked[i]?'rgba(255,255,255,0.4)':'rgba(255,255,255,0.8)',textDecoration:checked[i]?'line-through':'none' }}>{item.item}</span></button>)}<p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',textAlign:'center',marginTop:'6px' }}>{Object.values(checked).filter(Boolean).length}/{d.checklist.length} completed</p></Section>
    </div>
  )
}

// ── NEW PROFESSIONAL PANELS ───────────────────────────────────────────────────

function LeadQualPanel({ listing, t }) {
  const d=generateLeadQualification(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>🎯</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Lead Qualifier</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>AI intent analysis</p></div></div><div style={{ textAlign:'right' }}><p style={{ fontWeight:900,fontSize:'22px',color:d.score>75?'#22c55e':d.score>60?'#f59e0b':'#3b82f6',margin:0 }}>{d.score}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>Lead Score</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:d.score>75?'rgba(34,197,94,0.3)':'rgba(251,191,36,0.3)',background:d.score>75?'rgba(34,197,94,0.08)':'rgba(251,191,36,0.08)' }}><p style={{ fontWeight:800,fontSize:'14px',color:d.score>75?'#22c55e':'#fbbf24',marginBottom:'4px' }}>{d.label}</p><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.7)',margin:0 }}>{d.stage} · {d.conversionProbability}</p></Card>
      <Section title="Recommended Action"><div style={{ padding:'10px 12px',borderRadius:'10px',background:`${t.accent}12`,border:`1px solid ${t.accent}30` }}><p style={{ fontSize:'12px',fontWeight:600,color:t.accent,margin:0 }}>{d.recommendedAction}</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',margin:'3px 0 0' }}>{d.timeline}</p></div></Section>
      <Section title="Draft Response"><Card><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0,fontStyle:'italic' }}>"{d.draftResponse}"</p></Card></Section>
    </div>
  )
}

function BuyerEducationPanel({ listing, t }) {
  const [active,setActive]=useState(0)
  const d=generateBuyerEducation(listing)
  const colors={ Essential:'#22c55e', Important:'#f59e0b', Informational:'#3b82f6' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px' }}><span style={{ fontSize:'28px' }}>🎓</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Buyer Education</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Personalized learning modules</p></div></div>
      <div style={{ display:'flex',gap:'5px',flexWrap:'wrap',marginBottom:'14px' }}>{d.modules.map((m,i)=><button key={i} onClick={()=>setActive(i)} style={{ padding:'4px 10px',borderRadius:'14px',border:`1px solid ${active===i?m.color:`${m.color}40`}`,background:active===i?`${m.color}20`:'transparent',color:active===i?m.color:`${m.color}80`,cursor:'pointer',fontSize:'10px',fontWeight:700 }}>{m.title.split(' ').slice(0,2).join(' ')}</button>)}</div>
      {d.modules[active]&&<Card style={{ borderColor:`${colors[d.modules[active].level]}40`,background:`${colors[d.modules[active].level]}08` }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px' }}><p style={{ fontWeight:700,fontSize:'13px',color:'#fff',margin:0 }}>{d.modules[active].title}</p><Badge color={colors[d.modules[active].level]}>{d.modules[active].level}</Badge></div><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.82)',lineHeight:1.65,margin:0 }}>{d.modules[active].content}</p></Card>}
    </div>
  )
}

function VendorPanel({ listing, t }) {
  const d=generateVendorCoordination(listing)
  const urgencyColor={ 'Pre-Offer':'#ef4444','Pre-Closing':'#f59e0b','Soon':'#f97316','Routine':'#22c55e','Post-Close':'#3b82f6','Evaluate':'#8b5cf6' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px' }}><span style={{ fontSize:'28px' }}>🔧</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Vendor Coordinator</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Local MN/ND vetted vendors</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.06)' }}><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',textTransform:'uppercase',fontWeight:700,marginBottom:'4px' }}>Estimated Pre-Closing Costs</p><p style={{ fontSize:'13px',fontWeight:700,color:'#ef4444',margin:0 }}>{d.totalEstimatedCost}</p></Card>
      {d.vendors.map((v,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px 12px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'6px' }}><span style={{ fontSize:'22px',flexShrink:0 }}>{v.icon}</span><div style={{ flex:1,minWidth:0 }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2px' }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',margin:0 }}>{v.name}</p><Badge color={urgencyColor[v.urgency]||'#94a3b8'}>{v.urgency}</Badge></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',margin:'0 0 3px' }}>{v.category} · {v.phone}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:0 }}>{v.note}</p></div></div>)}
    </div>
  )
}

function IntelligenceBriefPanel({ listing, allListings, t }) {
  const d=generateIntelligenceBrief(listing, allListings)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>📄</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Intelligence Brief</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Unified property analysis</p></div></div><div style={{ width:'52px',height:'52px',borderRadius:'50%',background:d.overallScore>70?'rgba(34,197,94,0.2)':'rgba(251,191,36,0.2)',border:`2px solid ${d.overallScore>70?'#22c55e':'#fbbf24'}`,display:'flex',alignItems:'center',justifyContent:'center' }}><span style={{ fontWeight:900,fontSize:'15px',color:'#fff' }}>{d.overallScore}</span></div></div>
      {d.sections.map((s,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'10px',padding:'10px 12px',borderRadius:'10px',background:`${s.color}08`,border:`1px solid ${s.color}30`,marginBottom:'6px' }}><span style={{ fontSize:'20px',flexShrink:0 }}>{s.icon}</span><div style={{ flex:1 }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'3px' }}><p style={{ fontWeight:700,fontSize:'12px',color:s.color,margin:0 }}>{s.label}</p><span style={{ fontSize:'12px',fontWeight:800,color:s.color }}>{s.score}/100</span></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',lineHeight:1.5,margin:0 }}>{s.summary}</p></div></div>)}
      <Card style={{ marginTop:'8px',borderColor:d.overallScore>70?'rgba(34,197,94,0.3)':'rgba(251,191,36,0.3)',background:d.overallScore>70?'rgba(34,197,94,0.08)':'rgba(251,191,36,0.08)' }}><p style={{ fontSize:'13px',fontWeight:700,color:'#fff',margin:0 }}>{d.recommendation}</p></Card>
    </div>
  )
}

function InspectionPanel({ listing, t }) {
  const d=generateInspectionPlan(listing)
  const pc={ ALWAYS:'#ef4444', HIGH:'#f97316', MEDIUM:'#f59e0b', LOW:'#22c55e' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🔍</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Inspection Planner</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>ND-specific risk workflow</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(239,68,68,0.3)',background:'rgba(239,68,68,0.06)' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',margin:0 }}>Est. inspection investment: <span style={{ fontWeight:700,color:'#ef4444' }}>{d.estimatedCost}</span></p></Card>
      <Section title="ND Priority Risks">{d.ndRisks.map((r,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'8px',padding:'9px 10px',borderRadius:'8px',background:`${pc[r.priority]}10`,border:`1px solid ${pc[r.priority]}30`,marginBottom:'5px' }}><span style={{ fontSize:'18px',flexShrink:0 }}>{r.icon}</span><div style={{ flex:1 }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2px' }}><p style={{ fontWeight:700,fontSize:'11px',color:'#fff',margin:0 }}>{r.risk}</p><Badge color={pc[r.priority]}>{r.priority}</Badge></div><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.6)',margin:'0 0 2px' }}>{r.rationale}</p><p style={{ fontSize:'10px',color:t.accent,margin:0,fontWeight:600 }}>{r.cost}</p></div></div>)}</Section>
    </div>
  )
}

function FinancingPanel({ listing, t }) {
  const [active,setActive]=useState(0)
  const scenarios=generateFinancingScenarios(listing)
  const s=scenarios[active]
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>💳</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Financing Modeler</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Multi-scenario comparison</p></div></div>
      <div style={{ display:'flex',gap:'4px',flexWrap:'wrap',marginBottom:'12px' }}>{scenarios.map((sc,i)=><button key={i} onClick={()=>setActive(i)} style={{ padding:'4px 9px',borderRadius:'14px',border:`1px solid ${active===i?sc.color:`${sc.color}40`}`,background:active===i?`${sc.color}20`:'transparent',color:active===i?sc.color:`${sc.color}70`,cursor:'pointer',fontSize:'10px',fontWeight:700 }}>{sc.name}</button>)}</div>
      {s&&<div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'10px' }}>
          {[{label:'Down Payment',val:`$${Math.round(s.downAmt/1000)}k`,c:s.color},{label:'Monthly P+I',val:`$${s.payment.toLocaleString()}`,c:'#22c55e'},{label:'Rate',val:`${s.rate}%`,c:'#3b82f6'}].map(({label,val,c})=><Card key={label} style={{ textAlign:'center' }}><p style={{ fontWeight:900,fontSize:'14px',color:c,margin:0 }}>{val}</p><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',margin:'2px 0 0' }}>{label}</p></Card>)}
        </div>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'8px' }}>
          {[{label:'Total Interest',val:`$${Math.round(s.interest/1000)}k`,c:'#f59e0b'},{label:'Loan Amount',val:`$${Math.round(s.loan/1000)}k`,c:'#8b5cf6'},{label:'Total Cost',val:`$${Math.round(s.total/1000)}k`,c:'#ef4444'},{label:'PMI/mo',val:s.pmi>0?`$${s.pmi}`:'None',c:s.pmi>0?'#ef4444':'#22c55e'}].map(({label,val,c})=><Card key={label}><p style={{ fontWeight:800,fontSize:'13px',color:c,margin:0 }}>{val}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:'2px 0 0' }}>{label}</p></Card>)}
        </div>
        {s.pmi>0&&<div style={{ padding:'8px 12px',borderRadius:'8px',background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)' }}><p style={{ fontSize:'11px',color:'#fca5a5',margin:0 }}>⚠️ PMI of ${s.pmi}/mo applies until 20% equity is reached (~{Math.round(20/((listing.price*0.04)/listing.price))} months at current appreciation)</p></div>}
      </div>}
    </div>
  )
}

function TitlePanel({ listing, t }) {
  const d=generateTitleInsights(listing)
  const sc={ Low:'#22c55e', Medium:'#f59e0b', High:'#ef4444' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>📜</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Title Insights</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>{d.clearTitle?'✅ Clear Title':'⚠️ Items to Review'}</p></div></div></div>
      <Card style={{ marginBottom:'10px',borderColor:d.clearTitle?'rgba(34,197,94,0.3)':'rgba(251,191,36,0.3)',background:d.clearTitle?'rgba(34,197,94,0.06)':'rgba(251,191,36,0.06)' }}><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0 }}>{d.summary}</p></Card>
      {d.issues.map((issue,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'8px',padding:'10px 12px',borderRadius:'10px',background:`${sc[issue.severity]}08`,border:`1px solid ${sc[issue.severity]}30`,marginBottom:'6px' }}><div style={{ flex:1 }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'3px' }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',margin:0 }}>{issue.type}</p><Badge color={sc[issue.severity]}>{issue.severity}</Badge></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',margin:'0 0 4px' }}>{issue.detail}</p><p style={{ fontSize:'10px',color:t.accent,margin:0,fontWeight:600 }}>Resolution: {issue.resolution} · {issue.cost}</p></div></div>)}
    </div>
  )
}

function RebatesPanel({ listing, t }) {
  const d=generateSustainabilityRebates(listing)
  const typeColor={ 'Federal Tax Credit':'#3b82f6','Utility Rebate':'#22c55e','State Grant':'#8b5cf6','Federal Loan':'#f59e0b','Financing Program':'#06b6d4' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>♻️</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Rebate Maximizer</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Federal + MN incentives</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.08)' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',margin:'0 0 3px' }}>Combined Potential Value</p><p style={{ fontWeight:900,fontSize:'18px',color:'#22c55e',margin:0 }}>{d.totalEstimate}</p></Card>
      {d.rebates.map((r,i)=><div key={i} style={{ padding:'10px 12px',borderRadius:'10px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'6px' }}><div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'4px' }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',margin:0,flex:1,paddingRight:'8px' }}>{r.program}</p><Badge color={typeColor[r.type]||'#94a3b8'}>{r.amount}</Badge></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',margin:'0 0 3px' }}>{r.description}</p><p style={{ fontSize:'10px',color:t.accent,margin:0 }}>Deadline: {r.deadline}</p></div>)}
    </div>
  )
}

function RelocationPanel({ listing, t }) {
  const [phase,setPhase]=useState(0)
  const d=generateRelocationPlan(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>📦</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Relocation Planner</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>90-day move-in orchestration</p></div></div>
      <div style={{ display:'flex',gap:'5px',marginBottom:'14px' }}>{d.phases.map((ph,i)=><button key={i} onClick={()=>setPhase(i)} style={{ flex:1,padding:'6px',borderRadius:'8px',border:`1px solid ${phase===i?ph.color:`${ph.color}40`}`,background:phase===i?`${ph.color}20`:'transparent',color:phase===i?ph.color:`${ph.color}70`,cursor:'pointer',fontSize:'10px',fontWeight:700,textAlign:'center' }}>{ph.phase.split('·')[0].trim()}</button>)}</div>
      {d.phases[phase]&&<Card style={{ borderColor:`${d.phases[phase].color}40`,background:`${d.phases[phase].color}06` }}><div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px' }}><span style={{ fontSize:'22px' }}>{d.phases[phase].icon}</span><p style={{ fontWeight:700,fontSize:'13px',color:d.phases[phase].color,margin:0 }}>{d.phases[phase].title}</p></div>{d.phases[phase].tasks.map((task,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'7px',marginBottom:'6px' }}><span style={{ width:'16px',height:'16px',borderRadius:'50%',background:d.phases[phase].color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:800,color:'#fff',flexShrink:0,marginTop:'1px' }}>{i+1}</span><span style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.5 }}>{task}</span></div>)}</Card>}
    </div>
  )
}

function ReferralPanel({ listing, t }) {
  const d=generateReferralEngine(listing)
  const tc={ 'Check-in':'#3b82f6','Satisfaction':'#22c55e','Referral':'#f59e0b','Retention':'#8b5cf6' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>⭐</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Referral Engine</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Post-transaction retention</p></div></div><div style={{ textAlign:'right' }}><p style={{ fontWeight:900,fontSize:'18px',color:'#f59e0b',margin:0 }}>{d.satisfactionScore}%</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>NPS Est.</p></div></div>
      <Card style={{ marginBottom:'12px',borderColor:'rgba(251,191,36,0.3)',background:'rgba(251,191,36,0.08)' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',margin:'0 0 3px' }}>Referral Value Est.</p><p style={{ fontWeight:700,fontSize:'13px',color:'#fbbf24',margin:0 }}>{d.referralValue}</p></Card>
      <Section title="Automated Touchpoint Timeline">{d.moments.map((m,i)=><div key={i} style={{ padding:'10px 12px',borderRadius:'10px',background:`${tc[m.type]||'#94a3b8'}08`,border:`1px solid ${tc[m.type]||'#94a3b8'}30`,marginBottom:'6px' }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'4px' }}><p style={{ fontWeight:700,fontSize:'11px',color:'#fff',margin:0 }}>{m.timing}</p><Badge color={tc[m.type]||'#94a3b8'}>{m.type}</Badge></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',margin:0,fontStyle:'italic' }}>"{m.message.substring(0,100)}…"</p></div>)}</Section>
    </div>
  )
}

function InvestmentPanel({ listing, t }) {
  const [active,setActive]=useState(1)
  const d=generateInvestmentSimulator(listing)
  const s=d.scenarios[active]
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>📈</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Investment Simulator</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>IRR + equity projections</p></div></div>
      <div style={{ display:'flex',gap:'6px',marginBottom:'12px' }}>{d.scenarios.map((sc,i)=><button key={i} onClick={()=>setActive(i)} style={{ flex:1,padding:'7px',borderRadius:'8px',border:`1px solid ${active===i?t.accent:`${t.accent}40`}`,background:active===i?`${t.accent}20`:'transparent',color:active===i?t.accent:`${t.accent}70`,cursor:'pointer',fontSize:'11px',fontWeight:700,textAlign:'center' }}>{sc.years}yr</button>)}</div>
      <Card style={{ marginBottom:'10px' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',margin:'0 0 10px' }}>Down Payment: ${Math.round(d.downPayment/1000)}k · Scenario: {s.years}-Year Hold</p>
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'7px' }}>
          {[{label:'Future Value',val:`$${Math.round(s.futureValue/1000)}k`,c:'#22c55e'},{label:'IRR',val:`${s.irr}%`,c:t.accent},{label:'Total Return',val:`$${Math.round(Math.abs(s.totalReturn)/1000)}k`,c:s.totalReturn>0?'#22c55e':'#ef4444'},{label:'Monthly Rent',val:`$${Math.round(s.monthlyRent).toLocaleString()}`,c:'#3b82f6'}].map(({label,val,c})=><div key={label} style={{ textAlign:'center',padding:'8px',borderRadius:'8px',background:'rgba(255,255,255,0.06)' }}><p style={{ fontWeight:900,fontSize:'16px',color:c,margin:0 }}>{val}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:'2px 0 0' }}>{label}</p></div>)}
        </div>
      </Card>
      <Card><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.75)',lineHeight:1.6,margin:0 }}>{d.summary}</p></Card>
    </div>
  )
}

function ResiliencePanel({ listing, t }) {
  const d=generateNeighborhoodResilience(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>🛡️</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Resilience Profile</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Neighborhood stability analysis</p></div></div><div style={{ width:'48px',height:'48px',borderRadius:'50%',background:'rgba(34,197,94,0.2)',border:'2px solid #22c55e',display:'flex',alignItems:'center',justifyContent:'center' }}><span style={{ fontWeight:900,fontSize:'14px',color:'#fff' }}>{d.overallScore}</span></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.06)' }}><p style={{ fontSize:'11px',color:'#86efac',margin:0 }}>{d.outlook}</p></Card>
      {d.scores.map(s=><Bar key={s.label} value={s.score} color={s.color} label={`${s.icon} ${s.label}`} />)}
      <Section title="Risk Factors">{d.risks.map((r,i)=><div key={i} style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.06)' }}>⚠️ {r}</div>)}</Section>
    </div>
  )
}

function ClosingPanel({ listing, t }) {
  const d=generateClosingPredictor(listing)
  const rc={ 'Low':'#22c55e','Medium':'#f59e0b','High':'#ef4444' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>📅</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Closing Predictor</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Cost + timeline forecast</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.08)' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',margin:'0 0 3px' }}>Total Cash to Close</p><p style={{ fontWeight:900,fontSize:'20px',color:'#22c55e',margin:0 }}>${d.cashToClose.toLocaleString()}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.4)',margin:'3px 0 0' }}>Delay Risk: {d.delayRisk}</p></Card>
      <Section title="Closing Cost Breakdown">{Object.entries(d.closingCosts).slice(0,6).map(([key,val])=><div key={key} style={{ display:'flex',justifyContent:'space-between',padding:'5px 0',borderBottom:'1px solid rgba(255,255,255,0.06)' }}><span style={{ fontSize:'11px',color:'rgba(255,255,255,0.6)',textTransform:'capitalize' }}>{key.replace(/([A-Z])/g,' $1').trim()}</span><span style={{ fontSize:'11px',fontWeight:700,color:'#fff' }}>${val.toLocaleString()}</span></div>)}<div style={{ display:'flex',justifyContent:'space-between',padding:'8px 0',borderTop:'1px solid rgba(255,255,255,0.15)',marginTop:'4px' }}><span style={{ fontSize:'12px',fontWeight:800,color:'#fff' }}>Total Closing Costs</span><span style={{ fontSize:'12px',fontWeight:900,color:'#22c55e' }}>${d.total.toLocaleString()}</span></div></Section>
    </div>
  )
}

function ESGPanel({ listing, t }) {
  const d=generateESGScore(listing)
  const keys={ energyEfficiency:'⚡ Energy Efficiency', carbonFootprint:'🌱 Carbon Footprint', waterUsage:'💧 Water Usage', greenProximity:'🌳 Green Proximity', transitAccess:'🚌 Transit Access' }
  const colors={ energyEfficiency:'#22c55e', carbonFootprint:'#10b981', waterUsage:'#3b82f6', greenProximity:'#84cc16', transitAccess:'#06b6d4' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'14px' }}><div style={{ display:'flex',alignItems:'center',gap:'10px' }}><span style={{ fontSize:'28px' }}>🌿</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>ESG Scorer</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Sustainability analysis</p></div></div><div style={{ textAlign:'right' }}><p style={{ fontWeight:900,fontSize:'22px',color:'#22c55e',margin:0 }}>{d.overall}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.3)',margin:0 }}>ESG Score</p></div></div>
      <Card style={{ marginBottom:'12px',borderColor:'rgba(34,197,94,0.3)',background:'rgba(34,197,94,0.06)' }}><p style={{ fontWeight:700,fontSize:'12px',color:'#22c55e',marginBottom:'3px' }}>{d.label}</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',margin:0 }}>{d.certificationPath}</p></Card>
      {Object.entries(d.scores).map(([k,v])=><Bar key={k} value={v} color={colors[k]||'#22c55e'} label={keys[k]||k} />)}
      <Section title="Top Improvements">{d.improvements.slice(0,3).map((imp,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'8px',padding:'8px 10px',borderRadius:'8px',background:'rgba(34,197,94,0.06)',border:'1px solid rgba(34,197,94,0.2)',marginBottom:'5px' }}><div style={{ flex:1 }}><p style={{ fontWeight:700,fontSize:'11px',color:'#fff',margin:0 }}>{imp.action}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:'2px 0 0' }}>Cost: {imp.cost} · Save: {imp.saving} · ROI: {imp.roi}</p></div></div>)}</Section>
    </div>
  )
}

function CMAPanel({ listing, allListings, t }) {
  const d=generateCMAReport(listing, allListings)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>📑</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>CMA Report</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Comparative market analysis · {d.confidence}% confidence</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:d.listPriceDelta>0?'rgba(251,191,36,0.3)':'rgba(34,197,94,0.3)',background:d.listPriceDelta>0?'rgba(251,191,36,0.06)':'rgba(34,197,94,0.06)' }}><p style={{ fontWeight:700,fontSize:'12px',color:'#fff',marginBottom:'4px' }}>{d.valuationVerdict}</p><div style={{ display:'flex',gap:'10px' }}><div style={{ textAlign:'center',flex:1 }}><p style={{ fontWeight:900,fontSize:'16px',color:'#22c55e',margin:0 }}>${Math.round(d.range.low/1000)}k</p><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',margin:0 }}>Low</p></div><div style={{ textAlign:'center',flex:1 }}><p style={{ fontWeight:900,fontSize:'20px',color:t.accent,margin:0 }}>${Math.round(d.range.mid/1000)}k</p><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',margin:0 }}>Mid</p></div><div style={{ textAlign:'center',flex:1 }}><p style={{ fontWeight:900,fontSize:'16px',color:'#ef4444',margin:0 }}>${Math.round(d.range.high/1000)}k</p><p style={{ fontSize:'9px',color:'rgba(255,255,255,0.4)',margin:0 }}>High</p></div></div></Card>
      <Section title="Adjusted Comparables">{d.comps.slice(0,4).map((c,i)=><div key={i} style={{ display:'flex',alignItems:'center',gap:'8px',padding:'8px 10px',borderRadius:'8px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',marginBottom:'5px' }}><img src={c.photo} alt="" style={{ width:'36px',height:'36px',borderRadius:'6px',objectFit:'cover',flexShrink:0 }} /><div style={{ flex:1,minWidth:0 }}><p style={{ fontWeight:700,fontSize:'11px',color:'#fff',margin:0,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.address}</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.5)',margin:'1px 0 0' }}>{c.beds}bd · {c.sqft?.toLocaleString()}sqft · ${c.ppsf}/sqft</p></div><div style={{ textAlign:'right',flexShrink:0 }}><p style={{ fontWeight:700,fontSize:'12px',color:t.accent,margin:0 }}>${Math.round(c.adjPrice/1000)}k</p><p style={{ fontSize:'9px',color:c.adjustment>0?'#22c55e':'#f59e0b',margin:0 }}>{c.adjustment>0?'+':''}${Math.round(c.adjustment/1000)}k adj</p></div></div>)}</Section>
    </div>
  )
}

function MarketingPanel({ listing, t }) {
  const [tab,setTab]=useState('mls')
  const d=generateMarketingPackage(listing)
  const tabs=[['mls','📝 MLS'],['social','📱 Social'],['email','📧 Email'],['personas','👥 Personas']]
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>📣</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Marketing Generator</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Full listing package</p></div></div>
      <div style={{ display:'flex',gap:'4px',marginBottom:'12px' }}>{tabs.map(([id,label])=><button key={id} onClick={()=>setTab(id)} style={{ flex:1,padding:'5px',borderRadius:'8px',border:`1px solid ${tab===id?t.accent:`${t.accent}30`}`,background:tab===id?`${t.accent}20`:'transparent',color:tab===id?t.accent:`${t.accent}60`,cursor:'pointer',fontSize:'10px',fontWeight:700 }}>{label}</button>)}</div>
      {tab==='mls'&&<Card><p style={{ fontSize:'11px',fontWeight:700,color:t.accent,marginBottom:'6px' }}>{d.headline}</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.65,margin:0 }}>{d.mlsDescription}</p></Card>}
      {tab==='social'&&<Card><p style={{ fontSize:'12px',color:'rgba(255,255,255,0.85)',lineHeight:1.7,margin:0,whiteSpace:'pre-line' }}>{d.socialCaption}</p></Card>}
      {tab==='email'&&<Card><p style={{ fontSize:'11px',fontWeight:700,color:t.accent,marginBottom:'6px' }}>Subject: {d.emailSubject}</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.7)',margin:0 }}>Personalized email sequence available for 3 buyer persona segments.</p></Card>}
      {tab==='personas'&&d.targetPersonas.map((p,i)=><Card key={i} style={{ marginBottom:'8px' }}><p style={{ fontWeight:700,fontSize:'12px',color:t.accent,marginBottom:'4px' }}>{p.persona}</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.6,margin:0 }}>{p.angle}</p></Card>)}
    </div>
  )
}

function BuyerJourneyPanel({ listing, t }) {
  const d=generateBuyerJourney(listing)
  const sc={ recommended:'#f59e0b',active:'#22c55e',next:'#3b82f6',upcoming:'rgba(255,255,255,0.2)' }
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'14px' }}><span style={{ fontSize:'28px' }}>🗺️</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Buyer Journey Map</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>Your path to closing</p></div></div>
      {d.stages.map((s,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'10px',marginBottom:'8px' }}><div style={{ display:'flex',flexDirection:'column',alignItems:'center',flexShrink:0 }}><div style={{ width:'32px',height:'32px',borderRadius:'50%',background:sc[s.status]||'rgba(255,255,255,0.1)',border:`2px solid ${sc[s.status]||'rgba(255,255,255,0.2)'}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'14px' }}>{s.icon}</div>{i<d.stages.length-1&&<div style={{ width:'2px',height:'16px',background:'rgba(255,255,255,0.1)',margin:'3px 0' }} />}</div><div style={{ flex:1,paddingTop:'4px' }}><div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'2px' }}><p style={{ fontWeight:700,fontSize:'12px',color:s.status==='active'?'#22c55e':s.status==='next'?'#3b82f6':'rgba(255,255,255,0.8)',margin:0 }}>{s.stage}</p><Badge color={sc[s.status]||'#94a3b8'}>{s.status}</Badge></div><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.55)',lineHeight:1.5,margin:0 }}>{s.detail}</p></div></div>)}
    </div>
  )
}

function PostClosingPanel({ listing, t }) {
  const [phase,setPhase]=useState(0)
  const d=generatePostClosingAdvisor(listing)
  return (
    <div>
      <div style={{ display:'flex',alignItems:'center',gap:'10px',marginBottom:'12px' }}><span style={{ fontSize:'28px' }}>🏡</span><div><p style={{ fontWeight:800,fontSize:'15px',color:'#fff',margin:0 }}>Post-Closing Advisor</p><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.4)',margin:0 }}>90-day settle-in plan</p></div></div>
      <Card style={{ marginBottom:'10px',borderColor:'rgba(251,191,36,0.3)',background:'rgba(251,191,36,0.06)' }}><p style={{ fontSize:'11px',color:'rgba(255,255,255,0.5)',margin:'0 0 3px' }}>Year 1 Ownership Est.</p><p style={{ fontWeight:700,fontSize:'13px',color:'#fbbf24',margin:0 }}>{d.estimatedYear1Costs}</p></Card>
      <div style={{ display:'flex',gap:'5px',marginBottom:'12px' }}>{d.months.map((m,i)=><button key={i} onClick={()=>setPhase(i)} style={{ flex:1,padding:'6px',borderRadius:'8px',border:`1px solid ${phase===i?m.color:`${m.color}40`}`,background:phase===i?`${m.color}20`:'transparent',color:phase===i?m.color:`${m.color}60`,cursor:'pointer',fontSize:'10px',fontWeight:700,textAlign:'center' }}>{m.month}</button>)}</div>
      {d.months[phase]&&<Card style={{ borderColor:`${d.months[phase].color}40`,background:`${d.months[phase].color}06` }}><div style={{ display:'flex',alignItems:'center',gap:'8px',marginBottom:'10px' }}><span style={{ fontSize:'20px' }}>{d.months[phase].icon}</span><p style={{ fontWeight:700,fontSize:'13px',color:d.months[phase].color,margin:0 }}>{d.months[phase].title}</p></div>{d.months[phase].tasks.map((task,i)=><div key={i} style={{ display:'flex',alignItems:'flex-start',gap:'7px',marginBottom:'6px' }}><span style={{ width:'15px',height:'15px',borderRadius:'50%',background:d.months[phase].color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'9px',fontWeight:800,color:'#fff',flexShrink:0,marginTop:'1px' }}>{i+1}</span><span style={{ fontSize:'11px',color:'rgba(255,255,255,0.8)',lineHeight:1.5 }}>{task}</span></div>)}</Card>}
    </div>
  )
}

// ── MAIN FEATURE PANEL ────────────────────────────────────────────────────────
export default function FeaturePanel({ listing, allListings, t, c, enabledFeatures, onClose, onSelectListing }) {
  const [activeFeature, setActiveFeature] = useState(null)

  const ALL_FEATURES = [
    { id:'savage_mode',           label:'🔥 Roast',         comp:<SavageRoastPanel      listing={listing} t={t} /> },
    { id:'hidden_gem',            label:'💎 Gem Radar',     comp:<HiddenGemPanel        listing={listing} allListings={allListings} t={t} /> },
    { id:'vibe_roulette',         label:'🎰 Vibes',         comp:<VibeRoulettePanel     listing={listing} allListings={allListings} t={t} onSelectListing={onSelectListing} /> },
    { id:'emotional_fit',         label:'💝 Fit Quiz',      comp:<EmotionalFitPanel     listing={listing} t={t} /> },
    { id:'ghost_stories',         label:'👻 History',       comp:<GhostStoryPanel       listing={listing} t={t} /> },
    { id:'regret_minimizer',      label:'🎯 Negotiate',     comp:<RegretMinimizerPanel  listing={listing} t={t} /> },
    { id:'parallel_lives',        label:'🌀 Future',        comp:<ParallelLivesPanel    listing={listing} t={t} /> },
    { id:'market_intelligence',   label:'📊 Market',        comp:<MarketIntelPanel      listing={listing} allListings={allListings} t={t} /> },
    { id:'maintenance_forecast',  label:'🔧 Upkeep',        comp:<MaintenancePanel      listing={listing} t={t} /> },
    { id:'renovation_blender',    label:'🔨 Reno',          comp:<RenovationBlenderPanel listing={listing} t={t} /> },
    { id:'climate_fortune',       label:'🌡️ Climate',       comp:<ClimatePanel          listing={listing} t={t} /> },
    { id:'due_diligence',         label:'📋 DD Pack',       comp:<DueDiligencePanel     listing={listing} t={t} /> },
    { id:'lead_qualifier',        label:'🎯 Leads',         comp:<LeadQualPanel         listing={listing} t={t} /> },
    { id:'buyer_education',       label:'🎓 Education',     comp:<BuyerEducationPanel   listing={listing} t={t} /> },
    { id:'vendor_coordinator',    label:'🔧 Vendors',       comp:<VendorPanel           listing={listing} t={t} /> },
    { id:'intelligence_brief',    label:'📄 Brief',         comp:<IntelligenceBriefPanel listing={listing} allListings={allListings} t={t} /> },
    { id:'inspection_orchestrator',label:'🔍 Inspection',  comp:<InspectionPanel       listing={listing} t={t} /> },
    { id:'financing_modeler',     label:'💳 Financing',     comp:<FinancingPanel        listing={listing} t={t} /> },
    { id:'title_insight',         label:'📜 Title',         comp:<TitlePanel            listing={listing} t={t} /> },
    { id:'sustainability_rebates',label:'♻️ Rebates',       comp:<RebatesPanel          listing={listing} t={t} /> },
    { id:'relocation_planner',    label:'📦 Relocate',      comp:<RelocationPanel       listing={listing} t={t} /> },
    { id:'referral_engine',       label:'⭐ Referrals',     comp:<ReferralPanel         listing={listing} t={t} /> },
    { id:'investment_simulator',  label:'📈 Invest',        comp:<InvestmentPanel       listing={listing} t={t} /> },
    { id:'neighborhood_resilience',label:'🛡️ Resilience',  comp:<ResiliencePanel       listing={listing} t={t} /> },
    { id:'closing_predictor',     label:'📅 Closing',       comp:<ClosingPanel          listing={listing} t={t} /> },
    { id:'esg_score',             label:'🌿 ESG',           comp:<ESGPanel              listing={listing} t={t} /> },
    { id:'cma_generator',         label:'📑 CMA',           comp:<CMAPanel              listing={listing} allListings={allListings} t={t} /> },
    { id:'marketing_generator',   label:'📣 Marketing',     comp:<MarketingPanel        listing={listing} t={t} /> },
    { id:'buyer_journey',         label:'🗺️ Journey',       comp:<BuyerJourneyPanel     listing={listing} t={t} /> },
    { id:'post_closing_advisor',  label:'🏡 Post-Close',    comp:<PostClosingPanel      listing={listing} t={t} /> },
  ]

  const available = ALL_FEATURES.filter(f => enabledFeatures?.[f.id] !== false)
  const active    = available.find(f => f.id === (activeFeature || available[0]?.id)) || available[0]

  if (!available.length) return null

  // auto-select first if none chosen
  const currentId = activeFeature || available[0]?.id

  return (
    <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.82)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:9997,backdropFilter:'blur(8px)',padding:'12px' }} onClick={onClose}>
      <div onClick={e=>e.stopPropagation()}
        style={{ background:'linear-gradient(135deg,#0f0f1a 0%,#1a1a2e 100%)',border:`1px solid ${t.accent}40`,borderRadius:'20px',width:'100%',maxWidth:'600px',maxHeight:'92vh',display:'flex',flexDirection:'column',overflow:'hidden',boxShadow:`0 40px 100px rgba(0,0,0,0.7),0 0 0 1px ${t.accent}20` }}>

        {/* Header */}
        <div style={{ padding:'14px 18px',borderBottom:'1px solid rgba(255,255,255,0.07)',display:'flex',alignItems:'center',justifyContent:'space-between',flexShrink:0 }}>
          <div style={{ display:'flex',alignItems:'center',gap:'9px' }}>
            <div style={{ width:'30px',height:'30px',borderRadius:'8px',background:t.gradient,display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:900,color:'#fff',boxShadow:`0 0 10px ${t.accentGlow}` }}>Z</div>
            <div><p style={{ fontWeight:800,fontSize:'13px',color:'#fff',margin:0 }}>ZephyrAI Features</p><p style={{ fontSize:'10px',color:'rgba(255,255,255,0.35)',margin:0 }}>{listing.address} · {available.length} tools active</p></div>
          </div>
          <button onClick={onClose} style={{ width:'28px',height:'28px',borderRadius:'7px',border:'1px solid rgba(255,255,255,0.15)',background:'transparent',color:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'13px',display:'flex',alignItems:'center',justifyContent:'center' }}>✕</button>
        </div>

        {/* Feature pill grid — wraps into rows, no scroll */}
        <div style={{ padding:'8px 12px',flexShrink:0,borderBottom:'1px solid rgba(255,255,255,0.06)',display:'flex',flexWrap:'wrap',gap:'4px' }}>
          {available.map(f => (
            <button key={f.id} onClick={() => setActiveFeature(f.id)}
              style={{ padding:'3px 8px',borderRadius:'14px',border:`1px solid ${currentId===f.id?t.accent:'rgba(255,255,255,0.1)'}`,background:currentId===f.id?`${t.accent}28`:'rgba(255,255,255,0.03)',color:currentId===f.id?t.accent:'rgba(255,255,255,0.5)',cursor:'pointer',fontSize:'10px',fontWeight:currentId===f.id?800:500,whiteSpace:'nowrap',transition:'all 0.15s',lineHeight:1.4,boxShadow:currentId===f.id?`0 0 6px ${t.accentGlow}`:'none' }}
              onMouseEnter={e=>{ if(currentId!==f.id){ e.currentTarget.style.background='rgba(255,255,255,0.08)';e.currentTarget.style.color='#fff' } }}
              onMouseLeave={e=>{ if(currentId!==f.id){ e.currentTarget.style.background='rgba(255,255,255,0.03)';e.currentTarget.style.color='rgba(255,255,255,0.5)' } }}>
              {f.label}
            </button>
          ))}
        </div>

        {/* Active feature content */}
        <div style={{ flex:1,overflowY:'auto',padding:'18px' }}>
          {active?.comp}
        </div>
      </div>
    </div>
  )
}
