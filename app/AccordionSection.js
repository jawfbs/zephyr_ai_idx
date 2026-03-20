'use client'

import { useState } from 'react'
import { ChevronRight, Check, Trees, PawPrint, Building2 } from 'lucide-react'

const CATEGORY_ICONS = { nature: Trees, animal: PawPrint, realestate: Building2 }

export default function AccordionSection({ section, c, t, themeCategory, setThemeCategory, activeTheme, setActiveTheme, THEMES }) {
  const [open, setOpen] = useState(false)

  return (
    <div style={{ marginBottom: '4px' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', borderRadius: '8px', border: 'none', background: open ? c.surfaceAlt : 'transparent', cursor: 'pointer', fontSize: '13px', color: c.text, fontWeight: 600, transition: 'background 0.15s' }}
        onMouseEnter={e => { if (!open) e.currentTarget.style.background = c.surfaceAlt }}
        onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent' }}>
        {section.label}
        <ChevronRight size={14} style={{ color: c.textFaint, transform: open ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <div style={{ paddingLeft: '8px', paddingBottom: '4px' }}>
          {section.isTheme ? (
            <div>
              {/* Category tabs */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '10px', padding: '4px 4px' }}>
                {Object.entries(THEMES).map(([key, cat]) => {
                  const Icon = CATEGORY_ICONS[key] || Building2
                  const isActive = themeCategory === key
                  return (
                    <button key={key} onClick={() => setThemeCategory(key)}
                      style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '3px', padding: '7px 4px', borderRadius: '8px', border: `1px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${t.accent}15` : 'transparent', cursor: 'pointer', color: isActive ? t.accent : c.textMuted, fontSize: '10px', fontWeight: 600, transition: 'all 0.15s' }}>
                      <Icon size={14} />
                      {cat.label}
                    </button>
                  )
                })}
              </div>

              {/* Variants */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {THEMES[themeCategory].variants.map(variant => {
                  const isActive = activeTheme.id === variant.id
                  return (
                    <button key={variant.id} onClick={() => setActiveTheme(variant)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '10px', border: `1px solid ${isActive ? t.accent : c.border}`, background: isActive ? `${variant.accent}15` : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <div style={{ width: '52px', height: '36px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
                        <img src={variant.image} alt={variant.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div style={{ position: 'absolute', inset: 0, background: variant.gradient, opacity: 0.55 }} />
                      </div>
                      <div style={{ textAlign: 'left', flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: c.text, margin: 0 }}>{variant.name}</p>
                        <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                          {[variant.accent, variant.accentLight].map((clr, i) => (
                            <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: clr, border: `1px solid ${c.border}` }} />
                          ))}
                        </div>
                      </div>
                      {isActive && (
                        <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: variant.accent, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <Check size={11} color="#fff" />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            section.items.map(item => (
              <button key={item}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', fontSize: '13px', color: c.textMuted, transition: 'all 0.15s' }}
                onMouseEnter={e => { e.currentTarget.style.background = c.surfaceAlt; e.currentTarget.style.color = c.text }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted }}>
                {item}
                <ChevronRight size={13} style={{ color: c.textFaint }} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
