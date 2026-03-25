'use client'
import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import FeatureSettings from './FeatureSettings'
import { LAYOUTS } from './layouts'

export default function AccordionSection({
  section, c, t,
  colorMode, setColorMode,
  themeCategory, setThemeCategory,
  activeTheme, setActiveTheme,
  THEMES,
  onOpenAccount,
  onSaveApiCreds,
  gamificationEnabled, setGamificationEnabled,
  onOpenGamification,
  userStats,
  featureSettings, setFeatureSettings,
  onOpenHelp,
  activeLayoutId, setActiveLayoutId,
}) {
  const [open,       setOpen]       = useState(false)
  const [apiKey,     setApiKey]     = useState('')
  const [apiSecret,  setApiSecret]  = useState('')
  const [apiMode,    setApiMode]    = useState('replication')
  const [saving,     setSaving]     = useState(false)
  const [savedOk,    setSavedOk]    = useState(false)
  const [testing,    setTesting]    = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [notifs,     setNotifs]     = useState({ email:true, browser:false, priceDrops:true, newListings:true, savedUpdates:true })
  const [privacy,    setPrivacy]    = useState({ shareData:false, analytics:true, cookies:true })

  const handleSaveCreds = () => {
    if (!apiKey) return
    setSaving(true)
    setSavedOk(false)
    setTestResult(null)
    onSaveApiCreds?.({ apiKey, apiSecret, mode: apiMode })
    setTimeout(() => {
      setSaving(false)
      setSavedOk(true)
      setTimeout(() => setSavedOk(false), 4000)
    }, 800)
  }

  const handleTestConnection = async () => {
    if (!apiKey) return
    setTesting(true)
    setTestResult(null)
    try {
      const res  = await fetch('/api/spark-test', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ apiKey, apiSecret, mode: apiMode }),
      })
      const data = await res.json()
      setTestResult(data)
    } catch (err) {
      setTestResult({ success: false, message: `Network error: ${err.message}` })
    } finally {
      setTesting(false)
    }
  }

  const Toggle = ({ value, onChange, label, sub }) => (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 0', borderBottom:`1px solid ${c.border}` }}>
      <div>
        <p style={{ fontSize:'13px', fontWeight:600, color:c.text, margin:0 }}>{label}</p>
        {sub && <p style={{ fontSize:'11px', color:c.textMuted, margin:'2px 0 0' }}>{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        style={{ width:'42px', height:'24px', borderRadius:'12px', border:'none', background:value ? t.accent : c.border, cursor:'pointer', position:'relative', transition:'background 0.25s', flexShrink:0, marginLeft:'12px' }}>
        <span style={{ position:'absolute', top:'3px', left:value ? '21px' : '3px', width:'18px', height:'18px', borderRadius:'50%', background:'#fff', transition:'left 0.25s', boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  )

  return (
    <div style={{ borderRadius:'10px', overflow:'hidden', marginBottom:'4px', border:`1px solid ${open ? t.accent+'40' : 'transparent'}`, transition:'border 0.2s' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 12px', background:open ? `${t.accent}10` : 'transparent', border:'none', cursor:'pointer', transition:'background 0.2s', borderRadius:'10px' }}>
        <span style={{ fontSize:'13px', fontWeight:600, color:c.text }}>{section.label}</span>
        <ChevronDown size={14} style={{ color:c.textMuted, transform:open ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{ padding:'8px 12px 12px' }}>

          {/* ── Account ── */}
          {section.isAccount && (
            <button onClick={onOpenAccount}
              style={{ width:'100%', padding:'10px', borderRadius:'10px', border:`1px solid ${c.border}`, background:c.surfaceAlt, cursor:'pointer', fontSize:'13px', fontWeight:600, color:c.text, transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}15`; e.currentTarget.style.borderColor = t.accent }}
              onMouseLeave={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.borderColor = c.border }}>
              👤 Manage Account
            </button>
          )}

          {/* ── Notifications ── */}
          {section.isNotifications && (
            <div>
              <Toggle value={notifs.email}        onChange={v => setNotifs(p=>({...p,email:v}))}        label="Email Alerts"       sub="Listing updates via email" />
              <Toggle value={notifs.browser}      onChange={v => setNotifs(p=>({...p,browser:v}))}      label="Browser Push"       sub="Real-time notifications" />
              <Toggle value={notifs.priceDrops}   onChange={v => setNotifs(p=>({...p,priceDrops:v}))}   label="Price Drops"        sub="Alert when prices fall" />
              <Toggle value={notifs.newListings}  onChange={v => setNotifs(p=>({...p,newListings:v}))}  label="New Listings"       sub="Matching your searches" />
              <Toggle value={notifs.savedUpdates} onChange={v => setNotifs(p=>({...p,savedUpdates:v}))} label="Saved Home Updates" sub="Status changes on saved homes" />
            </div>
          )}

          {/* ── Appearance ── */}
          {section.isAppearance && (
            <div>
              {/* Color Mode */}
              <p style={{ fontSize:'11px', color:c.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>Color Mode</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'6px', marginBottom:'18px' }}>
                {[['light','☀️ Light'],['mellow','🌆 Mellow'],['dark','🌑 Dark']].map(([id,label]) => (
                  <button key={id} onClick={() => setColorMode(id)}
                    style={{ padding:'8px 4px', borderRadius:'8px', border:`1px solid ${colorMode===id ? t.accent : c.border}`, background:colorMode===id ? `${t.accent}20` : 'transparent', color:colorMode===id ? t.accent : c.text, cursor:'pointer', fontSize:'11px', fontWeight:600, transition:'all 0.2s' }}>
                    {label}
                  </button>
                ))}
              </div>

              {/* Site Layout */}
              <p style={{ fontSize:'11px', color:c.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>Site Layout</p>
              <div style={{ display:'flex', flexDirection:'column', gap:'6px', marginBottom:'18px' }}>
                {(LAYOUTS || []).map(layout => {
                  const isActive = (activeLayoutId || 'default') === layout.id
                  return (
                    <button key={layout.id} onClick={() => setActiveLayoutId?.(layout.id)}
                      style={{ display:'flex', alignItems:'center', gap:'10px', padding:'10px 12px', borderRadius:'10px', border:`1px solid ${isActive ? t.accent : c.border}`, background:isActive ? `${t.accent}12` : 'transparent', cursor:'pointer', transition:'all 0.2s', textAlign:'left', width:'100%' }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.borderColor = `${t.accent}40` } }}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = c.border } }}>
                      <div style={{ width:'36px', height:'36px', borderRadius:'8px', background:layout.preview, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'inset 0 0 0 1px rgba(255,255,255,0.1)' }}>
                        <span style={{ filter:'drop-shadow(0 1px 2px rgba(0,0,0,0.5))', fontSize:'14px' }}>{layout.icon}</span>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <p style={{ fontWeight:700, fontSize:'12px', color:isActive ? t.accent : c.text, margin:0 }}>{layout.name}</p>
                        <p style={{ fontSize:'10px', color:c.textMuted, margin:'1px 0 0', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{layout.description}</p>
                      </div>
                      {isActive && (
                        <div style={{ width:'18px', height:'18px', borderRadius:'50%', background:t.accent, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                          <span style={{ color:'#fff', fontSize:'10px', fontWeight:900 }}>✓</span>
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Theme Category */}
              <p style={{ fontSize:'11px', color:c.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>Theme Category</p>
              <div style={{ display:'flex', gap:'6px', flexWrap:'wrap', marginBottom:'12px' }}>
                {Object.keys(THEMES).map(cat => (
                  <button key={cat} onClick={() => { setThemeCategory(cat); setActiveTheme(THEMES[cat].variants[0]) }}
                    style={{ padding:'5px 10px', borderRadius:'20px', border:`1px solid ${themeCategory===cat ? t.accent : c.border}`, background:themeCategory===cat ? `${t.accent}20` : 'transparent', color:themeCategory===cat ? t.accent : c.textMuted, cursor:'pointer', fontSize:'11px', fontWeight:600, transition:'all 0.2s', textTransform:'capitalize' }}>
                    {cat}
                  </button>
                ))}
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'8px' }}>
                {THEMES[themeCategory]?.variants.map(variant => (
                  <button key={variant.name} onClick={() => setActiveTheme(variant)} title={variant.name}
                    style={{ aspectRatio:'1', borderRadius:'10px', border:`2px solid ${activeTheme?.name===variant.name ? '#fff' : 'transparent'}`, background:variant.gradient, cursor:'pointer', boxShadow:activeTheme?.name===variant.name ? `0 0 16px ${variant.accentGlow}` : 'none', transition:'all 0.2s', position:'relative', overflow:'hidden' }}>
                    {activeTheme?.name===variant.name && (
                      <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.2)' }}>
                        <Check size={14} color="#fff" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              {activeTheme && <p style={{ fontSize:'11px', color:t.accent, textAlign:'center', marginTop:'8px', fontWeight:600 }}>{activeTheme.name}</p>}
            </div>
          )}

          {/* ── Gamification ── */}
          {section.isGamification && (
            <div>
              <Toggle
                value={gamificationEnabled}
                onChange={setGamificationEnabled}
                label="Enable Gamification"
                sub="Earn XP, unlock achievements, level up"
              />
              {gamificationEnabled && (
                <div style={{ marginTop:'12px', padding:'12px', borderRadius:'10px', background:c.surfaceAlt, border:`1px solid ${c.border}` }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'8px' }}>
                    <p style={{ fontSize:'13px', fontWeight:700, color:c.text, margin:0 }}>
                      {userStats?.totalXP || 0} XP earned
                    </p>
                    <span style={{ fontSize:'20px' }}>⚡</span>
                  </div>
                  <div style={{ height:'6px', background:c.border, borderRadius:'6px', overflow:'hidden', marginBottom:'8px' }}>
                    <div style={{ height:'100%', width:'40%', background:t.gradient, borderRadius:'6px' }} />
                  </div>
                  <button onClick={() => onOpenGamification?.()}
                    style={{ width:'100%', padding:'8px', borderRadius:'8px', border:`1px solid ${t.accent}50`, background:`${t.accent}15`, color:t.accent, cursor:'pointer', fontSize:'12px', fontWeight:700 }}>
                    🏆 View Full Progress
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── AI Features ── */}
          {section.isAIFeatures && (
            <FeatureSettings
              c={c} t={t}
              featureSettings={featureSettings}
              setFeatureSettings={setFeatureSettings}
            />
          )}

          {/* ── Help & Tour ── */}
          {section.isHelp && (
            <div>
              <p style={{ fontSize:'12px', color:c.textMuted, marginBottom:'12px', lineHeight:1.6 }}>
                New to ZephyrAI? The interactive tour walks you through every feature step by step.
              </p>
              <button onClick={() => onOpenHelp?.()}
                style={{ width:'100%', padding:'12px', borderRadius:'10px', border:`1px solid ${t.accent}50`, background:`${t.accent}15`, color:t.accent, cursor:'pointer', fontSize:'13px', fontWeight:700, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px', marginBottom:'8px', transition:'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}25` }}
                onMouseLeave={e => { e.currentTarget.style.background = `${t.accent}15` }}>
                🎓 Launch Interactive Tour
              </button>
              <div style={{ padding:'10px 12px', borderRadius:'10px', background:c.surfaceAlt, border:`1px solid ${c.border}` }}>
                {[
                  ['🔍', 'Search & Filters'],
                  ['⚡', '30 AI Features'],
                  ['🗺️', '8 Map Layers'],
                  ['📊', 'Neighborhood Data'],
                  ['🎮', 'Gamification'],
                  ['⚙️', 'All Settings'],
                ].map(([icon, label]) => (
                  <div key={label} style={{ display:'flex', alignItems:'center', gap:'8px', padding:'5px 0', borderBottom:`1px solid ${c.border}` }}>
                    <span style={{ fontSize:'14px' }}>{icon}</span>
                    <span style={{ fontSize:'12px', color:c.textMuted }}>{label}</span>
                    <span style={{ marginLeft:'auto', fontSize:'11px', color:t.accent, fontWeight:600 }}>Covered ✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Integrations (Spark API) ── */}
          {section.isIntegrations && (
            <div>
              <p style={{ fontSize:'12px', color:c.textMuted, marginBottom:'12px', lineHeight:1.5 }}>
                Connect your Spark API (FBS) credentials to pull live MLS listings directly into ZephyrAI IDX.
              </p>

              {/* Mode selector */}
              <p style={{ fontSize:'11px', color:c.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>Connection Mode</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'6px', marginBottom:'14px' }}>
                {[
                  { id:'replication', label:'🔄 Replication', desc:'Synced data feed' },
                  { id:'live',        label:'⚡ Live',         desc:'Real-time API'   },
                ].map(m => (
                  <button key={m.id} onClick={() => setApiMode(m.id)}
                    style={{ padding:'10px 8px', borderRadius:'8px', border:`1px solid ${apiMode===m.id ? t.accent : c.border}`, background:apiMode===m.id ? `${t.accent}15` : 'transparent', cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
                    <p style={{ fontSize:'12px', fontWeight:700, color:apiMode===m.id ? t.accent : c.text, margin:0 }}>{m.label}</p>
                    <p style={{ fontSize:'10px', color:c.textMuted, margin:0 }}>{m.desc}</p>
                  </button>
                ))}
              </div>

              {/* Credentials */}
              <p style={{ fontSize:'11px', color:c.textMuted, fontWeight:700, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px' }}>API Credentials</p>
              {[
                ['API Key',    apiKey,    setApiKey,    'text',     'Enter your Spark API key'],
                ['API Secret', apiSecret, setApiSecret, 'password', 'Enter your API secret'],
              ].map(([label, val, setter, type, ph]) => (
                <div key={label} style={{ marginBottom:'10px' }}>
                  <label style={{ fontSize:'11px', color:c.textMuted, fontWeight:600, display:'block', marginBottom:'4px', textTransform:'uppercase' }}>{label}</label>
                  <input
                    type={type}
                    value={val}
                    onChange={e => setter(e.target.value)}
                    placeholder={ph}
                    style={{ width:'100%', padding:'9px 10px', border:`1px solid ${c.border}`, borderRadius:'8px', fontSize:'12px', background:c.inputBg, color:c.text, outline:'none', boxSizing:'border-box', fontFamily:'monospace' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e  => e.target.style.borderColor = c.border}
                  />
                </div>
              ))}

              {/* Test connection button */}
              <button
                onClick={handleTestConnection}
                disabled={testing || !apiKey}
                style={{ width:'100%', padding:'9px', borderRadius:'8px', border:`1px solid ${c.border}`, background:c.surfaceAlt, cursor:!apiKey ? 'not-allowed' : 'pointer', fontSize:'12px', fontWeight:600, color:c.text, marginBottom:'8px', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', transition:'all 0.2s', opacity:!apiKey ? 0.5 : 1 }}
                onMouseEnter={e => { if (apiKey) e.currentTarget.style.borderColor = t.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border }}>
                {testing ? '⏳ Testing connection…' : '🔌 Test Connection'}
              </button>

              {/* Test result */}
              {testResult && (
                <div style={{ padding:'10px 12px', borderRadius:'8px', marginBottom:'8px', background:testResult.success ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border:`1px solid ${testResult.success ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}` }}>
                  <p style={{ fontSize:'12px', fontWeight:600, color:testResult.success ? '#22c55e' : '#ef4444', margin:0 }}>
                    {testResult.message}
                  </p>
                  {testResult.success && testResult.resultCount !== undefined && (
                    <p style={{ fontSize:'11px', color:c.textMuted, margin:'3px 0 0' }}>
                      Returned {testResult.resultCount} sample listing{testResult.resultCount !== 1 ? 's' : ''}
                      {testResult.sampleCity ? ` from ${testResult.sampleCity}` : ''}
                    </p>
                  )}
                </div>
              )}

              {/* Connect & Load button */}
              <button
                onClick={handleSaveCreds}
                disabled={saving || !apiKey}
                style={{ width:'100%', padding:'10px', borderRadius:'8px', border:'none', background:savedOk ? '#16a34a' : !apiKey ? c.border : t.gradient, color:'#fff', cursor:!apiKey ? 'not-allowed' : 'pointer', fontSize:'13px', fontWeight:700, transition:'all 0.3s', display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', opacity:!apiKey ? 0.5 : 1 }}>
                {saving ? '⏳ Connecting…' : savedOk ? '✅ Connected — Listings Loading!' : '🚀 Connect & Load Listings'}
              </button>

              {savedOk && (
                <div style={{ marginTop:'10px', padding:'10px 12px', borderRadius:'8px', background:'rgba(34,197,94,0.08)', border:'1px solid rgba(34,197,94,0.25)' }}>
                  <p style={{ fontSize:'11px', color:'#22c55e', fontWeight:600, margin:0 }}>
                    ✅ Spark {apiMode === 'live' ? 'Live' : 'Replication'} API connected. Listings are being fetched from your MLS feed.
                  </p>
                </div>
              )}

              {/* Help */}
              <div style={{ marginTop:'14px', padding:'10px 12px', borderRadius:'8px', background:c.surfaceAlt, border:`1px solid ${c.border}` }}>
                <p style={{ fontSize:'11px', fontWeight:700, color:c.text, marginBottom:'6px' }}>Need help?</p>
                <p style={{ fontSize:'10px', color:c.textMuted, margin:'0 0 3px' }}>
                  • API keys found at <span style={{ color:t.accent }}>sparkplatform.com/developers</span>
                </p>
                <p style={{ fontSize:'10px', color:c.textMuted, margin:'0 0 3px' }}>
                  • Use <strong>Replication</strong> mode for RETS / data feed access
                </p>
                <p style={{ fontSize:'10px', color:c.textMuted, margin:'0 0 3px' }}>
                  • Use <strong>Live</strong> mode for real-time Hybrid API access
                </p>
                <p style={{ fontSize:'10px', color:c.textMuted, margin:0 }}>
                  • Your key must have <strong>Listings</strong> read permission enabled
                </p>
              </div>
            </div>
          )}

          {/* ── Privacy ── */}
          {section.isPrivacy && (
            <div>
              <Toggle value={privacy.analytics} onChange={v => setPrivacy(p=>({...p,analytics:v}))} label="Analytics"    sub="Help us improve ZephyrAI" />
              <Toggle value={privacy.cookies}   onChange={v => setPrivacy(p=>({...p,cookies:v}))}   label="Preferences"  sub="Remember your settings" />
              <Toggle value={privacy.shareData} onChange={v => setPrivacy(p=>({...p,shareData:v}))} label="Share Data"   sub="Share anonymized usage data" />
              <button style={{ marginTop:'10px', width:'100%', padding:'9px', borderRadius:'8px', border:'1px solid rgba(239,68,68,0.4)', background:'rgba(239,68,68,0.1)', color:'#ef4444', cursor:'pointer', fontSize:'12px', fontWeight:700 }}>
                🗑️ Delete My Account Data
              </button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
