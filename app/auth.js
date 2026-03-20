// ── User account levels ───────────────────────────────────────────────────────

export const ACCOUNT_LEVELS = {
  homebuyer:   { label: 'Homebuyer',    badge: '🔑', color: '#22c55e', professional: false },
  agent:       { label: 'Agent',        badge: '🏡', color: '#3b82f6', professional: true  },
  team:        { label: 'Team',         badge: '👥', color: '#8b5cf6', professional: true  },
  brokerage:   { label: 'Brokerage',   badge: '🏢', color: '#f59e0b', professional: true  },
}

// Returns true if the user level gets access to professional features (SparkAPI, etc.)
export function isProfessional(level) {
  return ACCOUNT_LEVELS[level]?.professional || false
}

export function getLevelLabel(level) {
  return ACCOUNT_LEVELS[level]?.label || 'Homebuyer'
}

export function getLevelColor(level) {
  return ACCOUNT_LEVELS[level]?.color || '#64748b'
}

export function getLevelBadge(level) {
  return ACCOUNT_LEVELS[level]?.badge || '🔑'
}
