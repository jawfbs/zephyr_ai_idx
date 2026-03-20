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

const SECTION_META = {
  '👤 Account':       { icon: User },
  '🔔 Notifications': { icon: Bell },
  '🎨 Appearance':    { icon: Palette },
  '🔌 Integrations':  { icon: Plug },
  '🔒 Privacy':       { icon: Shield },
}

export default function AccordionSection({
  section, c, t,
  themeCategory, setThemeCategory,
  activeTheme, setActiveTheme,
  THEMES,
  colorMode, setColorMode,
  onOpenAccount,
  onSaveApiCreds,
}) {
  const [open, setOpen] = useState(false)
  const meta = SECTION_META[section.label] || {}
  const IconComp = meta.icon || ChevronRight

  return (
    <div style={{ marginBottom: '2px' }}>
      <button
        onClick={() => {
          if (section.isAccount) { onOpenAccount(); return }
          setOpen(!open)
        }}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: 'none', background: open ? c.surfaceAlt : 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: 600, transition: 'background 0.15s' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = c.surfaceAlt }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: open ? `${t.accent}20` : c.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}>
            <IconComp size={13} style={{ color: open ? t.accent : c.textMuted }} />
          </div>
          {section.label}
        </div>
        <ChevronRight size={14} style={{ color: c.textFaint, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && !section.isAccount && (
        <div style={{ paddingLeft: '8px', paddingBottom: '8px', paddingRight: '4px' }}>
          {section.isNotifications && <NotificationsPanel c={c} t={t} />}
          {section.isAppearance    && <AppearancePanel c={c} t={t} colorMode={colorMode} setColorMode={setColorMode} themeCategory={themeCategory} setThemeCategory={setThemeCategory} activeTheme={activeTheme} setActiveTheme={setActiveTheme} THEMES={THEMES} />}
          {section.isIntegrations  && <IntegrationsPanel c={c} t={t} onSaveApiCreds={onSaveApiCreds} />}
          {section.isPrivacy       && <PrivacyPanel c={c} t={t} />}
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────
// NOTIFICATIONS
// ─────────────────────────────────────────────
function NotificationsPanel({ c, t }) {
  const [s, setS] = useState({ newListings: true, priceDrops: true, savedAlerts: false, openHouses: true, marketUpdates: false, emailDigest: true })
  const items = [
    { key: 'newListings',    label: 'New Listings',      sub: 'Matching your saved searches' },
    { key: 'priceDrops',     label: 'Price Drops',       sub: 'On homes you saved' },
    { key: 'savedAlerts',    label: 'Saved Home Alerts', sub: 'Activity on saved homes' },
    { key: 'openHouses',     label: 'Open Houses',       sub: 'Nearby open house events' },
    { key: 'marketUpdates',  label: 'Market Updates',    sub: 'Weekly area reports' },
    { key: 'emailDigest',    label: 'Email Digest',      sub: 'Daily summary email' },
  ]
  return (
    <div style={{ padding: '4px' }}>
      {items.map(item => (
        <div key={item.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px', borderRadius: '8px', marginBottom: '2px' }}>
          <div>
            <p style={{ fontSize: '12px', fontWeight: 600, color: c.text, margin: 0 }}>{item.label}</p>
            <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{item.sub}</p>
          </div>
          <Toggle on={s[item.key]} onChange={() => setS(p => ({ ...p, [item.key]: !p[item.key] }))} accent={t.accent} />
        </div>
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────
// APPEARANCE
// ─────────────────────────────────────────────
function AppearancePanel({ c, t, colorMode, setColorMode, themeCategory, setThemeCategory, activeTheme, setActiveTheme, THEMES }) {
  const modes = [
    { id: 'light',  label: 'Light',  icon: Sun },
    { id: 'mellow', label: 'Mellow', icon: Sunset },
    { id: 'dark',   label: 'Dark',   icon: Moon },
  ]
  return (
    <div style={{ padding: '4px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Color Mode</p>
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {modes.map(({ id, label, icon: Icon }) => {
          const isActive = colorMode === id
          return (
            <button key={id} onClick={() => setColorMode(id)}
              style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '8px 4px', borderRadius: '10px', border: `1px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${t.accent}15` : 'transparent', cursor: 'pointer', color: isActive ? t.accent : c.textMuted, transition: 'all 0.2s' }}>
              <Icon size={15} />
              <span style={{ fontSize: '11px', fontWeight: 600 }}>{label}</span>
            </button>
          )
        })}
      </div>

      <p style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '8px' }}>Theme</p>
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
// INTEGRATIONS — SparkAPI with real save
// ─────────────────────────────────────────────
function IntegrationsPanel({ c, t, onSaveApiCreds }) {
  const [apiMode,    setApiMode]    = useState('replication')
  const [apiKey,     setApiKey]     = useState('')
  const [apiSecret,  setApiSecret]  = useState('')
  const [showSecret, setShowSecret] = useState(false)
  const [testStatus, setTestStatus] = useState(null)
  const [saveStatus, setSaveStatus] = useState(null)

  const endpoints = {
    live:        'https://api.sparkapi.com',
    replication: 'https://replication.sparkapi.com',
  }

  const handleModeChange = (mode) => {
    setApiMode(mode)
    setTestStatus(null)
    setSaveStatus(null)
  }

  const handleTest = () => {
    if (!apiKey || !apiSecret) { setTestStatus('error'); return }
    setTestStatus('testing')
    setTimeout(() => {
      setTestStatus(apiKey.length > 8 && apiSecret.length > 8 ? 'success' : 'error')
    }, 1800)
  }

  const handleSave = () => {
    if (testStatus !== 'success') {
      setSaveStatus('must_test')
      return
    }
    setSaveStatus('saving')
    setTimeout(() => {
      onSaveApiCreds({
        key:      apiKey,
        secret:   apiSecret,
        endpoint: endpoints[apiMode],
        mode:     apiMode,
      })
      setSaveStatus('saved')
    }, 600)
  }

  const inputBase = {
    width: '100%', padding: '9px 12px',
    border: `1px solid ${c.border}`, borderRadius: '8px',
    fontSize: '12px', background: c.inputBg, color: c.text,
    outline: 'none', boxSizing: 'border-box',
  }

  const labelBase = {
    fontSize: '11px', fontWeight: 700, color: c.textMuted,
    textTransform: 'uppercase', letterSpacing: '0.6px',
    display: 'block', marginBottom: '5px',
  }

  return (
    <div style={{ padding: '4px' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px', borderRadius: '10px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '12px' }}>
        <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Plug
