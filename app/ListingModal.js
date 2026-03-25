'use client'
import { useState } from 'react'
import {
  X, Heart, Share2, EyeOff,
  Bed, Bath, MapPin, Maximize2, Clock,
  DollarSign, Phone, Mail, Calendar, Zap,
} from 'lucide-react'
import { formatPrice } from './data'
import NeighborhoodPanel from './NeighborhoodPanel'
import PhotoCarousel from './PhotoCarousel'
import FeaturePanel from './FeaturePanel'

export default function ListingModal({
  listing, c, t,
  onClose, isSaved, onToggleSaved, onHide,
  user, onXP, allListings, featureSettings,
}) {
  const [tab,            setTab]            = useState('details')
  const [featurePanelOpen, setFeaturePanelOpen] = useState(false)

  const photos = listing.photos || (listing.photo ? [{ url: listing.photo, label: '🏠 Exterior' }] : [])

  const tabs = [
    { id: 'details',      label: '🏠 Details'      },
    { id: 'neighborhood', label: '🌆 Neighborhood'  },
    { id: 'mortgage',     label: '💰 Mortgage'      },
    { id: 'contact',      label: '📞 Agent'         },
  ]

  // ── Mortgage calc ──
  const [downPct, setDownPct] = useState(20)
  const [rate,    setRate]    = useState(7.1)
  const [years,   setYears]   = useState(30)
  const down    = listing.price * (downPct / 100)
  const loan    = listing.price - down
  const mo      = rate / 100 / 12
  const n       = years * 12
  const payment = loan > 0 && mo > 0
    ? (loan * mo * Math.pow(1 + mo, n)) / (Math.pow(1 + mo, n) - 1)
    : 0
  const total    = payment * n
  const interest = total - loan

  const anyFeatureOn = featureSettings
    ? Object.values(featureSettings).some(Boolean)
    : true

  return (
    <>
      {/* Feature panel — opens on top of listing modal */}
      {featurePanelOpen && (
        <FeaturePanel
          listing={listing}
          allListings={allListings || [listing]}
          t={t} c={c}
          enabledFeatures={featureSettings}
          onClose={() => setFeaturePanelOpen(false)}
          onSelectListing={() => {}}
        />
      )}

      <div
        style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 9998, backdropFilter: 'blur(6px)', padding: '16px',
        }}
        onClick={onClose}
      >
        <div
          onClick={e => e.stopPropagation()}
          style={{
            background: c.surface, border: `1px solid ${c.border}`,
            borderRadius: '20px', width: '100%', maxWidth: '680px',
            maxHeight: '90vh', display: 'flex', flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${t.accent}20`,
          }}
        >
          {/* ── Photo carousel ── */}
          <div style={{ position: 'relative', height: '260px', flexShrink: 0 }}>
            <PhotoCarousel photos={photos} height={260} showLabel={true} />

            {/* Close */}
            <button onClick={onClose}
              style={{ position:'absolute', top:'14px', right:'14px', zIndex:20, width:'34px', height:'34px', borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', backdropFilter:'blur(8px)' }}>
              <X size={16} />
            </button>

            {/* Action buttons */}
            {user && (
              <div style={{ position:'absolute', top:'14px', left:'14px', zIndex:20, display:'flex', gap:'8px' }}>
                <button onClick={() => { onToggleSaved(listing.id); if (onXP) onXP('SAVE_LISTING') }}
                  style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 14px', borderRadius:'20px', background:isSaved ? t.accent : 'rgba(0,0,0,0.6)', border:`1px solid ${isSaved ? t.accent : 'rgba(255,255,255,0.3)'}`, color:'#fff', cursor:'pointer', fontSize:'12px', fontWeight:700, backdropFilter:'blur(8px)', transition:'all 0.2s' }}>
                  <Heart size={13} style={{ fill: isSaved ? '#fff' : 'none' }} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button onClick={() => { if (onXP) onXP('SHARE_LISTING') }}
                  style={{ width:'34px', height:'34px', borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
                  <Share2 size={14} color="#fff" />
                </button>
                <button onClick={() => { onHide(listing.id); onClose() }}
                  style={{ width:'34px', height:'34px', borderRadius:'50%', background:'rgba(0,0,0,0.6)', border:'1px solid rgba(255,255,255,0.3)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', backdropFilter:'blur(8px)' }}>
                  <EyeOff size={14} color="#fff" />
                </button>
              </div>
            )}

            {/* Price overlay */}
            <div style={{ position:'absolute', bottom:'14px', left:'16px', zIndex:20, pointerEvents:'none' }}>
              <p style={{ color:'#fff', fontWeight:900, fontSize:'28px', margin:0, textShadow:'0 2px 12px rgba(0,0,0,0.7)' }}>
                {formatPrice(listing.price)}
              </p>
              <p style={{ color:'rgba(255,255,255,0.85)', fontSize:'13px', margin:0 }}>
                {listing.address} · {listing.city}, {listing.state} {listing.zip}
              </p>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div style={{ display:'flex', borderBottom:`1px solid ${c.border}`, flexShrink:0, background:c.surface, overflowX:'auto' }}>
            {tabs.map(tb => (
              <button key={tb.id} onClick={() => setTab(tb.id)}
                style={{ padding:'12px 16px', border:'none', background:'transparent', cursor:'pointer', fontSize:'13px', fontWeight:tab===tb.id ? 700 : 500, color:tab===tb.id ? t.accent : c.textMuted, borderBottom:`2px solid ${tab===tb.id ? t.accent : 'transparent'}`, whiteSpace:'nowrap', transition:'all 0.2s', flexShrink:0 }}>
                {tb.label}
              </button>
            ))}

            {/* AI Insights tab button */}
            {anyFeatureOn && (
              <button
                onClick={() => setFeaturePanelOpen(true)}
                style={{
                  padding: '10px 14px',
                  border: 'none',
                  background: 'transparent',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: t.accent,
                  borderBottom: `2px solid transparent`,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                  marginLeft: 'auto',
                  paddingRight: '16px',
                  transition: 'all 0.2s',
                  animation: 'aiTabPulse 2.5s ease-in-out infinite',
                  position: 'relative',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = `${t.accent}12`
                  e.currentTarget.style.animation = 'none'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'transparent'
                  e.currentTarget.style.animation = 'aiTabPulse 2.5s ease-in-out infinite'
                }}
              >
                <Zap size={13} style={{ filter:`drop-shadow(0 0 4px ${t.accentGlow})` }} />
                AI Insights
                {/* Animated dot */}
                <span style={{
                  width: '6px', height: '6px', borderRadius: '50%',
                  background: t.accent,
                  boxShadow: `0 0 6px ${t.accentGlow}`,
                  animation: 'aiDotBlink 1.4s ease-in-out infinite',
                  flexShrink: 0,
                }} />
              </button>
            )}
          </div>

          {/* ── Body ── */}
          <div style={{ flex:1, overflowY:'auto', padding:'20px' }}>

            {/* Details */}
            {tab === 'details' && (
              <div>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'20px' }}>
                  {[
                    { icon:Bed,       label:'Beds',   val:listing.beds },
                    { icon:Bath,      label:'Baths',  val:listing.baths },
                    { icon:Maximize2, label:'Sq Ft',  val:listing.sqft?.toLocaleString() },
                    { icon:DollarSign,label:'$/sqft', val:`$${Math.round(listing.price / listing.sqft)}` },
                  ].map(({ icon:Icon, label, val }) => (
                    <div key={label} style={{ textAlign:'center', padding:'14px 8px', borderRadius:'12px', background:c.surfaceAlt, border:`1px solid ${c.border}` }}>
                      <Icon size={18} style={{ color:t.accent, marginBottom:'6px' }} />
                      <p style={{ fontWeight:900, fontSize:'18px', color:c.text, margin:0 }}>{val}</p>
                      <p style={{ fontSize:'11px', color:c.textMuted, margin:0 }}>{label}</p>
                    </div>
                  ))}
                </div>

                <div style={{ padding:'14px', borderRadius:'12px', background:c.surfaceAlt, border:`1px solid ${c.border}`, marginBottom:'16px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                    {[
                      { label:'Status',        val:listing.status },
                      { label:'Type',          val:listing.type },
                      { label:'Year Built',    val:listing.yearBuilt || '—' },
                      { label:'Days on Market',val:listing.daysOnMarket === 0 ? 'Today' : `${listing.daysOnMarket} days` },
                      { label:'MLS #',         val:listing.mlsId || listing.id },
                      { label:'Lot Size',      val:listing.lotSize || '—' },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ display:'flex', flexDirection:'column', gap:'2px' }}>
                        <span style={{ fontSize:'10px', color:c.textFaint, textTransform:'uppercase', fontWeight:700, letterSpacing:'0.5px' }}>{label}</span>
                        <span style={{ fontSize:'13px', fontWeight:700, color:c.text }}>{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {listing.description && (
                  <div style={{ padding:'14px', borderRadius:'12px', background:c.surfaceAlt, border:`1px solid ${c.border}`, marginBottom:'16px' }}>
                    <p style={{ fontWeight:700, fontSize:'13px', color:c.text, marginBottom:'8px' }}>About This Home</p>
                    <p style={{ fontSize:'13px', color:c.textMuted, lineHeight:1.6, margin:0 }}>{listing.description}</p>
                  </div>
                )}

                {/* Thumbnail strip */}
                {photos.length > 1 && (
                  <div>
                    <p style={{ fontWeight:700, fontSize:'12px', color:c.textMuted, marginBottom:'8px', textTransform:'uppercase', letterSpacing:'1px' }}>All Photos</p>
                    <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px' }}>
                      {photos.map((ph, i) => (
                        <div key={i} style={{ flexShrink:0, textAlign:'center' }}>
                          <img src={ph.url} alt={ph.label} style={{ width:'80px', height:'56px', objectFit:'cover', borderRadius:'8px', display:'block', border:`2px solid ${t.accent}40` }} />
                          <p style={{ fontSize:'8px', color:c.textFaint, marginTop:'3px', maxWidth:'80px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{ph.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* AI Insights CTA inside details */}
                {anyFeatureOn && (
                  <div style={{ marginTop:'16px' }}>
                    <button
                      onClick={() => setFeaturePanelOpen(true)}
                      style={{ width:'100%', padding:'13px', borderRadius:'12px', border:`1.5px solid ${t.accent}`, background:t.gradient, color:'#fff', cursor:'pointer', fontSize:'14px', fontWeight:800, boxShadow:`0 4px 20px ${t.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', transition:'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.transform='scale(1.02)'; e.currentTarget.style.boxShadow=`0 8px 32px ${t.accentGlow}` }}
                      onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 4px 20px ${t.accentGlow}` }}>
                      <Zap size={16} style={{ filter:'drop-shadow(0 0 4px rgba(255,255,255,0.8))' }} />
                      Open AI Insights — 30 Analysis Tools
                    </button>
                    <p style={{ fontSize:'11px', color:c.textFaint, textAlign:'center', marginTop:'6px' }}>
                      Roast · Hidden Gem · Vibe Match · Negotiate · Climate · ESG · CMA + more
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Neighborhood */}
            {tab === 'neighborhood' && (
              <NeighborhoodPanel listing={listing} c={c} t={t} onXP={onXP} />
            )}

            {/* Mortgage */}
            {tab === 'mortgage' && (
              <div>
                <p style={{ fontWeight:800, fontSize:'15px', color:c.text, marginBottom:'16px' }}>💰 Mortgage Calculator</p>
                {[
                  { label:`Down Payment: ${downPct}%  ($${Math.round(down/1000)}k)`, val:downPct, set:setDownPct, min:3,  max:50, step:1   },
                  { label:`Interest Rate: ${rate}%`,                                  val:rate,    set:setRate,    min:2,  max:15, step:0.1 },
                  { label:`Loan Term: ${years} years`,                                val:years,   set:setYears,   min:10, max:30, step:5   },
                ].map(({ label, val, set, min, max, step }) => (
                  <div key={label} style={{ marginBottom:'14px' }}>
                    <label style={{ fontSize:'13px', fontWeight:600, color:c.text, display:'block', marginBottom:'6px' }}>{label}</label>
                    <input type="range" min={min} max={max} step={step} value={val}
                      onChange={e => set(parseFloat(e.target.value))}
                      style={{ width:'100%', accentColor:t.accent }} />
                  </div>
                ))}
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'10px', marginTop:'20px' }}>
                  {[
                    { label:'Monthly Payment', val:`$${Math.round(payment).toLocaleString()}`, color:t.accent  },
                    { label:'Total Interest',  val:`$${Math.round(interest/1000)}k`,           color:'#f59e0b' },
                    { label:'Total Cost',      val:`$${Math.round(total/1000)}k`,              color:'#ef4444' },
                  ].map(({ label, val, color }) => (
                    <div key={label} style={{ textAlign:'center', padding:'16px 8px', borderRadius:'12px', background:c.surfaceAlt, border:`1px solid ${c.border}` }}>
                      <p style={{ fontWeight:900, fontSize:'18px', color, margin:0 }}>{val}</p>
                      <p style={{ fontSize:'11px', color:c.textMuted, margin:'4px 0 0' }}>{label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize:'11px', color:c.textFaint, textAlign:'center', marginTop:'12px' }}>
                  Estimate only · Does not include taxes, insurance, or HOA
                </p>
              </div>
            )}

            {/* Contact */}
            {tab === 'contact' && (
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:'14px', padding:'16px', borderRadius:'14px', background:c.surfaceAlt, border:`1px solid ${c.border}`, marginBottom:'16px' }}>
                  <div style={{ width:'56px', height:'56px', borderRadius:'50%', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', boxShadow:`0 0 16px ${t.accentGlow}`, flexShrink:0 }}>👤</div>
                  <div>
                    <p style={{ fontWeight:800, fontSize:'15px', color:c.text, margin:0 }}>Listing Agent</p>
                    <p style={{ fontSize:'13px', color:c.textMuted, margin:'2px 0 0' }}>ZephyrAI Premier Agent</p>
                  </div>
                </div>
                {[
                  { icon:Phone,    label:'Call Agent',     sub:'+1 (701) 555-0199',  color:'#22c55e' },
                  { icon:Mail,     label:'Email Agent',    sub:'agent@zephyrai.idx', color:t.accent  },
                  { icon:Calendar, label:'Schedule Tour',  sub:'Book a showing',     color:'#7c3aed' },
                ].map(({ icon:Icon, label, sub, color }) => (
                  <button key={label}
                    onClick={() => { if (onXP) onXP('CONTACT_AGENT') }}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'14px', borderRadius:'12px', border:`1px solid ${c.border}`, background:c.surfaceAlt, cursor:'pointer', marginBottom:'8px', transition:'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.background = `${color}10` }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.background = c.surfaceAlt }}>
                    <div style={{ width:'42px', height:'42px', borderRadius:'10px', background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={18} style={{ color }} />
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <p style={{ fontWeight:700, fontSize:'14px', color:c.text, margin:0 }}>{label}</p>
                      <p style={{ fontSize:'12px', color:c.textMuted, margin:0 }}>{sub}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes aiTabPulse {
          0%,100% { opacity:1; }
          50%      { opacity:0.65; }
        }
        @keyframes aiDotBlink {
          0%,100% { opacity:1;   transform:scale(1);   }
          50%      { opacity:0.3; transform:scale(0.7); }
        }
      `}</style>
    </>
  )
}
