'use client'

import { useState } from 'react'
import {
  X, Mail, Lock, Eye, EyeOff, User,
  Building2, Users, Home, Key,
  CheckCircle2, AlertCircle, ArrowRight, Sparkles
} from 'lucide-react'
import { getAccountLevel, getLevelLabel, getLevelColor, getLevelBadge } from './auth'

const LEVEL_INFO = {
  brokerage: {
    icon: Building2,
    label: 'Brokerage',
    badge: '🏢',
    desc: 'Full MLS access, team management, API integrations',
    color: '#b8860b',
  },
  team: {
    icon: Users,
    label: 'Team',
    badge: '👥',
    desc: 'Shared listings, team collaboration tools',
    color: '#7b2d8b',
  },
  agent: {
    icon: Home,
    label: 'Agent',
    badge: '🏡',
    desc: 'Personal listings, client management, IDX access',
    color: '#0077b6',
  },
  homebuyer: {
    icon: Key,
    label: 'Homebuyer',
    badge: '🔑',
    desc: 'Search listings, save favorites, contact agents',
    color: '#16a34a',
  },
}

export default function SignInModal({ c, t, onClose, onSignIn }) {
  const [tab, setTab]               = useState('signin')   // 'signin' | 'register'
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [firstName, setFirstName]   = useState('')
  const [lastName, setLastName]     = useState('')
  const [showPass, setShowPass]     = useState(false)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState('')
  const [success, setSuccess]       = useState('')
  const [previewLevel, setPreviewLevel] = useState(null)

  const handleEmailChange = (val) => {
    setEmail(val)
    setError('')
    if (tab === 'register' && val.includes('@')) {
      const level = getAccountLevel(val)
      setPreviewLevel(level)
    } else {
      setPreviewLevel(null)
    }
  }

  const handleSignIn = () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setTimeout(() => {
      const level = getAccountLevel(email)
      setLoading(false)
      onSignIn({ email, level, firstName: email.split('@')[0], lastName: '' })
      onClose()
    }, 900)
  }

  const handleRegister = () => {
    if (!email || !password || !firstName) { setError('Please fill in all required fields'); return }
    if (password !== confirmPass) { setError('Passwords do not match'); return }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true)
    setTimeout(() => {
      const level = getAccountLevel(email)
      setLoading(false)
      setSuccess(`Account created! You have ${getLevelLabel(level)} access.`)
      setTimeout(() => {
        onSignIn({ email, level, firstName, lastName })
        onClose()
      }, 1200)
    }, 1000)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 40px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '14px', background: c.inputBg, color: c.text,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
  }

  const iconWrap = {
    position: 'absolute', left: '12px', top: '50%',
    transform: 'translateY(-50%)', color: c.textFaint,
    pointerEvents: 'none',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}>
      <div style={{ width: '100%', maxWidth: '440px', borderRadius: '20px', background: c.surface, border: `1px solid ${c.border}`, boxShadow: '0 32px 80px rgba(0,0,0,0.5)', overflow: 'hidden', margin: '0 16px' }}>

        {/* Header */}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 14px ${t.accentGlow}` }}>
                <span style={{ color: '#fff', fontWeight: 900, fontSize: '16px' }}>Z</span>
              </div>
              <div>
                <p style={{ fontWeight: 800, fontSize: '15px', color: c.text, margin: 0 }}>ZephyrAI IDX</p>
                <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>Real Estate Platform</p>
              </div>
            </div>
            <button onClick={onClose}
              style={{ width: '32px', height: '32px', borderRadius: '8px', border: `1px solid ${c.border}`, background: c.surfaceAlt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textMuted }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted }}>
              <X size={15} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', background: c.surfaceAlt, borderRadius: '10px', padding: '4px', marginBottom: '20px' }}>
            {[['signin', 'Sign In'], ['register', 'Register']].map(([id, label]) => (
              <button key={id} onClick={() => { setTab(id); setError(''); setSuccess(''); setPreviewLevel(null) }}
                style={{ flex: 1, padding: '8px', borderRadius: '7px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, transition: 'all 0.2s', background: tab === id ? t.accent : 'transparent', color: tab === id ? '#fff' : c.textMuted, boxShadow: tab === id ? `0 2px 8px ${t.accentGlow}` : 'none' }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '0 24px 24px' }}>

          {/* Account level cards — register only */}
          {tab === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: c.textMuted, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '8px' }}>Account Levels</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                {Object.entries(LEVEL_INFO).map(([key, info]) => {
                  const Icon = info.icon
                  const isActive = previewLevel === key
                  return (
                    <div key={key}
                      style={{ padding: '10px', borderRadius: '10px', border: `1px solid ${isActive ? info.color : c.border}`, background: isActive ? `${info.color}12` : 'transparent', transition: 'all 0.2s' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                        <span style={{ fontSize: '13px' }}>{info.badge}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: isActive ? info.color : c.text }}>{info.label}</span>
                        {isActive && <CheckCircle2 size={12} style={{ color: info.color, marginLeft: 'auto' }} />}
                      </div>
                      <p style={{ fontSize: '10px', color: c.textMuted, margin: 0, lineHeight: 1.3 }}>{info.desc}</p>
                    </div>
                  )
                })}
              </div>
              {previewLevel && (
                <div style={{ marginTop: '8px', padding: '8px 12px', borderRadius: '8px', background: `${getLevelColor(previewLevel)}15`, border: `1px solid ${getLevelColor(previewLevel)}40`, display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkles size={12} style={{ color: getLevelColor(previewLevel) }} />
                  <span style={{ fontSize: '12px', fontWeight: 600, color: getLevelColor(previewLevel) }}>
                    Your email qualifies for: {getLevelLabel(previewLevel)} access
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Register: First + Last name */}
          {tab === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconWrap} />
                <input type="text" placeholder="First Name*" value={firstName} onChange={e => setFirstName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>
              <div style={{ position: 'relative' }}>
                <User size={15} style={iconWrap} />
                <input type="text" placeholder="Last Name" value={lastName} onChange={e => setLastName(e.target.value)}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>
            </div>
          )}

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Mail size={15} style={iconWrap} />
            <input type="email" placeholder="Email Address" value={email} onChange={e => handleEmailChange(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = t.accent}
              onBlur={e => e.target.style.borderColor = c.border} />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: tab === 'register' ? '12px' : '16px' }}>
            <Lock size={15} style={iconWrap} />
            <input type={showPass ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '40px' }}
              onFocus={e => e.target.style.borderColor = t.accent}
              onBlur={e => e.target.style.borderColor = c.border} />
            <button onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted }}>
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Confirm Password — register only */}
          {tab === 'register' && (
            <div style={{ position: 'relative', marginBottom: '16px' }}>
              <Lock size={15} style={iconWrap} />
              <input type="password" placeholder="Confirm Password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)}
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = t.accent}
                onBlur={e => e.target.style.borderColor = c.border} />
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', marginBottom: '12px' }}>
              <AlertCircle size={14} style={{ color: '#ef4444', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#ef4444', margin: 0 }}>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '10px 12px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', marginBottom: '12px' }}>
              <CheckCircle2 size={14} style={{ color: '#22c55e', flexShrink: 0 }} />
              <p style={{ fontSize: '12px', color: '#22c55e', margin: 0 }}>{success}</p>
            </div>
          )}

          {/* Submit */}
          <button
            onClick={tab === 'signin' ? handleSignIn : handleRegister}
            disabled={loading}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: t.gradient, color: '#fff', cursor: loading ? 'wait' : 'pointer', fontSize: '14px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: `0 4px 16px ${t.accentGlow}`, opacity: loading ? 0.8 : 1, transition: 'all 0.2s' }}>
            {loading ? (
              <span style={{ display: 'inline-block', width: '16px', height: '16px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            ) : (
              <>
                {tab === 'signin' ? 'Sign In' : 'Create Account'}
                <ArrowRight size={15} />
              </>
            )}
          </button>

          {/* Hint for test account */}
          {tab === 'register' && (
            <p style={{ fontSize: '11px', color: c.textFaint, textAlign: 'center', marginTop: '10px' }}>
              Use <span style={{ color: t.accent, fontWeight: 600 }}>test@test.com</span> to get professional access
            </p>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}
