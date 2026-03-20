'use client'

import { useState } from 'react'
import {
  ChevronRight, Check, Trees, PawPrint, Building2,
  User, Bell, Palette, Plug, Shield,
  Eye, EyeOff, Wifi, WifiOff, Loader,
  CheckCircle2, XCircle, Save, TestTube2,
  Sun, Moon, Sunset
} from 'lucide-react'

const CATEGORY_ICONS = { nature: Trees, animal: PawPrint, realestate: Building2 }

const SECTION_ICONS = {
  '👤 Account': User,
  '🔔 Notifications': Bell,
  '🎨 Appearance': Palette,
  '🔌 Integrations': Plug,
  '🔒 Privacy': Shield,
}

export default function AccordionSection({
  section, c, t,
  themeCategory, setThemeCategory,
  activeTheme, setActiveTheme,
  THEMES,
  colorMode, setColorMode,
  onOpenAccount,
}) {
  const [open, setOpen] = useState(false)
  const IconComp = SECTION_ICONS[section.label] || ChevronRight

  return (
    <div style={{ marginBottom: '2px' }}>
      <button
        onClick={() => {
          if (section.isAccount) { onOpenAccount(); return }
          setOpen(!open)
        }}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', padding: '10px 12px',
          borderRadius: '8px', border: 'none',
          background: open ? c.surfaceAlt : 'transparent',
          cursor: 'pointer', fontSize: '13px', color: c.text,
          fontWeight: 600, transition: 'background 0.15s',
        }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = c.surfaceAlt }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: open ? `${t.accent}20` : c.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <IconComp size={13} style={{ color: open ? t.accent : c.textMuted }} />
          </div>
          {section.label}
        </div>
        {!section.isAccount && (
          <ChevronRight size={14} style={{ color: c.textFaint, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
        )}
        {section.isAccount && (
          <ChevronRight size={14} style={{ color: c.textFaint }} />
        )}
      </button>

      {open && !section.isAccount && (
        <div style={{ paddingLeft: '8px', paddingBottom: '8px', paddingRight: '4px' }}>

          {/* ── NOTIFICATIONS ── */}
          {section.isNotifications && <NotificationsPanel c={c} t={t} />}

          {/* ── APPEARANCE ── */}
          {section.isAppearance && (
            <AppearancePanel
              c={c} t={t}
              colorMode={colorMode} setColorMode={setColorMode}
              themeCategory={themeCategory} setThemeCategory={setThemeCategory}
              activeTheme={activeTheme} setActiveTheme={setActiveTheme}
              THEMES={THEMES}
            />
          )}

          {/* ── INTEGRATIONS ── */}
          {section.isIntegrations && <IntegrationsPanel c={c} t={t} />}

          {/* ── PRIVACY ── */}
          {section.isPrivacy && <PrivacyPanel c={c} t={t} />}

        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// NOTIFICATIONS PANEL
// ─────────────────────────────────────────────
function NotificationsPanel({ c, t }) {
  const [settings, setSettings] = useState({
    newListings: true,
    priceDrops: true,
    savedAlerts: false,
    openHouses: true,
    marketUpdates: false,
    emailDigest: true,
  })
  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  const items = [
    { key: 'newListings', label: 'New Listings', sub: 'Matching your saved searches' },
    { key: 'priceDrops', label: 'Price Drops', sub: 'On homes you saved' },
    { key: 'savedAlerts', label: 'Saved Home Alerts', sub: 'Activity on saved homes' },
    { key: 'openHouses', label: 'Open Houses', sub: 'Nearby open house events' },
    { key: 'marketUpdates', label: 'Market Updates', sub: 'Weekly area reports' },
    { key: 'emailDigest', label: 'Email Digest', sub: 'Daily summary email' },
  ]
  return (
    <div style={{ padding: '4px 4px' }}>
      {items.map(item => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 8px', borderRadius: '8px', marginBottom: '2px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: c.text, margin: 0 }}>{item.label}</p>
            <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{item.sub}</p>
          </div>
          <Toggle on={settings[item.key]} onChange={() => toggle(item.key)} accent={t.accent} />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// APPEARANCE PANEL
// ─────────────────────────────────────────────
function AppearancePanel({ c, t, colorMode, setColorMode, themeCategory, setThemeCategory, activeTheme, setActiveTheme, THEMES }) {
  const modes = [
    { id: 'light', label: 'Light', icon: Sun },
    { id: 'mellow', label: 'Mellow', icon: Sunset },
    { id: 'dark', label: 'Dark', icon: Moon },
  ]
  return (
    <div style={{ padding: '4px 4px' }}>

      {/* Color Mode */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '4px' }}>Color Mode</p>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {modes.map(({ id, label, icon: Icon }) => {
          const isActive = colorMode === id
          return (
            <button key={id} onClick={() => setColorMode(id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', borderRadius: '10px', border: `1px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${t.accent}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s', color: isActive ? t.accent : c.textMuted }}>
              <Icon size={15} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{label}</span>
            </button>
          )
        })}
      </div>

      {/* Theme Category */}
      <p style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px', paddingLeft: '4px' }}>Theme</p>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '10px' }}>
        {Object.entries(THEMES).map(([key, cat]) => {
          const Icon = CATEGORY_ICONS[key] || Building2
          const isActive = themeCategory === key
          return (
            <button key={key} onClick={() => setThemeCategory(key)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '7px 4px', borderRadius: '8px', border: `1px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${t.accent}15` : 'transparent', cursor: 'pointer', color: isActive ? t.accent : c.textMuted, fontSize: '10px', fontWeight: 600, transition: 'all 0.15s' }}>
              <Icon size={13} />
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* Theme Variants */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {THEMES[themeCategory].variants.map(variant => {
          const isActive = activeTheme.id === variant.id
          return (
            <button key={variant.id} onClick={() => setActiveTheme(variant)}
              style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', border: `1px solid ${isActive ? variant.accent : c.border}`, background: isActive ? `${variant.accent}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ width: '48px', height: '32px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                <img src={variant.image} alt={variant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: variant.gradient, opacity: 0.6 }} />
              </div>
              <div style={{ textAlign: 'left', flex: 1 }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: c.text, margin: 0 }}>{variant.name}</p>
                <div style={{ display: 'flex', gap: '3px', marginTop: '3px' }}>
                  {[variant.accent, variant.accentLight].map((clr, i) => (
                    <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: clr, border: `1px solid ${c.border}` }} />
                  ))}
                </div>
              </div>
              {isActive && (
                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: variant.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={10} color="#fff" />
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────
// INTEGRATIONS PANEL
// ─────────────────────────────────────────────
function IntegrationsPanel({ c, t }) {
  const [apiMode, setApiMode] = useState('replication')
  const [creds, setCreds] = useState({ key: '', secret: '', endpoint: '' })
  const [showSecret, setShowSecret] = useState(false)
  const [testStatus, setTestStatus] = useState(null) // null | 'testing' | 'success' | 'error'
  const [saved, setSaved] = useState(false)

  const endpoints = {
    live: 'https://api.sparkapi.com',
    replication: 'https://replication.sparkapi.com',
  }

  const handleModeChange = (mode) => {
    setApiMode(mode)
    setCreds(prev => ({ ...prev, endpoint: endpoints[mode] }))
    setTestStatus(null)
    setSaved(false)
  }

  const handleTest = () => {
    if (!creds.key || !creds.secret) {
      setTestStatus('error')
      return
    }
    setTestStatus('testing')
    setTimeout(() => {
      const looks_valid = creds.key.length > 8 && creds.secret.length > 8
      setTestStatus(looks_valid ? 'success' : 'error')
    }, 1800)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${c.border}`, borderRadius: '8px',
    fontSize: '12px', background: c.inputBg,
    color: c.text, outline: 'none', boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: '11px', fontWeight: 700, color: c.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.6px',
    display: 'block', marginBottom: '5px',
  }

  return (
    <div style={{ padding: '4px 4px' }}>

      {/* SparkAPI Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '14px' }}>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Plug size={15} color="#fff" />
        </div>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 700, color: c.text, margin: 0 }}>SparkAPI by FBS</p>
          <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>MLS Data Connection</p>
        </div>
        {testStatus === 'success' && (
          <CheckCircle2 size={16} style={{ color: '#22c55e', marginLeft: 'auto', flexShrink: 0 }} />
        )}
        {testStatus === 'error' && (
          <XCircle size={16} style={{ color: '#ef4444', marginLeft: 'auto', flexShrink: 0 }} />
        )}
      </div>

      {/* Data Source Toggle */}
      <p style={labelStyle}>Data Source</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '14px' }}>
        {[
          { id: 'live', label: 'Live Data', sub: 'Direct MLS feed', icon: Wifi },
          { id: 'replication', label: 'Replication', sub: 'Synced copy', icon: WifiOff },
        ].map(({ id, label, sub, icon: Icon }) => {
          const isActive = apiMode === id
          return (
            <button key={id} onClick={() => handleModeChange(id)}
              style={{ padding: '10px', borderRadius: '10px', border: `2px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${t.accent}15` : 'transparent', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s' }}>
              <Icon size={14} style={{ color: isActive ? t.accent : c.textMuted, marginBottom: '4px' }} />
              <p style={{ fontSize: '12px', fontWeight: 700, color: isActive ? t.accent : c.text, margin: 0 }}>{label}</p>
              <p style={{ fontSize: '10px', color: c.textMuted, margin: 0 }}>{sub}</p>
            </button>
          )
        })}
      </div>

      {/* Endpoint (auto-filled, editable) */}
      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>Endpoint URL</label>
        <input
          type="text"
          value={creds.endpoint || endpoints[apiMode]}
          onChange={e => setCreds(prev => ({ ...prev, endpoint: e.target.value }))}
          placeholder={endpoints[apiMode]}
          style={inputStyle}
        />
      </div>

      {/* API Key */}
      <div style={{ marginBottom: '10px' }}>
        <label style={labelStyle}>API Key</label>
        <input
          type="text"
          value={creds.key}
          onChange={e => { setCreds(prev => ({ ...prev, key: e.target.value })); setTestStatus(null) }}
          placeholder="20e0c88d-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
          style={inputStyle}
        />
      </div>

      {/* API Secret */}
      <div style={{ marginBottom: '14px' }}>
        <label style={labelStyle}>API Secret</label>
        <div style={{ position: 'relative' }}>
          <input
            type={showSecret ? 'text' : 'password'}
            value={creds.secret}
            onChange={e => { setCreds(prev => ({ ...prev, secret: e.target.value })); setTestStatus(null) }}
            placeholder="Your SparkAPI secret"
            style={{ ...inputStyle, paddingRight: '36px' }}
          />
          <button onClick={() => setShowSecret(!showSecret)}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted, display: 'flex', alignItems: 'center' }}>
            {showSecret ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>
      </div>

      {/* Test + Save Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
        <button onClick={handleTest} disabled={testStatus === 'testing'}
          style={{ padding: '9px', borderRadius: '8px', border: `1px solid ${testStatus === 'success' ? '#22c55e' : testStatus === 'error' ? '#ef4444' : c.border}`, background: testStatus === 'success' ? 'rgba(34,197,94,0.1)' : testStatus === 'error' ? 'rgba(239,68,68,0.1)' : c.surfaceAlt, cursor: testStatus === 'testing' ? 'wait' : 'pointer', fontSize: '12px', fontWeight: 700, color: testStatus === 'success' ? '#22c55e' : testStatus === 'error' ? '#ef4444' : c.text, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', transition: 'all 0.2s' }}>
          {testStatus === 'testing' ? (
            <><Loader size={13} style={{ animation: 'spin 1s linear infinite' }} /> Testing...</>
          ) : testStatus === 'success' ? (
            <><CheckCircle2 size={13} /> Connected</>
          ) : testStatus === 'error' ? (
            <><XCircle size={13} /> Failed</>
          ) : (
            <><TestTube2 size={13} /> Test</>
          )}
        </button>

        <button onClick={handleSave}
          style={{ padding: '9px', borderRadius: '8px', border: 'none', background: saved ? 'rgba(34,197,94,0.15)' : t.gradient, cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: saved ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px', boxShadow: saved ? 'none' : `0 4px 12px ${t.accentGlow}`, transition: 'all 0.3s' }}>
          {saved ? <><CheckCircle2 size={13} /> Saved!</> : <><Save size={13} /> Save</>}
        </button>
      </div>

      {/* Status message */}
      {testStatus === 'success' && (
        <p style={{ fontSize: '11px', color: '#22c55e', marginTop: '8px', textAlign: 'center', fontWeight: 600 }}>
          ✓ Successfully connected to SparkAPI
        </p>
      )}
      {testStatus === 'error' && (
        <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '8px', textAlign: 'center', fontWeight: 600 }}>
          ✗ Connection failed — check your credentials
        </p>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  )
}

// ─────────────────────────────────────────────
// PRIVACY PANEL
// ─────────────────────────────────────────────
function PrivacyPanel({ c, t }) {
  const [settings, setSettings] = useState({
    searchHistory: true,
    saveActivity: true,
    personalizedAds: false,
    shareData: false,
    analytics: true,
    cookies: true,
  })
  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  const items = [
    { key: 'searchHistory', label: 'Save Search History', sub: 'Remember your past searches' },
    { key: 'saveActivity', label: 'Activity Tracking', sub: 'Track homes you view' },
    { key: 'personalizedAds', label: 'Personalized Ads', sub: 'Ads based on your searches' },
    { key: 'shareData', label: 'Share Data with Partners', sub: 'Send data to MLS partners' },
    { key: 'analytics', label: 'Usage Analytics', sub: 'Help improve ZephyrAI IDX' },
    { key: 'cookies', label: 'Functional Cookies', sub: 'Required for preferences' },
  ]
  return (
    <div style={{ padding: '4px 4px' }}>
      {items.map(item => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '9px 8px', borderRadius: '8px', marginBottom: '2px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: c.text, margin: 0 }}>{item.label}</p>
            <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{item.sub}</p>
          </div>
          <Toggle on={settings[item.key]} onChange={() => toggle(item.key)} accent={t.accent} />
        </div>
      ))}
      <button style={{ width: '100%', marginTop: '10px', padding: '9px', borderRadius: '8px', border: `1px solid rgba(239,68,68,0.4)`, background: 'rgba(239,68,68,0.08)', cursor: 'pointer', fontSize: '12px', fontWeight: 700, color: '#ef4444' }}>
        Delete All My Data
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────
// REUSABLE TOGGLE SWITCH
// ─────────────────────────────────────────────
function Toggle({ on, onChange, accent }) {
  return (
    <button onClick={onChange}
      style={{ width: '36px', height: '20px', borderRadius: '20px', background: on ? accent : '#475569', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
      <div style={{ position: 'absolute', top: '3px', left: on ? '19px' : '3px', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
    </button>
  )
}
