'use client'
import { useState } from 'react'
import { useSignIn, useSignUp } from '@clerk/nextjs'
import { X, User, Mail, Lock, Eye, EyeOff, Shield } from 'lucide-react'

const LEVEL_INFO = {
  homebuyer: {
    icon: '🔑', label: 'Homebuyer', color: '#22c55e',
    description: 'Search listings, save favorites, get alerts',
    verify: null,
  },
  agent: {
    icon: '🏡', label: 'Agent', color: '#3b82f6',
    description: 'Full IDX access, client tools, SparkAPI',
    verify: 'mlsId', verifyLabel: 'MLS Agent ID', verifyPH: 'e.g. FM12345',
  },
  team: {
    icon: '👥', label: 'Team', color: '#8b5cf6',
    description: 'Multi-agent dashboard, shared searches',
    verify: 'inviteCode', verifyLabel: 'Team Invite Code', verifyPH: 'Code from your team leader',
  },
  brokerage: {
    icon: '🏢', label: 'Brokerage', color: '#f59e0b',
    description: 'Full platform, custom branding, API access',
    verify: 'licenseNumber', verifyLabel: 'Brokerage License #', verifyPH: 'e.g. BRK-ND-00123',
  },
}

export default function SignInModal({ c, t, onClose, onSignIn }) {
  const { signIn,  setActive: setSignInActive  } = useSignIn()
  const { signUp,  setActive: setSignUpActive  } = useSignUp()

  const [mode,         setMode]         = useState('signin')
  const [showPass,     setShowPass]     = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [error,        setError]        = useState('')
  const [rememberMe,   setRememberMe]   = useState(false)
  const [verifyStep,   setVerifyStep]   = useState(false)
  const [verifyCode,   setVerifyCode]   = useState('')

  // Fields
  const [email,       setEmail]       = useState('')
  const [password,    setPassword]    = useState('')
  const [firstName,   setFirstName]   = useState('')
  const [lastName,    setLastName]    = useState('')
  const [level,       setLevel]       = useState('homebuyer')
  const [verifyValue, setVerifyValue] = useState('')
  const [agreeTerms,  setAgreeTerms]  = useState(false)

  const levelInfo = LEVEL_INFO[level]

  const inp = (extra = {}) => ({
    width: '100%', padding: '11px 14px 11px 40px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '13px', background: c.inputBg, color: c.text,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
    ...extra,
  })
  const onFocus = e => { e.target.style.borderColor = t.accent;  e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }
  const onBlur  = e => { e.target.style.borderColor = c.border; e.target.style.boxShadow = 'none' }

  // ── SIGN IN ────────────────────────────────────────────────────────────────
  const handleSignIn = async (e) => {
    e.preventDefault()
    setError('')
    if (!email || !password) { setError('Please enter your email and password.'); return }
    setLoading(true)
    try {
      const result = await signIn.create({ identifier: email, password })
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

  // ── REGISTER — Step 1 ──────────────────────────────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    if (!firstName || !lastName)  { setError('Please enter your full name.'); return }
    if (!email)                   { setError('Please enter your email.'); return }
    if (!password || password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (!agreeTerms)              { setError('Please agree to the Terms of Service.'); return }
    if (levelInfo.verify && !verifyValue.trim()) { setError(`Please enter your ${levelInfo.verifyLabel}.`); return }

    setLoading(true)
    try {
      await signUp.create({
        emailAddress: email,
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          level,
          ...(levelInfo.verify ? { [levelInfo.verify]: verifyValue } : {}),
          verified:  level === 'homebuyer',
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

  // ── REGISTER — Step 2 email verification ──────────────────────────────────
  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setError('')
    if (!verifyCode.trim()) { setError('Please enter the verification code.'); return }
    setLoading(true)
    try {
      const result = await signUp.attemptEmailAddressVerification({ code: verifyCode })
      if (result.status === 'complete') {
        await setSignUpActive({ session: result.createdSessionId })
        if (rememberMe) {
          document.cookie = `zephyr_remember_email=${encodeURIComponent(email)}; max-age=2592000; path=/`
        }
        onSignIn({ email, firstName, lastName, level })
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

  const CheckBox = ({ value, onChange, label, sub }) => (
    <label style={{ display:'flex', alignItems:'flex-start', gap:'8px', cursor:'pointer', marginBottom:'14px' }}>
      <button type="button" onClick={() => onChange(!value)}
        style={{ width:'18px', height:'18px', borderRadius:'5px', border:`2px solid ${value ? t.accent : c.border}`, background:value ? t.accent : 'transparent', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s', padding:0, marginTop:'1px' }}>
        {value && <span style={{ color:'#fff', fontSize:'11px', fontWeight:900, lineHeight:1 }}>✓</span>}
      </button>
      <span style={{ fontSize:'12px', color:c.textMuted, lineHeight:1.5, userSelect:'none' }}>{label}</span>
    </label>
  )

  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.78)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:99999, backdropFilter:'blur(8px)', padding:'16px' }}
      onClick={onClose}>
      <div onClick={e => e.stopPropagation()}
        style={{ background:c.surface, border:`1px solid ${c.border}`, borderRadius:'20px', width:'100%', maxWidth:'440px', maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden', boxShadow:`0 40px 100px rgba(0,0,0,0.55),0 0 0 1px ${t.accent}20` }}>

        {/* Header */}
        <div style={{ padding:'22px 24px 0', display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexShrink:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'44px', height:'44px', borderRadius:'12px', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 20px ${t.accentGlow}` }}>
              <User size={20} color="#fff" />
            </div>
            <div>
              <p style={{ fontWeight:900, fontSize:'17px', color:c.text, margin:0 }}>
                {verifyStep ? '✉️ Check Your Email' : mode === 'signin' ? 'Welcome Back' : 'Join ZephyrAI IDX'}
              </p>
              <p style={{ fontSize:'12px', color:c.textMuted, margin:0 }}>
                {verifyStep ? `Code sent to ${email}` : mode === 'signin' ? 'Sign in to your account' : 'Create your free account'}
              </p>
            </div>
          </div>
          <button onClick={onClose}
            style={{ width:'32px', height:'32px', borderRadius:'8px', border:`1px solid ${c.border}`, background:c.surfaceAlt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:c.textMuted, flexShrink:0 }}>
            <X size={15} />
          </button>
        </div>

        {/* Tab switcher — hidden on verify step */}
        {!verifyStep && (
          <div style={{ display:'flex', margin:'18px 24px 0', background:c.surfaceAlt, borderRadius:'10px', padding:'4px', flexShrink:0 }}>
            {[['signin','Sign In'],['register','Create Account']].map(([id,label]) => (
              <button key={id} onClick={() => { setMode(id); setError(''); setVerifyStep(false) }}
                style={{ flex:1, padding:'8px', borderRadius:'7px', border:'none', background:mode===id ? t.accent : 'transparent', color:mode===id ? '#fff' : c.textMuted, cursor:'pointer', fontSize:'13px', fontWeight:700, transition:'all 0.2s' }}>
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Body */}
        <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 24px' }}>

          {/* ── Email verification step ── */}
          {verifyStep && (
            <form onSubmit={handleVerifyEmail}>
              <div style={{ textAlign:'center', marginBottom:'20px' }}>
                <div style={{ fontSize:'48px', marginBottom:'10px' }}>📧</div>
                <p style={{ fontSize:'13px', color:c.textMuted, lineHeight:1.6 }}>
                  We sent a 6-digit code to<br />
                  <strong style={{ color:c.text }}>{email}</strong>
                </p>
              </div>
              <div style={{ position:'relative', marginBottom:'16px' }}>
                <input type="text" placeholder="Enter 6-digit code" value={verifyCode} onChange={e => setVerifyCode(e.target.value)}
                  maxLength={6}
                  style={{ ...inp({ paddingLeft:'14px', textAlign:'center', fontSize:'22px', letterSpacing:'8px', fontWeight:800 }) }}
                  onFocus={onFocus} onBlur={onBlur} autoComplete="one-time-code" autoFocus />
              </div>
              {error && <div style={{ padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', fontSize:'13px', color:'#ef4444' }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'13px', borderRadius:'10px', border:'none', background:loading ? c.border : t.gradient, color:'#fff', cursor:loading ? 'not-allowed' : 'pointer', fontSize:'14px', fontWeight:800, boxShadow:loading?'none':`0 4px 16px ${t.accentGlow}`, marginBottom:'12px' }}>
                {loading ? '⏳ Verifying…' : '✅ Verify Email'}
              </button>
              <button type="button" onClick={() => signUp.prepareEmailAddressVerification({ strategy:'email_code' })}
                style={{ width:'100%', padding:'10px', borderRadius:'10px', border:`1px solid ${c.border}`, background:'transparent', color:c.textMuted, cursor:'pointer', fontSize:'13px', fontWeight:600 }}>
                Resend code
              </button>
            </form>
          )}

          {/* ── Sign In ── */}
          {!verifyStep && mode === 'signin' && (
            <form onSubmit={handleSignIn}>
              <div style={{ position:'relative', marginBottom:'12px' }}>
                <Mail size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
                <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}
                  style={inp()} onFocus={onFocus} onBlur={onBlur} autoComplete="email" />
              </div>
              <div style={{ position:'relative', marginBottom:'8px' }}>
                <Lock size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
                <input type={showPass?'text':'password'} placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)}
                  style={inp({ paddingRight:'42px' })} onFocus={onFocus} onBlur={onBlur} autoComplete="current-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:c.textFaint, display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
                <CheckBox value={rememberMe} onChange={setRememberMe} label="Remember me" />
                <button type="button" style={{ fontSize:'12px', color:t.accent, background:'none', border:'none', cursor:'pointer', fontWeight:600, padding:0, marginTop:'-14px' }}>Forgot password?</button>
              </div>
              {error && <div style={{ padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', fontSize:'13px', color:'#ef4444' }}>{error}</div>}
              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'13px', borderRadius:'10px', border:'none', background:loading?c.border:t.gradient, color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:'14px', fontWeight:800, boxShadow:loading?'none':`0 4px 16px ${t.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                {loading ? '⏳ Signing in…' : '🔑 Sign In'}
              </button>
            </form>
          )}

          {/* ── Register ── */}
          {!verifyStep && mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px', marginBottom:'12px' }}>
                {[['First Name',firstName,setFirstName,'given-name'],['Last Name',lastName,setLastName,'family-name']].map(([label,val,setter,ac]) => (
                  <div key={label} style={{ position:'relative' }}>
                    <User size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
                    <input type="text" placeholder={label} value={val} onChange={e=>setter(e.target.value)}
                      style={inp()} onFocus={onFocus} onBlur={onBlur} autoComplete={ac} />
                  </div>
                ))}
              </div>
              <div style={{ position:'relative', marginBottom:'12px' }}>
                <Mail size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
                <input type="email" placeholder="Email address" value={email} onChange={e=>setEmail(e.target.value)}
                  style={inp()} onFocus={onFocus} onBlur={onBlur} autoComplete="email" />
              </div>
              <div style={{ position:'relative', marginBottom:'18px' }}>
                <Lock size={15} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
                <input type={showPass?'text':'password'} placeholder="Password (min 8 characters)" value={password} onChange={e=>setPassword(e.target.value)}
                  style={inp({ paddingRight:'42px' })} onFocus={onFocus} onBlur={onBlur} autoComplete="new-password" />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position:'absolute', right:'12px', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', cursor:'pointer', color:c.textFaint, display:'flex', alignItems:'center' }}>
                  {showPass ? <EyeOff size={15}/> : <Eye size={15}/>}
                </button>
              </div>

              {/* Account type selector */}
              <p style={{ fontSize:'11px', fontWeight:700, color:c.textMuted, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px' }}>I am a…</p>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px', marginBottom:'16px' }}>
                {Object.entries(LEVEL_INFO).map(([id,info]) => {
                  const on = level === id
                  return (
                    <button key={id} type="button" onClick={() => { setLevel(id); setVerifyValue('') }}
                      style={{ padding:'10px 12px', borderRadius:'10px', border:`1.5px solid ${on?info.color:c.border}`, background:on?`${info.color}15`:c.surfaceAlt, cursor:'pointer', textAlign:'left', transition:'all 0.2s' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'6px', marginBottom:'3px' }}>
                        <span style={{ fontSize:'16px' }}>{info.icon}</span>
                        <span style={{ fontSize:'12px', fontWeight:700, color:on?info.color:c.text }}>{info.label}</span>
                        {on && <span style={{ marginLeft:'auto', width:'16px', height:'16px', borderRadius:'50%', background:info.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'9px', color:'#fff', fontWeight:900 }}>✓</span>}
                      </div>
                      <p style={{ fontSize:'10px', color:c.textMuted, margin:0, lineHeight:1.4 }}>{info.description}</p>
                    </button>
                  )
                })}
              </div>

              {/* Verification field */}
              {levelInfo.verify && (
                <div style={{ marginBottom:'16px', padding:'12px', borderRadius:'10px', background:`${levelInfo.color}08`, border:`1px solid ${levelInfo.color}30` }}>
                  <p style={{ fontSize:'11px', fontWeight:700, color:levelInfo.color, marginBottom:'6px' }}>{levelInfo.icon} {levelInfo.label} Verification</p>
                  <p style={{ fontSize:'11px', color:c.textMuted, marginBottom:'8px' }}>
                    {level==='agent'     && 'Enter your MLS Agent ID to verify your license.'}
                    {level==='team'      && 'Ask your team leader for an invite code.'}
                    {level==='brokerage' && 'Enter your state brokerage license number.'}
                  </p>
                  <div style={{ position:'relative' }}>
                    <Shield size={14} style={{ position:'absolute', left:'12px', top:'50%', transform:'translateY(-50%)', color:levelInfo.color, pointerEvents:'none' }} />
                    <input type="text" placeholder={levelInfo.verifyPH} value={verifyValue} onChange={e=>setVerifyValue(e.target.value)}
                      style={{ ...inp({ paddingLeft:'36px', borderColor:`${levelInfo.color}50`, fontFamily:'monospace' }) }}
                      onFocus={e=>{e.target.style.borderColor=levelInfo.color;e.target.style.boxShadow=`0 0 0 3px ${levelInfo.color}25`}}
                      onBlur={e=>{e.target.style.borderColor=`${levelInfo.color}50`;e.target.style.boxShadow='none'}} />
                  </div>
                  {level==='brokerage' && <p style={{ fontSize:'10px', color:c.textFaint, marginTop:'6px' }}>⏳ Brokerage accounts require manual review — approved within 24 hours.</p>}
                </div>
              )}

              <CheckBox value={rememberMe}  onChange={setRememberMe}  label="Remember me on this device" />
              <CheckBox value={agreeTerms}  onChange={setAgreeTerms}
                label={<span>I agree to the <span style={{ color:t.accent, fontWeight:600 }}>Terms of Service</span> and <span style={{ color:t.accent, fontWeight:600 }}>Privacy Policy</span></span>} />

              {error && <div style={{ padding:'10px 14px', borderRadius:'8px', marginBottom:'14px', background:'rgba(239,68,68,0.1)', border:'1px solid rgba(239,68,68,0.3)', fontSize:'13px', color:'#ef4444' }}>{error}</div>}

              <button type="submit" disabled={loading}
                style={{ width:'100%', padding:'13px', borderRadius:'10px', border:'none', background:loading?c.border:t.gradient, color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:'14px', fontWeight:800, boxShadow:loading?'none':`0 4px 16px ${t.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                {loading ? '⏳ Creating account…' : `${levelInfo.icon} Create ${levelInfo.label} Account`}
              </button>
              <p style={{ fontSize:'11px', color:c.textFaint, textAlign:'center', marginTop:'12px' }}>Free to join · No credit card required</p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
