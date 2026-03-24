'use client'
import { useState } from 'react'
import { ChevronDown, Check } from 'lucide-react'
import FeatureSettings from './FeatureSettings'

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
}) {
  const [open,      setOpen]      = useState(false)
  const [apiKey,    setApiKey]    = useState('')
  const [apiSecret, setApiSecret] = useState('')
  const [apiMode,   setApiMode]   = useState('replication')
  const [saving,    setSaving]    = useState(false)
  const [savedOk,   setSavedOk]   = useState(false)
  const [notifs,    setNotifs]    = useState({ email:true,browser:false,priceDrops:true,newListings:true,savedUpdates:true })
  const [privacy,   setPrivacy]   = useState({ shareData:false,analytics:true,cookies:true })

  const handleSaveCreds = () => {
    if (!apiKey||!apiSecret) return
    setSaving(true)
    setTimeout(()=>{ setSaving(false); setSavedOk(true); onSaveApiCreds?.({apiKey,apiSecret,mode:apiMode}); setTimeout(()=>setSavedOk(false),2000) },1200)
  }

  const Toggle = ({ value, onChange, label, sub }) => (
    <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',padding:'9px 0',borderBottom:`1px solid ${c.border}` }}>
      <div>
        <p style={{ fontSize:'13px',fontWeight:600,color:c.text,margin:0 }}>{label}</p>
        {sub&&<p style={{ fontSize:'11px',color:c.textMuted,margin:'2px 0 0' }}>{sub}</p>}
      </div>
      <button onClick={()=>onChange(!value)} style={{ width:'42px',height:'24px',borderRadius:'12px',border:'none',background:value?t.accent:c.border,cursor:'pointer',position:'relative',transition:'background 0.25s',flexShrink:0,marginLeft:'12px' }}>
        <span style={{ position:'absolute',top:'3px',left:value?'21px':'3px',width:'18px',height:'18px',borderRadius:'50%',background:'#fff',transition:'left 0.25s',boxShadow:'0 1px 4px rgba(0,0,0,0.3)' }} />
      </button>
    </div>
  )

  return (
    <div style={{ borderRadius:'10px',overflow:'hidden',marginBottom:'4px',border:`1px solid ${open?t.accent+'40':'transparent'}`,transition:'border 0.2s' }}>
      <button onClick={()=>setOpen(!open)} style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'10px 12px',background:open?`${t.accent}10`:'transparent',border:'none',cursor:'pointer',transition:'background 0.2s',borderRadius:'10px' }}>
        <span style={{ fontSize:'13px',fontWeight:600,color:c.text }}>{section.label}</span>
        <ChevronDown size={14} style={{ color:c.textMuted,transform:open?'rotate(180deg)':'none',transition:'transform 0.2s' }} />
      </button>

      {open&&(
        <div style={{ padding:'8px 12px 12px' }}>

          {section.isAccount&&(
            <button onClick={onOpenAccount} style={{ width:'100%',padding:'10px',borderRadius:'10px',border:`1px solid ${c.border}`,background:c.surfaceAlt,cursor:'pointer',fontSize:'13px',fontWeight:600,color:c.text,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px' }}
              onMouseEnter={e=>{e.currentTarget.style.background=`${t.accent}15`;e.currentTarget.style.borderColor=t.accent}}
              onMouseLeave={e=>{e.currentTarget.style.background=c.surfaceAlt;e.currentTarget.style.borderColor=c.border}}>
              👤 Manage Account
            </button>
          )}

          {section.isNotifications&&(
            <div>
              <Toggle value={notifs.email}        onChange={v=>setNotifs(p=>({...p,email:v}))}        label="Email Alerts"       sub="Listing updates via email" />
              <Toggle value={notifs.browser}      onChange={v=>setNotifs(p=>({...p,browser:v}))}      label="Browser Push"       sub="Real-time notifications" />
              <Toggle value={notifs.priceDrops}   onChange={v=>setNotifs(p=>({...p,priceDrops:v}))}   label="Price Drops"        sub="Alert when prices fall" />
              <Toggle value={notifs.newListings}  onChange={v=>setNotifs(p=>({...p,newListings:v}))}  label="New Listings"       sub="Matching your searches" />
              <Toggle value={notifs.savedUpdates} onChange={v=>setNotifs(p=>({...p,savedUpdates:v}))} label="Saved Home Updates" sub="Status changes on saved homes" />
            </div>
          )}

          {section.isAppearance&&(
            <div>
              <p style={{ fontSize:'11px',color:c.textMuted,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px' }}>Color Mode</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'6px',marginBottom:'14px' }}>
                {[['light','☀️ Light'],['mellow','🌆 Mellow'],['dark','🌑 Dark']].map(([id,label])=>(
                  <button key={id} onClick={()=>setColorMode(id)} style={{ padding:'8px 4px',borderRadius:'8px',border:`1px solid ${colorMode===id?t.accent:c.border}`,background:colorMode===id?`${t.accent}20`:'transparent',color:colorMode===id?t.accent:c.text,cursor:'pointer',fontSize:'11px',fontWeight:600 }}>{label}</button>
                ))}
              </div>
              <p style={{ fontSize:'11px',color:c.textMuted,fontWeight:700,textTransform:'uppercase',letterSpacing:'1px',marginBottom:'8px' }}>Theme Category</p>
              <div style={{ display:'flex',gap:'6px',flexWrap:'wrap',marginBottom:'12px' }}>
                {Object.keys(THEMES).map(cat=>(
                  <button key={cat} onClick={()=>{setThemeCategory(cat);setActiveTheme(THEMES[cat].variants[0])}} style={{ padding:'5px 10px',borderRadius:'20px',border:`1px solid ${themeCategory===cat?t.accent:c.border}`,background:themeCategory===cat?`${t.accent}20`:'transparent',color:themeCategory===cat?t.accent:c.textMuted,cursor:'pointer',fontSize:'11px',fontWeight:600,textTransform:'capitalize' }}>{cat}</button>
                ))}
              </div>
              <div style={{ display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px' }}>
                {THEMES[themeCategory]?.variants.map(variant=>(
                  <button key={variant.name} onClick={()=>setActiveTheme(variant)} title={variant.name} style={{ aspectRatio:'1',borderRadius:'10px',border:`2px solid ${activeTheme?.name===variant.name?'#fff':'transparent'}`,background:variant.gradient,cursor:'pointer',boxShadow:activeTheme?.name===variant.name?`0 0 16px ${variant.accentGlow}`:'none',position:'relative',overflow:'hidden' }}>
                    {activeTheme?.name===variant.name&&<div style={{ position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center',background:'rgba(0,0,0,0.2)' }}><Check size={14} color="#fff" /></div>}
                  </button>
                ))}
              </div>
              {activeTheme&&<p style={{ fontSize:'11px',color:t.accent,textAlign:'center',marginTop:'8px',fontWeight:600 }}>{activeTheme.name}</p>}
            </div>
          )}

          {section.isGamification&&(
            <div>
              <Toggle value={gamificationEnabled} onChange={setGamificationEnabled} label="Enable Gamification" sub="Earn XP, unlock achievements, level up" />
              {gamificationEnabled&&(
                <div style={{ marginTop:'12px',padding:'12px',borderRadius:'10px',background:c.surfaceAlt,border:`1px solid ${c.border}` }}>
                  <div style={{ display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'8px' }}>
                    <p style={{ fontSize:'13px',fontWeight:700,color:c.text,margin:0 }}>{userStats?.totalXP||0} XP earned</p>
                    <span style={{ fontSize:'20px' }}>⚡</span>
                  </div>
                  <div style={{ height:'6px',background:c.border,borderRadius:'6px',overflow:'hidden',marginBottom:'8px' }}>
                    <div style={{ height:'100%',width:'40%',background:t.gradient,borderRadius:'6px' }} />
                  </div>
                  <button onClick={()=>onOpenGamification?.()} style={{ width:'100%',padding:'8px',borderRadius:'8px',border:`1px solid ${t.accent}50`,background:`${t.accent}15`,color:t.accent,cursor:'pointer',fontSize:'12px',fontWeight:700 }}>🏆 View Full Progress</button>
                </div>
              )}
            </div>
          )}

          {/* ── AI FEATURES ── */}
          {section.isAIFeatures&&(
            <FeatureSettings c={c} t={t} featureSettings={featureSettings} setFeatureSettings={setFeatureSettings} />
          )}

          {section.isIntegrations&&(
            <div>
              <p style={{ fontSize:'12px',color:c.textMuted,marginBottom:'12px' }}>Connect SparkAPI credentials to pull live MLS data.</p>
              <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr',gap:'6px',marginBottom:'10px' }}>
                {['replication','live'].map(mode=>(
                  <button key={mode} onClick={()=>setApiMode(mode)} style={{ padding:'8px',borderRadius:'8px',border:`1px solid ${apiMode===mode?t.accent:c.border}`,background:apiMode===mode?`${t.accent}20`:'transparent',color:apiMode===mode?t.accent:c.textMuted,cursor:'pointer',fontSize:'12px',fontWeight:600,textTransform:'capitalize' }}>{mode}</button>
                ))}
              </div>
              {[['API Key',apiKey,setApiKey,'sk-...'],['API Secret',apiSecret,setApiSecret,'••••••••']].map(([label,val,setter,ph])=>(
                <div key={label} style={{ marginBottom:'8px' }}>
                  <label style={{ fontSize:'11px',color:c.textMuted,fontWeight:600,display:'block',marginBottom:'4px',textTransform:'uppercase' }}>{label}</label>
                  <input type={label==='API Secret'?'password':'text'} value={val} onChange={e=>setter(e.target.value)} placeholder={ph} style={{ width:'100%',padding:'9px 10px',border:`1px solid ${c.border}`,borderRadius:'8px',fontSize:'12px',background:c.inputBg,color:c.text,outline:'none',boxSizing:'border-box' }} onFocus={e=>e.target.style.borderColor=t.accent} onBlur={e=>e.target.style.borderColor=c.border} />
                </div>
              ))}
              <button onClick={handleSaveCreds} disabled={saving||!apiKey||!apiSecret} style={{ width:'100%',padding:'10px',borderRadius:'8px',border:'none',background:savedOk?'#16a34a':(!apiKey||!apiSecret)?c.border:t.gradient,color:'#fff',cursor:!apiKey||!apiSecret?'not-allowed':'pointer',fontSize:'13px',fontWeight:700,display:'flex',alignItems:'center',justifyContent:'center',gap:'6px' }}>
                {saving?'⏳ Connecting…':savedOk?'✅ Connected!':'🔌 Connect SparkAPI'}
              </button>
            </div>
          )}

          {section.isPrivacy&&(
            <div>
              <Toggle value={privacy.analytics} onChange={v=>setPrivacy(p=>({...p,analytics:v}))} label="Analytics"   sub="Help us improve ZephyrAI" />
              <Toggle value={privacy.cookies}   onChange={v=>setPrivacy(p=>({...p,cookies:v}))}   label="Preferences" sub="Remember your settings" />
              <Toggle value={privacy.shareData} onChange={v=>setPrivacy(p=>({...p,shareData:v}))} label="Share Data"  sub="Share anonymized usage data" />
              <button style={{ marginTop:'10px',width:'100%',padding:'9px',borderRadius:'8px',border:'1px solid rgba(239,68,68,0.4)',background:'rgba(239,68,68,0.1)',color:'#ef4444',cursor:'pointer',fontSize:'12px',fontWeight:700 }}>🗑️ Delete My Account Data</button>
            </div>
          )}

        </div>
      )}
    </div>
  )
}
