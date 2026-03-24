'use client'
import { useState } from 'react'
import { FEATURES, FEATURE_CATEGORIES } from './features'

export default function FeatureSettings({ c, t, featureSettings, setFeatureSettings }) {
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = activeCategory === 'All'
    ? FEATURES
    : FEATURES.filter(f => f.category === activeCategory)

  const enabledCount = Object.values(featureSettings).filter(Boolean).length

  const toggleAll = (on) => {
    const next = {}
    FEATURES.forEach(f => { next[f.id] = on })
    setFeatureSettings(next)
  }

  const difficultyLabel = (d) => ['', '⚡ Easy', '🔧 Medium', '🔩 Advanced', '🧪 Complex', '🚀 Expert'][d] || ''
  const difficultyColor = (d) => ['', '#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'][d] || '#94a3b8'

  return (
    <div style={{ padding: '4px 0' }}>
      {/* Summary row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '10px', background: c.surfaceAlt, border: `1px solid ${c.border}`, marginBottom: '10px' }}>
        <span style={{ fontSize: '12px', fontWeight: 700, color: c.text }}>{enabledCount}/{FEATURES.length} features active</span>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button onClick={() => toggleAll(true)}
            style={{ padding: '4px 10px', borderRadius: '6px', border: `1px solid ${t.accent}50`, background: `${t.accent}15`, color: t.accent, cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
            All On
          </button>
          <button onClick={() => toggleAll(false)}
            style={{ padding: '4px 10px', borderRadius: '6px', border: `1px solid ${c.border}`, background: 'transparent', color: c.textMuted, cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
            All Off
          </button>
        </div>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '10px' }}>
        {FEATURE_CATEGORIES.map(cat => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{ padding: '4px 10px', borderRadius: '16px', border: `1px solid ${activeCategory === cat ? t.accent : c.border}`, background: activeCategory === cat ? `${t.accent}20` : 'transparent', color: activeCategory === cat ? t.accent : c.textMuted, cursor: 'pointer', fontSize: '11px', fontWeight: 600, transition: 'all 0.2s' }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Feature list */}
      {filtered.map(feature => {
        const enabled = featureSettings[feature.id] !== false
        return (
          <div key={feature.id}
            style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', padding: '10px 12px', borderRadius: '10px', background: enabled ? `${t.accent}08` : 'transparent', border: `1px solid ${enabled ? t.accent + '30' : c.border}`, marginBottom: '6px', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '1px' }}>{feature.icon}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                <p style={{ fontSize: '12px', fontWeight: 700, color: c.text, margin: 0 }}>{feature.label}</p>
                <span style={{ fontSize: '10px', color: difficultyColor(feature.difficulty), fontWeight: 600 }}>{difficultyLabel(feature.difficulty)}</span>
              </div>
              <p style={{ fontSize: '11px', color: c.textMuted, margin: 0 }}>{feature.description}</p>
            </div>
            <button
              onClick={() => setFeatureSettings(p => ({ ...p, [feature.id]: !enabled }))}
              style={{ width: '38px', height: '22px', borderRadius: '11px', border: 'none', background: enabled ? t.accent : c.border, cursor: 'pointer', position: 'relative', transition: 'background 0.25s', flexShrink: 0, marginTop: '2px' }}>
              <span style={{ position: 'absolute', top: '2px', left: enabled ? '18px' : '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
