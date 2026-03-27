'use client'

import { useState, useEffect } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { X, User, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignInModal({ c, t, onClose, onSignIn }) {
  const { signIn, setActive: setSignInActive } = useSignIn()
  const { signUp, setActive: setSignUpActive } = useSignUp()

  const [mode, setMode] = useState('signin')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [verifyStep, setVerifyStep] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')

  // Fields
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [agreeTerms, setAgreeTerms] = useState(false)

  const inp = (extra = {}) => ({
    width: '100%',
    padding: '11px 14px',
    border: `1px solid ${c.border}`,
    borderRadius: '10px',
    fontSize: '13px',
    background: c.inputBg,
    color: c.text,
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border 0.2s',
    ...extra,
  })

  const onFocus = e => {
    e.target.style.borderColor = t.accent
    e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}`
  }
  const onBlur = e => {
    e.target.style.borderColor = c.border
    e.target.style.boxShadow = 'none'
  }

  // ── SIGN IN ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    try {
      const result = await signIn.create({
        identifier: email,
        password,
      })
      if (result.status === 'complete') {
        await setSignInActive({ session: result.createdSessionId })
        if (rememberMe) {
          document.cookie = `zephyr_remember_email=${encodeURIComponent(email)}; max-age=2592000; path=/`
        }
        onSignIn({ email, firstName: email.split('@')[0], lastName: '', level: 'homebuyer' })
        onClose()
      }
    } catch (err) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Sign in failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── REGISTER ──────────────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName) {
      setError('Please enter your full name.')
      return
    }
    if (!email) {
      setError('Please enter your email.')
      return
    }
    if (!password || password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    if (!agreeTerms) {
      setError('Please agree to the Terms of Service.')
      return
    }

    setLoading(true)
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          level: 'homebuyer',
          verified: true,
          createdAt: new Date().toISOString(),
        },
      })
      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' })
      setVerifyStep(true)
    } catch (err) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || err.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  // ── EMAIL VERIFICATION ────────────────────────────────────────────────────
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setError('')
    if (!verifyCode.trim()) {
      setError('Please enter the verification code.')
      return
    }
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verifyCode })
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId })
        if (rememberMe) {
          document.cookie = `zephyr_remember_email=${encodeURIComponent(email)}; max-age=2592000; path=/`
        }
        onSignIn({ email, firstName, lastName, level: 'homebuyer' })
        onClose()
      } else {
        setError('Verification incomplete. Please try again.')
      }
    } catch (err) {
      const msg = err.errors?.[0]?.longMessage || err.errors?.[0]?.message || 'Invalid code'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const CheckBox = ({ value, onChange, label }) => (
    <label style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', cursor: 'pointer', marginBottom: '12px' }}>
      <div
        onClick={() => onChange(!value)}
        style={{
          width: '18px',
          height: '18px',
          borderRadius: '5px',
          border: `2px solid ${value ? t.accent : c.border}`,
          background: value ? t.accent : 'transparent',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          transition: 'all 0.2s',
          padding: 0,
          marginTop: '2px',
        }}
      >
        {value && <span style={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}>✓</span>}
      </div>
      <span style={{ fontSize: '12px', color: c.textMuted, lineHeight: '1.4' }}>{label}</span>
    </label>
  )

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: '20px',
          width: '100%',
          maxWidth: '420px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0 40px 100px rgba(0,0,0,0.55),0 0 0 1px ${t.accent}20`,
        }}
      >
        {/* Header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${t.accentGlow}` }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '17px', color: c.text, margin: 0 }}>
                {verifyStep ? 'Check Your Email' : mode === 'signin' ? 'Welcome Back' : 'Join ZephyrAI IDX'}
              </p>
              <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>
                {verifyStep ? `Code sent to ${email}` : mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              border: `1px solid ${c.border}`,
              background: c.surfaceAlt,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: c.textMuted,
              flexShrink: 0,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tab switcher */}
        {!verifyStep && (
          <div style={{ display: 'flex', margin: '18px 24px 0', background: c.surfaceAlt, borderRadius: '10px', padding: '4px', flexShrink: 0 }}>
            {[['signin', 'Sign In'], ['register', 'Create Account']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => { setMode(id); setError('') }}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '7px',
                  border: 'none',
                  background: mode === id ? t.accent : 'transparent',
                  color: mode === id ? '#fff' : c.textMuted,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 700,
                  transition: 'all 0.2s',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 24px' }}>

          {/* Email verification step */}
          {verifyStep && (
            <form onSubmit={handleVerifyEmail}>
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>📧</div>
                <p style={{ fontSize: '13px', color: c.textMuted, lineHeight: 1.6 }}>
                  We sent a 6-digit code to<br />
                  <strong style={{ color: c.text }}>{email}</strong>
                </p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <input
                  type="text"
                  placeholder="Enter 6-digit code"
                  value={verifyCode}
                  onChange={e => setVerifyCode(e.target.value)}
                  maxLength={6}
                  style={{ ...inp({ textAlign: 'center', fontSize: '22px', letterSpacing: '8px', fontWeight: 800 }) }}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="one-time-code"
                  autoFocus
                />
              </div>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444' }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? c.border : t.gradient,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: loading ? 'none' : `0 4px 16px ${t.accentGlow}`,
                  marginBottom: '12px',
                }}
              >
                {loading ? '⏳ Verifying…' : '✅ Verify Email'}
              </button>
              <button
                type="button"
                onClick={async () => { if (signUp) await signUp.prepareEmailAddressVerification({ strategy: 'email_code' }) }}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '10px',
                  border: `1px solid ${c.border}`,
                  background: 'transparent',
                  color: c.textMuted,
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 600,
                }}
              >
                Resend code
              </button>
            </form>
          )}

          {/* Sign In */}
          {!verifyStep && mode === 'signin' && (
            <form onSubmit={handleSignIn}>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inp()}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="email"
                />
              </div>
              <div style={{ position: 'relative', marginBottom: '8px' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inp({ paddingRight: '42px' })}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.textFaint,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <CheckBox value={rememberMe} onChange={setRememberMe} label="Remember me" />
                <button
                  type="button"
                  style={{
                    fontSize: '12px',
                    color: t.accent,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    padding: 0,
                    marginTop: '-14px',
                  }}
                >
                  Forgot password?
                </button>
              </div>
              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444' }}>
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? c.border : t.gradient,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: loading ? 'none' : `0 4px 16px ${t.accentGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? '⏳ Signing in…' : '🔑 Sign In'}
              </button>
            </form>
          )}

          {/* Register */}
          {!verifyStep && mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
                {[['First Name', firstName, setFirstName, 'given-name'], ['Last Name', lastName, setLastName, 'family-name']].map(([label, val, setter, ac]) => (
                  <div key={label} style={{ position: 'relative' }}>
                    <User size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                    <input
                      type="text"
                      placeholder={label}
                      value={val}
                      onChange={e => setter(e.target.value)}
                      style={inp()}
                      onFocus={onFocus}
                      onBlur={onBlur}
                      autoComplete={ac}
                    />
                  </div>
                ))}
              </div>
              <div style={{ position: 'relative', marginBottom: '12px' }}>
                <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  style={inp()}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="email"
                />
              </div>
              <div style={{ position: 'relative', marginBottom: '16px' }}>
                <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="Password (min 8 characters)"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  style={inp({ paddingRight: '42px' })}
                  onFocus={onFocus}
                  onBlur={onBlur}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: c.textFaint,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>

              {/* Benefits */}
              <div style={{ marginBottom: '16px', padding: '14px', borderRadius: '10px', background: `${t.accent}08`, border: `1px solid ${t.accent}20` }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: c.text, marginBottom: '8px' }}>What you get with a free account:</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {['Browse all listings', 'Save favorite homes', 'Get price drop alerts', 'AI-powered recommendations'].map((benefit) => (
                    <div key={benefit} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ color: '#22c55e', fontSize: '14px' }}>✓</span>
                      <span style={{ fontSize: '12px', color: c.textMuted }}>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>

              <CheckBox
                value={rememberMe}
                onChange={setRememberMe}
                label="Remember me on this device"
              />
              <CheckBox
                value={agreeTerms}
                onChange={setAgreeTerms}
                label={<span>I agree to the <span style={{ color: t.accent, fontWeight: 600 }}>Terms of Service</span> and <span style={{ color: t.accent, fontWeight: 600 }}>Privacy Policy</span></span>}
              />

              {error && (
                <div style={{ padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', fontSize: '13px', color: '#ef4444' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px',
                  borderRadius: '10px',
                  border: 'none',
                  background: loading ? c.border : t.gradient,
                  color: '#fff',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: loading ? 'none' : `0 4px 16px ${t.accentGlow}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                }}
              >
                {loading ? '⏳ Creating account…' : '🏠 Create Free Account'}
              </button>
              <p style={{ fontSize: '11px', color: c.textFaint, textAlign: 'center', marginTop: '12px' }}>Free to join · No credit card required</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
