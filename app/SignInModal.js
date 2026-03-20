'use client'
import { useState } from 'react'
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { ACCOUNT_LEVELS } from './auth'

export default function SignInModal({ c, t, onClose, onSignIn }) {
  const [mode,      setMode]      = useState('signin')
  const [showPass,  setShowPass]  = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')

  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName,  setLastName]  = useState('')
  const [level,     setLevel]     = useState('homebuyer')

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }
    if (mode === 'register' && (!firstName || !lastName)) {
      setError('Please enter your first and last name.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      onSignIn({
        email,
        firstName: mode === 'register' ? firstName : email.split('@')[0],
        lastName:  mode === 'register' ? lastName  : '',
        level:     mode === 'register' ? level      : 'homebuyer',
      })
      onClose()
    }, 900)
  }

  const inputStyle = {
    width: '100%', padding: '11px 14px 11px 40px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '14px', background: c.inputBg, color: c.text,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
  }

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, backdropFilter: 'blur(6px)', padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: c.surface, border: `1px solid ${c.border}`,
          borderRadius: '20px', width: '100%', maxWidth: '420px',
          boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${t.accent}20`,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 24px 0',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '12px',
              background: t.gradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', boxShadow: `0 0 20px ${t.accentGlow}`,
            }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '18px', color: c.text, margin: 0 }}>
                {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
              </p>
              <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>
                {mode === 'signin' ? 'Sign in to ZephyrAI IDX' : 'Join ZephyrAI IDX today'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: `1px solid ${c.border}`, background: c.surfaceAlt,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: c.textMuted, flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab switcher */}
        <div style={{
          display: 'flex', margin: '20px 24px 0',
          background: c.surfaceAlt, borderRadius: '10px', padding: '4px',
        }}>
          {[['signin','Sign In'],['register','Register']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => { setMode(id); setError('') }}
              style={{
                flex: 1, padding: '8px', borderRadius: '7px', border: 'none',
                background: mode === id ? t.accent : 'transparent',
                color: mode === id ? '#fff' : c.textMuted,
                cursor: 'pointer', fontSize: '13px', fontWeight: 700,
                transition: 'all 0.2s',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '20px 24px 24px' }}>

          {/* Name fields — register only */}
          {mode === 'register' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
              {[
                ['First Name', firstName, setFirstName],
                ['Last Name',  lastName,  setLastName],
              ].map(([label, val, setter]) => (
                <div key={label} style={{ position: 'relative' }}>
                  <User size={15} style={{
                    position: 'absolute', left: '12px', top: '50%',
                    transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none',
                  }} />
                  <input
                    type="text" placeholder={label} value={val}
                    onChange={e => setter(e.target.value)}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Email */}
          <div style={{ position: 'relative', marginBottom: '12px' }}>
            <Mail size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none',
            }} />
            <input
              type="email" placeholder="Email address" value={email}
              onChange={e => setEmail(e.target.value)}
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = t.accent}
              onBlur={e => e.target.style.borderColor = c.border}
            />
          </div>

          {/* Password */}
          <div style={{ position: 'relative', marginBottom: '16px' }}>
            <Lock size={15} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none',
            }} />
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="Password" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: '40px' }}
              onFocus={e => e.target.style.borderColor = t.accent}
              onBlur={e => e.target.style.borderColor = c.border}
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)', background: 'none',
                border: 'none', cursor: 'pointer', color: c.textFaint,
                display: 'flex', alignItems: 'center',
              }}
            >
              {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>

          {/* Account type — register only */}
          {mode === 'register' && (
            <div style={{ marginBottom: '16px' }}>
              <p style={{
                fontSize: '11px', color: c.textMuted, fontWeight: 700,
                textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '8px',
              }}>
                Account Type
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {Object.entries(ACCOUNT_LEVELS).map(([id, info]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => setLevel(id)}
                    style={{
                      padding: '10px 12px', borderRadius: '10px', border: 'none',
                      background: level === id ? `${info.color}20` : c.surfaceAlt,
                      outline: `1.5px solid ${level === id ? info.color : 'transparent'}`,
                      cursor: 'pointer', transition: 'all 0.2s', textAlign: 'left',
                    }}
                  >
                    <div style={{ fontSize: '18px', marginBottom: '2px' }}>{info.badge}</div>
                    <div style={{
                      fontSize: '12px', fontWeight: 700,
                      color: level === id ? info.color : c.text,
                    }}>
                      {info.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: '8px', marginBottom: '14px',
              background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
              fontSize: '13px', color: '#ef4444',
            }}>
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%', padding: '13px', borderRadius: '10px',
              border: 'none', background: loading ? c.border : t.gradient,
              color: '#fff', cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px', fontWeight: 700,
              boxShadow: loading ? 'none' : `0 4px 16px ${t.accentGlow}`,
              transition: 'all 0.2s', display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: '8px',
            }}
          >
            {loading ? '⏳ Please wait…' : mode === 'signin' ? '🔑 Sign In' : '🚀 Create Account'}
          </button>

          {/* Footer note */}
          <p style={{ fontSize: '11px', color: c.textFaint, textAlign: 'center', marginTop: '14px' }}>
            {mode === 'signin'
              ? 'Demo mode — any email and password works'
              : 'No credit card required · Free to join'}
          </p>
        </form>
      </div>
    </div>
  )
}
