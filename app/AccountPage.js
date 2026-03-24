'use client'
import { useState } from 'react'
import { X, User, Mail, Phone, MapPin, Shield, Bell, CreditCard, LogOut } from 'lucide-react'
import { getLevelLabel, getLevelColor, getLevelBadge } from './auth'

export default function AccountPage({ c, t, onClose }) {
  const [activeTab, setActiveTab] = useState('profile')

  const tabs = [
    { id: 'profile',   label: '👤 Profile',   },
    { id: 'security',  label: '🔒 Security',  },
    { id: 'billing',   label: '💳 Billing',   },
    { id: 'alerts',    label: '🔔 Alerts',    },
  ]

  const [profile, setProfile] = useState({
    firstName: 'Alex',
    lastName:  'Johnson',
    email:     'alex@example.com',
    phone:     '+1 (701) 555-0100',
    city:      'Fargo',
    state:     'ND',
    level:     'homebuyer',
  })

  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    border: `1px solid ${c.border}`, borderRadius: '10px',
    fontSize: '13px', background: c.inputBg, color: c.text,
    outline: 'none', boxSizing: 'border-box', transition: 'border 0.2s',
  }

  return (
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
          borderRadius: '20px', width: '100%', maxWidth: '560px',
          maxHeight: '90vh', display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
          boxShadow: `0 40px 100px rgba(0,0,0,0.5), 0 0 0 1px ${t.accent}20`,
        }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px', borderBottom: `1px solid ${c.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px', height: '48px', borderRadius: '50%',
              background: t.gradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '22px',
              boxShadow: `0 0 16px ${t.accentGlow}`,
            }}>
              {getLevelBadge(profile.level)}
            </div>
            <div>
              <p style={{ fontWeight: 800, fontSize: '16px', color: c.text, margin: 0 }}>
                {profile.firstName} {profile.lastName}
              </p>
              <span style={{
                padding: '2px 10px', borderRadius: '20px', fontSize: '11px',
                fontWeight: 700, background: `${getLevelColor(profile.level)}20`,
                color: getLevelColor(profile.level),
                border: `1px solid ${getLevelColor(profile.level)}40`,
              }}>
                {getLevelBadge(profile.level)} {getLevelLabel(profile.level)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '34px', height: '34px', borderRadius: '8px',
              border: `1px solid ${c.border}`, background: c.surfaceAlt,
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: c.textMuted,
            }}
          >
            <X size={15} />
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex', borderBottom: `1px solid ${c.border}`,
          flexShrink: 0, overflowX: 'auto',
        }}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 18px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontSize: '13px',
                fontWeight: activeTab === tab.id ? 700 : 500,
                color: activeTab === tab.id ? t.accent : c.textMuted,
                borderBottom: `2px solid ${activeTab === tab.id ? t.accent : 'transparent'}`,
                whiteSpace: 'nowrap', transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, marginBottom: '16px' }}>
                Personal Information
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                {[
                  ['First Name', 'firstName', 'text'],
                  ['Last Name',  'lastName',  'text'],
                ].map(([label, key, type]) => (
                  <div key={key}>
                    <label style={{ fontSize: '11px', color: c.textMuted, fontWeight: 600, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</label>
                    <input
                      type={type}
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = t.accent}
                      onBlur={e => e.target.style.borderColor = c.border}
                    />
                  </div>
                ))}
              </div>
              {[
                ['Email Address', 'email', 'email',  Mail   ],
                ['Phone Number', 'phone', 'tel',    Phone  ],
              ].map(([label, key, type, Icon]) => (
                <div key={key} style={{ marginBottom: '12px' }}>
                  <label style={{ fontSize: '11px', color: c.textMuted, fontWeight: 600, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</label>
                  <div style={{ position: 'relative' }}>
                    <Icon size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: c.textFaint, pointerEvents: 'none' }} />
                    <input
                      type={type}
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      style={{ ...inputStyle, paddingLeft: '36px' }}
                      onFocus={e => e.target.style.borderColor = t.accent}
                      onBlur={e => e.target.style.borderColor = c.border}
                    />
                  </div>
                </div>
              ))}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                {[['City', 'city'], ['State', 'state']].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: '11px', color: c.textMuted, fontWeight: 600, display: 'block', marginBottom: '5px', textTransform: 'uppercase' }}>{label}</label>
                    <input
                      type="text"
                      value={profile[key]}
                      onChange={e => setProfile(p => ({ ...p, [key]: e.target.value }))}
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = t.accent}
                      onBlur={e => e.target.style.borderColor = c.border}
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={handleSave}
                style={{
                  width: '100%', padding: '12px', borderRadius: '10px',
                  border: 'none', background: saved ? '#16a34a' : t.gradient,
                  color: '#fff', cursor: 'pointer', fontSize: '14px',
                  fontWeight: 700, transition: 'all 0.3s',
                  boxShadow: saved ? 'none' : `0 4px 16px ${t.accentGlow}`,
                }}
              >
                {saved ? '✅ Saved!' : 'Save Changes'}
              </button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, marginBottom: '16px' }}>Security Settings</p>
              {[
                { label: 'Change Password', icon: '🔑', desc: 'Update your account password', action: 'Update Password' },
                { label: 'Two-Factor Auth', icon: '📱', desc: 'Add an extra layer of security', action: 'Enable 2FA' },
                { label: 'Active Sessions', icon: '💻', desc: 'Manage devices signed in to your account', action: 'View Sessions' },
                { label: 'Login History',   icon: '📋', desc: 'Review recent login activity', action: 'View History' },
              ].map(({ label, icon, desc, action }) => (
                <div key={label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px', borderRadius: '12px',
                  background: c.surfaceAlt, border: `1px solid ${c.border}`,
                  marginBottom: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '22px' }}>{icon}</span>
                    <div>
                      <p style={{ fontWeight: 700, fontSize: '13px', color: c.text, margin: 0 }}>{label}</p>
                      <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{desc}</p>
                    </div>
                  </div>
                  <button style={{
                    padding: '6px 14px', borderRadius: '8px',
                    border: `1px solid ${t.accent}50`, background: `${t.accent}15`,
                    color: t.accent, cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                    whiteSpace: 'nowrap',
                  }}>
                    {action}
                  </button>
                </div>
              ))}
              <div style={{
                marginTop: '20px', padding: '14px', borderRadius: '12px',
                background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
              }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#ef4444', marginBottom: '6px' }}>Danger Zone</p>
                <p style={{ fontSize: '12px', color: c.textMuted, marginBottom: '12px' }}>
                  Permanently delete your account and all associated data. This cannot be undone.
                </p>
                <button style={{
                  padding: '8px 16px', borderRadius: '8px',
                  border: '1px solid rgba(239,68,68,0.5)', background: 'transparent',
                  color: '#ef4444', cursor: 'pointer', fontSize: '12px', fontWeight: 700,
                }}>
                  🗑️ Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, marginBottom: '16px' }}>Plan & Billing</p>
              <div style={{
                padding: '16px', borderRadius: '14px',
                background: `${t.accent}10`, border: `1px solid ${t.accent}40`,
                marginBottom: '20px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontWeight: 800, fontSize: '16px', color: c.text, margin: 0 }}>Free Plan</p>
                  <span style={{
                    padding: '3px 12px', borderRadius: '20px', fontSize: '11px',
                    fontWeight: 700, background: `${t.accent}20`, color: t.accent,
                    border: `1px solid ${t.accent}40`,
                  }}>Active</span>
                </div>
                <p style={{ fontSize: '12px', color: c.textMuted, marginBottom: '12px' }}>
                  Access to all basic features, 50 saved listings, and standard search.
                </p>
                <button style={{
                  padding: '10px 20px', borderRadius: '10px', border: 'none',
                  background: t.gradient, color: '#fff', cursor: 'pointer',
                  fontSize: '13px', fontWeight: 700,
                  boxShadow: `0 4px 12px ${t.accentGlow}`,
                }}>
                  ⭐ Upgrade to Pro
                </button>
              </div>
              {[
                { plan: '🏡 Agent Pro',     price: '$29/mo',  features: ['Unlimited saved listings', 'SparkAPI integration', 'Client sharing tools', 'Priority support'] },
                { plan: '🏢 Brokerage',    price: '$99/mo',  features: ['Everything in Agent Pro', 'Team management', 'Custom branding', 'API access'] },
              ].map(({ plan, price, features }) => (
                <div key={plan} style={{
                  padding: '14px', borderRadius: '12px',
                  background: c.surfaceAlt, border: `1px solid ${c.border}`,
                  marginBottom: '10px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, margin: 0 }}>{plan}</p>
                    <p style={{ fontWeight: 800, fontSize: '14px', color: t.accent, margin: 0 }}>{price}</p>
                  </div>
                  {features.map(f => (
                    <p key={f} style={{ fontSize: '12px', color: c.textMuted, margin: '3px 0', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: '#22c55e' }}>✓</span> {f}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          )}

          {/* Alerts Tab */}
          {activeTab === 'alerts' && (
            <div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, marginBottom: '16px' }}>Saved Searches & Alerts</p>
              <div style={{
                padding: '14px', borderRadius: '12px',
                background: c.surfaceAlt, border: `1px solid ${c.border}`,
                marginBottom: '12px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: c.text, margin: 0 }}>📍 Fargo ND · $200k–$500k</p>
                  <span style={{ fontSize: '10px', color: '#22c55e', fontWeight: 700, background: 'rgba(34,197,94,0.15)', padding: '2px 8px', borderRadius: '10px' }}>Active</span>
                </div>
                <p style={{ fontSize: '11px', color: c.textMuted, margin: '0 0 10px' }}>3+ beds · Single Family · Email daily</p>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{ padding: '5px 12px', borderRadius: '7px', border: `1px solid ${c.border}`, background: 'transparent', color: c.textMuted, cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Edit</button>
                  <button style={{ padding: '5px 12px', borderRadius: '7px', border: '1px solid rgba(239,68,68,0.4)', background: 'transparent', color: '#ef4444', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Delete</button>
                </div>
              </div>
              <button style={{
                width: '100%', padding: '12px', borderRadius: '10px',
                border: `2px dashed ${c.border}`, background: 'transparent',
                color: c.textMuted, cursor: 'pointer', fontSize: '13px',
                fontWeight: 600, transition: 'all 0.2s',
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = t.accent; e.currentTarget.style.color = t.accent }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = c.border; e.currentTarget.style.color = c.textMuted }}
              >
                + Create New Alert
              </button>
              <div style={{ marginTop: '20px' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: c.text, marginBottom: '12px' }}>Notification Preferences</p>
                {[
                  { label: 'New listings matching saved search', checked: true  },
                  { label: 'Price drops on saved homes',         checked: true  },
                  { label: 'Open house announcements',          checked: false },
                  { label: 'Market weekly digest',              checked: true  },
                ].map(({ label, checked: initial }) => {
                  const [on, setOn] = useState(initial)
                  return (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${c.border}` }}>
                      <span style={{ fontSize: '13px', color: c.text }}>{label}</span>
                      <button onClick={() => setOn(!on)}
                        style={{ width: '40px', height: '22px', borderRadius: '11px', border: 'none', background: on ? t.accent : c.border, cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0 }}>
                        <span style={{ position: 'absolute', top: '2px', left: on ? '20px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
