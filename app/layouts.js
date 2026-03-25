// ── Site Layout / Design System Registry ─────────────────────────────────────
// Each layout defines a complete visual system applied via CSS variables.
// The color theme (accent, gradient) still comes from themes.js and layers on top.

export const LAYOUTS = [
  {
    id: 'default',
    name: 'ZephyrAI',
    description: 'Clean, modern default',
    preview: 'linear-gradient(135deg, #1e1e2e, #27273a)',
    icon: '✦',
    vars: {
      // Typography
      '--font-heading': '"Inter", system-ui, sans-serif',
      '--font-body':    '"Inter", system-ui, sans-serif',
      '--font-weight-heading': '800',
      '--letter-spacing-heading': '-0.01em',

      // Radii
      '--radius-card':   '16px',
      '--radius-btn':    '10px',
      '--radius-input':  '10px',
      '--radius-pill':   '24px',

      // Surfaces (dark mode reference — overridden by colorMode)
      '--surface-glass': 'rgba(255,255,255,0.03)',
      '--surface-border': 'rgba(255,255,255,0.08)',

      // Shadows
      '--shadow-card':  '0 1px 4px rgba(0,0,0,0.06)',
      '--shadow-hover':  '0 8px 32px rgba(0,0,0,0.15)',
      '--shadow-float': '0 16px 48px rgba(0,0,0,0.3)',

      // Animations
      '--transition-fast': '0.15s ease',
      '--transition-base': '0.25s ease',

      // Header
      '--header-height': '58px',
      '--header-blur':   'none',

      // Effects
      '--scanline': 'none',
      '--grid-overlay': 'none',
      '--glow-intensity': '1',
    },
  },

  {
    id: 'bold_tech',
    name: 'Bold Tech',
    description: 'Futuristic · High-energy · Neon accents',
    preview: 'linear-gradient(135deg, #050510, #0a0a1a)',
    icon: '⚡',
    vars: {
      '--font-heading': '"Inter", system-ui, sans-serif',
      '--font-body':    '"Inter", system-ui, sans-serif',
      '--font-weight-heading': '900',
      '--letter-spacing-heading': '-0.03em',

      '--radius-card':  '12px',
      '--radius-btn':   '8px',
      '--radius-input': '8px',
      '--radius-pill':  '6px',

      '--surface-glass': 'rgba(255,255,255,0.04)',
      '--surface-border': 'rgba(0,245,255,0.15)',

      '--shadow-card':  '0 0 0 1px rgba(0,245,255,0.08)',
      '--shadow-hover': '0 0 24px rgba(0,245,255,0.2), 0 8px 32px rgba(0,0,0,0.5)',
      '--shadow-float': '0 0 60px rgba(0,245,255,0.15), 0 24px 60px rgba(0,0,0,0.6)',

      '--transition-fast': '0.1s ease',
      '--transition-base': '0.2s ease',

      '--header-height': '56px',
      '--header-blur':   'blur(20px)',

      '--scanline': 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,245,255,0.015) 2px, rgba(0,245,255,0.015) 4px)',
      '--grid-overlay': 'linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)',
      '--glow-intensity': '1.4',
    },
    // Bold Tech overrides the background and accent palette entirely
    overrides: {
      bg:        '#050510',
      surface:   '#0a0a1a',
      surfaceAlt:'#0f0f22',
      border:    'rgba(0,245,255,0.12)',
      text:      '#f0f4ff',
      textMuted: '#7b8fb0',
      textFaint: '#3d4f6b',
      headerBg:  'rgba(5,5,16,0.85)',
      cardBg:    '#0a0a1a',
      inputBg:   '#0f0f22',
      pillBg:    '#0f0f22',
      pillBorder:'rgba(0,245,255,0.18)',
      searchShadow: '0 0 40px rgba(0,245,255,0.1)',
    },
  },

  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean · Lots of whitespace',
    preview: 'linear-gradient(135deg, #fafafa, #f0f0f0)',
    icon: '◻',
    vars: {
      '--font-heading': '"Inter", system-ui, sans-serif',
      '--font-body':    '"Inter", system-ui, sans-serif',
      '--font-weight-heading': '700',
      '--letter-spacing-heading': '0em',

      '--radius-card':  '8px',
      '--radius-btn':   '6px',
      '--radius-input': '6px',
      '--radius-pill':  '6px',

      '--surface-glass': 'rgba(0,0,0,0.02)',
      '--surface-border': 'rgba(0,0,0,0.08)',

      '--shadow-card':  '0 1px 2px rgba(0,0,0,0.04)',
      '--shadow-hover': '0 4px 12px rgba(0,0,0,0.08)',
      '--shadow-float': '0 8px 24px rgba(0,0,0,0.12)',

      '--transition-fast': '0.1s ease',
      '--transition-base': '0.2s ease',

      '--header-height': '52px',
      '--header-blur':   'none',

      '--scanline': 'none',
      '--grid-overlay': 'none',
      '--glow-intensity': '0.5',
    },
    overrides: {
      bg:        '#fafafa',
      surface:   '#ffffff',
      surfaceAlt:'#f5f5f5',
      border:    'rgba(0,0,0,0.06)',
      text:      '#111111',
      textMuted: '#555555',
      textFaint: '#999999',
      headerBg:  '#ffffff',
      cardBg:    '#ffffff',
      inputBg:   '#f5f5f5',
      pillBg:    '#f5f5f5',
      pillBorder:'#e0e0e0',
      searchShadow: '0 2px 12px rgba(0,0,0,0.06)',
    },
  },

  {
    id: 'glass',
    name: 'Glassmorphism',
    description: 'Frosted glass · Depth layers · Blur',
    preview: 'linear-gradient(135deg, #1a1040, #0d2040)',
    icon: '◈',
    vars: {
      '--font-heading': '"Inter", system-ui, sans-serif',
      '--font-body':    '"Inter", system-ui, sans-serif',
      '--font-weight-heading': '800',
      '--letter-spacing-heading': '-0.02em',

      '--radius-card':  '20px',
      '--radius-btn':   '12px',
      '--radius-input': '12px',
      '--radius-pill':  '30px',

      '--surface-glass': 'rgba(255,255,255,0.07)',
      '--surface-border': 'rgba(255,255,255,0.15)',

      '--shadow-card':  '0 4px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
      '--shadow-hover': '0 16px 40px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)',
      '--shadow-float': '0 32px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.2)',

      '--transition-fast': '0.2s cubic-bezier(.34,1.56,.64,1)',
      '--transition-base': '0.3s cubic-bezier(.34,1.56,.64,1)',

      '--header-height': '62px',
      '--header-blur':   'blur(24px)',

      '--scanline': 'none',
      '--grid-overlay': 'none',
      '--glow-intensity': '1.2',
    },
    overrides: {
      bg:        '#0d0d28',
      surface:   'rgba(255,255,255,0.06)',
      surfaceAlt:'rgba(255,255,255,0.1)',
      border:    'rgba(255,255,255,0.12)',
      text:      '#f0efff',
      textMuted: '#9490cc',
      textFaint: '#5a567a',
      headerBg:  'rgba(13,13,40,0.7)',
      cardBg:    'rgba(255,255,255,0.06)',
      inputBg:   'rgba(255,255,255,0.08)',
      pillBg:    'rgba(255,255,255,0.08)',
      pillBorder:'rgba(255,255,255,0.18)',
      searchShadow: '0 8px 32px rgba(0,0,0,0.3)',
    },
  },

  {
    id: 'editorial',
    name: 'Editorial',
    description: 'Newspaper-inspired · Bold type · Clean grids',
    preview: 'linear-gradient(135deg, #f8f4ef, #ede8e0)',
    icon: '❋',
    vars: {
      '--font-heading': 'Georgia, "Times New Roman", serif',
      '--font-body':    '"Inter", system-ui, sans-serif',
      '--font-weight-heading': '700',
      '--letter-spacing-heading': '-0.01em',

      '--radius-card':  '4px',
      '--radius-btn':   '4px',
      '--radius-input': '4px',
      '--radius-pill':  '4px',

      '--surface-glass': 'rgba(0,0,0,0.02)',
      '--surface-border': 'rgba(0,0,0,0.15)',

      '--shadow-card':  '0 0 0 1px rgba(0,0,0,0.1)',
      '--shadow-hover': '0 4px 0 rgba(0,0,0,0.15)',
      '--shadow-float': '0 8px 0 rgba(0,0,0,0.1)',

      '--transition-fast': '0.1s ease',
      '--transition-base': '0.18s ease',

      '--header-height': '56px',
      '--header-blur':   'none',

      '--scanline': 'none',
      '--grid-overlay': 'none',
      '--glow-intensity': '0.3',
    },
    overrides: {
      bg:        '#f8f4ef',
      surface:   '#fffef9',
      surfaceAlt:'#f0ebe3',
      border:    'rgba(0,0,0,0.12)',
      text:      '#111111',
      textMuted: '#555544',
      textFaint: '#998877',
      headerBg:  '#fffef9',
      cardBg:    '#fffef9',
      inputBg:   '#f0ebe3',
      pillBg:    '#f0ebe3',
      pillBorder:'rgba(0,0,0,0.15)',
      searchShadow: '0 2px 8px rgba(0,0,0,0.06)',
    },
  },
]

export const DEFAULT_LAYOUT_ID = 'default'
