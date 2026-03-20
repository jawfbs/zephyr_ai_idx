// ─────────────────────────────────────────────
// AUTH LOGIC — ZephyrAI IDX
// Account levels: brokerage | team | agent | homebuyer
// ─────────────────────────────────────────────

const PRO_EMAILS = ['test@test.com']

export function getAccountLevel(email) {
  if (!email) return null
  const clean = email.trim().toLowerCase()
  if (PRO_EMAILS.includes(clean)) return 'brokerage'
  return 'homebuyer'
}

export function isProfessional(level) {
  return ['brokerage', 'team', 'agent'].includes(level)
}

export function getLevelLabel(level) {
  return {
    brokerage: 'Brokerage',
    team:      'Team',
    agent:     'Agent',
    homebuyer: 'Homebuyer',
  }[level] || 'Guest'
}

export function getLevelColor(level) {
  return {
    brokerage: '#b8860b',
    team:      '#7b2d8b',
    agent:     '#0077b6',
    homebuyer: '#16a34a',
  }[level] || '#6b7280'
}

export function getLevelBadge(level) {
  return {
    brokerage: '🏢',
    team:      '👥',
    agent:     '🏡',
    homebuyer: '🔑',
  }[level] || '👤'
}
