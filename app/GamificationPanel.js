'use client'
import { getLevel, getNextLevel, getXPProgress, ACHIEVEMENTS, LEVELS } from './gamification'

export default function GamificationPanel({ c, t, stats, onClose }) {
  const level    = getLevel(stats.totalXP || 0)
  const next     = getNextLevel(stats.totalXP || 0)
  const progress = getXPProgress(stats.totalXP || 0)
  const earned   = (stats.achievements || [])
  const recent   = (stats.xpLog || []).slice(0, 8)

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, backdropFilter: 'blur(6px)',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: c.surface, border: `1px solid ${c.border}`,
          borderRadius: '20px', padding: '28px', width: '520px',
          maxHeight: '85vh', overflowY: 'auto',
          boxShadow: `0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px ${t.accent}30`,
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '52px', height: '52px', borderRadius: '14px',
              background: t.gradient, display: 'flex', alignItems: 'center',
              justifyContent: 'center', fontSize: '26px',
              boxShadow: `0 0 20px ${t.accentGlow}`,
            }}>
              {level.badge}
            </div>
            <div>
              <p style={{ fontWeight: 900, fontSize: '18px', color: c.text, margin: 0 }}>Your Progress</p>
              <p style={{ fontSize: '13px', color: level.color, fontWeight: 700, margin: 0 }}>{level.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: '34px', height: '34px', borderRadius: '8px',
              border: `1px solid ${c.border}`, background: c.surfaceAlt,
              cursor: 'pointer', fontSize: '16px', color: c.textMuted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* XP Bar */}
        <div style={{
          background: c.surfaceAlt, borderRadius: '14px', padding: '16px',
          marginBottom: '20px', border: `1px solid ${c.border}`,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: 800, fontSize: '28px', color: t.accent }}>
              {(stats.totalXP || 0).toLocaleString()} XP
            </span>
            {next && (
              <span style={{ fontSize: '12px', color: c.textMuted }}>
                {next.minXP - (stats.totalXP || 0)} XP to {next.title}
              </span>
            )}
          </div>
          <div style={{ height: '10px', background: c.border, borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              height: '100%', width: `${progress}%`, background: t.gradient,
              borderRadius: '10px',
              transition: 'width 0.8s cubic-bezier(.34,1.56,.64,1)',
              boxShadow: `0 0 10px ${t.accentGlow}`,
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: c.textFaint }}>Level {level.level}</span>
            {next && <span style={{ fontSize: '11px', color: c.textFaint }}>Level {next.level}</span>}
          </div>
        </div>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          {[
            { label: 'Listings Viewed', val: stats.viewCount  || 0,           icon: '👁️' },
            { label: 'Homes Saved',     val: stats.savedCount || 0,           icon: '❤️' },
            { label: 'Shares',          val: stats.shareCount || 0,           icon: '📤' },
            { label: 'Login Streak',    val: `${stats.loginStreak || 1}d`,    icon: '🔥' },
          ].map(({ label, val, icon }) => (
            <div key={label} style={{
              background: c.surfaceAlt, borderRadius: '12px',
              padding: '12px 14px', border: `1px solid ${c.border}`,
            }}>
              <div style={{ fontSize: '20px', marginBottom: '4px' }}>{icon}</div>
              <div style={{ fontWeight: 800, fontSize: '20px', color: c.text }}>{val}</div>
              <div style={{ fontSize: '11px', color: c.textMuted }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Achievements */}
        <div style={{ marginTop: '20px', marginBottom: '16px' }}>
          <p style={{ fontWeight: 800, fontSize: '15px', color: c.text, marginBottom: '12px' }}>
            🏆 Achievements{' '}
            <span style={{ fontSize: '12px', fontWeight: 600, color: c.textMuted }}>
              ({earned.length}/{ACHIEVEMENTS.length})
            </span>
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {ACHIEVEMENTS.map(a => {
              const done = earned.includes(a.id)
              return (
                <div
                  key={a.id}
                  style={{
                    padding: '10px 12px', borderRadius: '12px',
                    background: done ? `${t.accent}15` : c.surfaceAlt,
                    border: `1px solid ${done ? t.accent + '50' : c.border}`,
                    opacity: done ? 1 : 0.5, transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                    <span style={{ fontSize: '18px' }}>{a.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: '12px', color: done ? t.accent : c.text }}>
                      {a.label}
                    </span>
                  </div>
                  <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{a.desc}</p>
                  <p style={{ fontSize: '10px', color: t.accent, margin: '3px 0 0', fontWeight: 700 }}>
                    +{a.xp} XP
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* All Levels */}
        <div style={{ marginTop: '20px' }}>
          <p style={{ fontWeight: 800, fontSize: '15px', color: c.text, marginBottom: '12px' }}>🌟 All Levels</p>
          {LEVELS.map(l => {
            const active = l.level === level.level
            return (
              <div
                key={l.level}
                style={{
                  display: 'flex', alignItems: 'center', gap: '12px',
                  padding: '10px 14px', borderRadius: '10px',
                  background: active ? `${t.accent}15` : 'transparent',
                  border: `1px solid ${active ? t.accent + '40' : 'transparent'}`,
                  marginBottom: '4px',
                }}
              >
                <span style={{ fontSize: '22px' }}>{l.badge}</span>
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 700, fontSize: '13px', color: active ? t.accent : c.text, margin: 0 }}>
                    Lv.{l.level} — {l.title}
                  </p>
                  <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>
                    {l.minXP.toLocaleString()} XP required
                  </p>
                </div>
                {active && (
                  <span style={{
                    fontSize: '11px', fontWeight: 700, color: t.accent,
                    background: `${t.accent}20`, padding: '3px 10px', borderRadius: '20px',
                  }}>
                    Current
                  </span>
                )}
                {(stats.totalXP || 0) >= l.minXP && !active && (
                  <span style={{ fontSize: '16px' }}>✅</span>
                )}
              </div>
            )
          })}
        </div>

        {/* Recent XP Log */}
        {recent.length > 0 && (
          <div style={{ marginTop: '20px' }}>
            <p style={{ fontWeight: 800, fontSize: '15px', color: c.text, marginBottom: '10px' }}>
              ⚡ Recent Activity
            </p>
            {recent.map((entry, i) => (
              <div
                key={i}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '8px 12px', borderRadius: '8px',
                  background: i % 2 === 0 ? c.surfaceAlt : 'transparent',
                  marginBottom: '2px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{entry.icon}</span>
                  <span style={{ fontSize: '12px', color: c.text }}>{entry.label}</span>
                </div>
                <span style={{ fontSize: '12px', fontWeight: 700, color: t.accent }}>
                  +{entry.xp} XP
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
