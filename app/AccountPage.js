'use client'

import { useState } from 'react'
import {
  X, User, Mail, Phone, MapPin, Lock,
  Camera, Save, CheckCircle2, Eye, EyeOff,
  Building2, Calendar, Globe, Shield
} from 'lucide-react'

export default function AccountPage({ c, t, onClose }) {
  const [activeTab, setActiveTab] = useState('profile')
  const [saved, setSaved] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    licenseNumber: '',
    website: '',
    bio: '',
    city: '',
    state: '',
    zip: '',
  })

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    twoFactor: false,
  })

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const inputStyle = {
    width: '100%', padding: '10px 14px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '14px', background: c.inputBg,
    color: c.text, outline: 'none',
    boxSizing: 'border-box', transition: 'border 0.2s',
  }

  const labelStyle = {
    fontSize: '12px', fontWeight: 700,
    color: c.textMuted, display: 'block',
    marginBottom: '6px', textTransform: 'uppercase',
    letterSpacing: '0.5px',
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'professional', label: 'Professional', icon: Building2 },
  ]

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: '100%', maxWidth: '560px', maxHeight: '90vh', borderRadius: '20px', background: c.surface, border: `1px solid ${c.border}`, boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${c.border}`, display: 'flex', flexDirection: 'column', overflow: 'hidden', margin: '0 16px' }}>

        {/* Header */}
        <div style={{ padding: '20px 24px 0', borderBottom: `1px solid ${c.border}`, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 16px ${t.accentGlow}` }}>
                <User size={20} color="#fff" />
              </div>
              <div>
                <h2 style={{ fontSize: '17px', fontWeight: 800, color: c.text, margin: 0 }}>Account Settings</h2>
                <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>Manage your ZephyrAI IDX account</p>
              </div>
            </div>
            <button onClick={onClose}
              style={{ width: '34px', height: '34px', borderRadius: '8px', border: `1px solid ${c.border}`, background: c.surfaceAlt, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.textMuted, transition: 'all 0.15s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted }}>
              <X size={16} />
            </button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '2px' }}>
            {tabs.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => setActiveTab(id)}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '9px 16px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: activeTab === id ? t.accent : c.textMuted, borderBottom: `2px solid ${activeTab === id ? t.accent : 'transparent'}`, transition: 'all 0.2s', borderRadius: '4px 4px 0 0' }}>
                <Icon size={13} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ overflowY: 'auto', flex: 1, padding: '24px' }}>

          {/* ── PROFILE TAB ── */}
          {activeTab === 'profile' && (
            <div>
              {/* Avatar */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', padding: '16px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}` }}>
                <div style={{ position: 'relative' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: t.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${t.accentGlow}` }}>
                    <User size={28} color="#fff" />
                  </div>
                  <button style={{ position: 'absolute', bottom: 0, right: 0, width: '22px', height: '22px', borderRadius: '50%', background: t.accent, border: `2px solid ${c.surface}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Camera size={10} color="#fff" />
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: c.text, margin: 0 }}>Profile Photo</p>
                  <p style={{ fontSize: '12px', color: c.textMuted, margin: '2px 0 8px' }}>JPG or PNG, max 5MB</p>
                  <button style={{ padding: '5px 12px', borderRadius: '6px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', fontSize: '12px', fontWeight: 600, color: c.text }}>
                    Upload Photo
                  </button>
                </div>
              </div>

              {/* Name Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={labelStyle}>First Name</label>
                  <input type="text" value={profile.firstName} onChange={e => setProfile(p => ({ ...p, firstName: e.target.value }))} placeholder="John" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
                <div>
                  <label style={labelStyle}>Last Name</label>
                  <input type="text" value={profile.lastName} onChange={e => setProfile(p => ({ ...p, lastName: e.target.value }))} placeholder="Smith" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              {/* Email */}
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type="email" value={profile.email} onChange={e => setProfile(p => ({ ...p, email: e.target.value }))} placeholder="john@example.com" style={{ ...inputStyle, paddingLeft: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              {/* Phone */}
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type="tel" value={profile.phone} onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+1 (555) 000-0000" style={{ ...inputStyle, paddingLeft: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              {/* Location Row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" value={profile.city} onChange={e => setProfile(p => ({ ...p, city: e.target.value }))} placeholder="Austin" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
                <div>
                  <label style={labelStyle}>State</label>
                  <input type="text" value={profile.state} onChange={e => setProfile(p => ({ ...p, state: e.target.value }))} placeholder="TX" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
                <div>
                  <label style={labelStyle}>ZIP</label>
                  <input type="text" value={profile.zip} onChange={e => setProfile(p => ({ ...p, zip: e.target.value }))} placeholder="78745" style={inputStyle}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              {/* Bio */}
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Bio</label>
                <textarea value={profile.bio} onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))} placeholder="Tell us a little about yourself..." rows={3}
                  style={{ ...inputStyle, resize: 'vertical', minHeight: '80px', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>
            </div>
          )}

          {/* ── SECURITY TAB ── */}
          {activeTab === 'security' && (
            <div>
              <div style={{ padding: '14px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: c.text, margin: '0 0 4px' }}>🔐 Password Security</p>
                <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>Use at least 12 characters with numbers and symbols.</p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Current Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type={showPassword ? 'text' : 'password'} value={security.currentPassword} onChange={e => setSecurity(p => ({ ...p, currentPassword: e.target.value }))} placeholder="Current password" style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                  <button onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted }}>
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type={showNewPassword ? 'text' : 'password'} value={security.newPassword} onChange={e => setSecurity(p => ({ ...p, newPassword: e.target.value }))} placeholder="New password" style={{ ...inputStyle, paddingLeft: '36px', paddingRight: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: c.textMuted }}>
                    {showNewPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" value={security.confirmPassword} onChange={e => setSecurity(p => ({ ...p, confirmPassword: e.target.value }))} placeholder="Confirm new password" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>

              <div style={{ padding: '14px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: c.text, margin: 0 }}>Two-Factor Authentication</p>
                  <p style={{ fontSize: '12px', color: c.textMuted, margin: '2px 0 0' }}>Add an extra layer of security</p>
                </div>
                <button onClick={() => setSecurity(p => ({ ...p, twoFactor: !p.twoFactor }))}
                  style={{ width: '40px', height: '22px', borderRadius: '20px', background: security.twoFactor ? t.accent : '#475569', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.25s' }}>
                  <div style={{ position: 'absolute', top: '3px', left: security.twoFactor ? '21px' : '3px', width: '16px', height: '16px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s' }} />
                </button>
              </div>
            </div>
          )}

          {/* ── PROFESSIONAL TAB ── */}
          {activeTab === 'professional' && (
            <div>
              <div style={{ padding: '14px', borderRadius: '12px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '20px' }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: c.text, margin: '0 0 4px' }}>🏡 Real Estate Professional</p>
                <p style={{ fontSize: '12px', color: c.textMuted, margin: 0 }}>This information may appear on your listings.</p>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Brokerage / Company</label>
                <div style={{ position: 'relative' }}>
                  <Building2 size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type="text" value={profile.company} onChange={e => setProfile(p => ({ ...p, company: e.target.value }))} placeholder="Acme Realty Group" style={{ ...inputStyle, paddingLeft: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>License Number</label>
                <input type="text" value={profile.licenseNumber} onChange={e => setProfile(p => ({ ...p, licenseNumber: e.target.value }))} placeholder="DRE #00000000" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>Website</label>
                <div style={{ position: 'relative' }}>
                  <Globe size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint }} />
                  <input type="url" value={profile.website} onChange={e => setProfile(p => ({ ...p, website: e.target.value }))} placeholder="https://yoursite.com" style={{ ...inputStyle, paddingLeft: '36px' }}
                    onFocus={e => e.target.style.borderColor = t.accent}
                    onBlur={e => e.target.style.borderColor = c.border} />
                </div>
              </div>

              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>MLS Member ID</label>
                <input type="text" value={profile.licenseNumber} onChange={e => setProfile(p => ({ ...p, licenseNumber: e.target.value }))} placeholder="MLS-XXXXXXXX" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = t.accent}
                  onBlur={e => e.target.style.borderColor = c.border} />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{ padding: '16px 24px', borderTop: `1px solid ${c.border}`, display: 'flex', gap: '10px', flexShrink: 0, background: c.surface }}>
          <button onClick={onClose}
            style={{ flex: 1, padding: '11px', borderRadius: '10px', border: `1px solid ${c.border}`, background: 'transparent', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: c.textMuted, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            Cancel
          </button>
          <button onClick={handleSave}
            style={{ flex: 2, padding: '11px', borderRadius: '10px', border: 'none', background: saved ? 'rgba(34,197,94,0.15)' : t.gradient, cursor: 'pointer', fontSize: '14px', fontWeight: 700, color: saved ? '#22c55e' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px', boxShadow: saved ? 'none' : `0 4px 16px ${t.accentGlow}`, transition: 'all 0.3s' }}>
            {saved ? <><CheckCircle2 size={16} /> Saved!</> : <><Save size={16} /> Save Changes</>}
          </button>
        </div>
      </div>
    </div>
  )
}
