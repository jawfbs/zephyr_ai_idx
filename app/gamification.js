// ── Gamification engine ──────────────────────────────────────────────────────

export const XP_ACTIONS = {
  VIEW_LISTING:      { xp: 5,   label: 'Viewed a listing',        icon: '👁️'  },
  SAVE_LISTING:      { xp: 10,  label: 'Saved a listing',         icon: '❤️'  },
  SEARCH:            { xp: 3,   label: 'Searched the map',        icon: '🔍'  },
  USE_FILTER:        { xp: 5,   label: 'Used a filter',           icon: '🎯'  },
  VIEW_MAP:          { xp: 8,   label: 'Opened map view',         icon: '🗺️'  },
  CHANGE_MAP_LAYER:  { xp: 4,   label: 'Changed map layer',       icon: '🌐'  },
  VIEW_WALK_SCORE:   { xp: 6,   label: 'Checked Walk Score',      icon: '🚶'  },
  VIEW_CRIME:        { xp: 6,   label: 'Checked crime data',      icon: '🔒'  },
  VIEW_WEATHER:      { xp: 4,   label: 'Checked weather',         icon: '🌤️'  },
  SHARE_LISTING:     { xp: 15,  label: 'Shared a listing',        icon: '📤'  },
  CONTACT_AGENT:     { xp: 20,  label: 'Contacted an agent',      icon: '📞'  },
  FIRST_SEARCH:      { xp: 25,  label: 'First search!',           icon: '🎉'  },
  DAILY_LOGIN:       { xp: 10,  label: 'Daily login bonus',       icon: '📅'  },
  EXPLORE_NEIGHBOR:  { xp: 8,   label: 'Explored neighborhood',   icon: '🏘️'  },
  MORTGAGE_CALC:     { xp: 12,  label: 'Used mortgage calculator', icon: '💰' },
}

export const LEVELS = [
  { level: 1,  title: 'House Hunter',      minXP: 0,    badge: '🏠', color: '#64748b' },
  { level: 2,  title: 'Neighborhood Scout',minXP: 100,  badge: '🔍', color: '#3b82f6' },
  { level: 3,  title: 'Market Watcher',    minXP: 250,  badge: '📊', color: '#8b5cf6' },
  { level: 4,  title: 'Property Pro',      minXP: 500,  badge: '⭐', color: '#f59e0b' },
  { level: 5,  title: 'Real Estate Guru',  minXP: 1000, badge: '🏆', color: '#ef4444' },
  { level: 6,  title: 'ZephyrAI Elite',    minXP: 2000, badge: '💎', color: '#06b6d4' },
  { level: 7,  title: 'Market Legend',     minXP: 5000, badge: '🌟', color: '#f97316' },
]

export const ACHIEVEMENTS = [
  { id: 'first_save',      label: 'First Favorite',    desc: 'Save your first listing',           icon: '❤️',  xp: 50,  condition: s => s.savedCount >= 1 },
  { id: 'five_saves',      label: 'Collector',          desc: 'Save 5 listings',                   icon: '💼',  xp: 75,  condition: s => s.savedCount >= 5 },
  { id: 'map_explorer',    label: 'Map Explorer',       desc: 'Use all map layers',                icon: '🗺️',  xp: 100, condition: s => s.layersUsed?.length >= 4 },
  { id: 'data_nerd',       label: 'Data Nerd',          desc: 'Check walk score, crime & weather', icon: '📈',  xp: 100, condition: s => s.walkscore && s.crimeLookup && s.weatherCheck },
  { id: 'social_butterfly',label: 'Social Butterfly',   desc: 'Share 3 listings',                  icon: '📤',  xp: 75,  condition: s => s.shareCount >= 3 },
  { id: 'power_user',      label: 'Power User',         desc: 'Earn 500 XP',                       icon: '⚡',  xp: 150, condition: s => s.totalXP >= 500 },
  { id: 'daily_3',         label: 'Dedicated',          desc: 'Log in 3 days in a row',            icon: '🔥',  xp: 60,  condition: s => s.loginStreak >= 3 },
  { id: 'filter_master',   label: 'Filter Master',      desc: 'Use every filter type',             icon: '🎛️',  xp: 80,  condition: s => s.filtersUsed?.length >= 4 },
  { id: 'neighborhood_pro',label: 'Neighborhood Pro',   desc: 'Explore 10 neighborhoods',          icon: '🏘️',  xp: 120, condition: s => s.neighborhoodsExplored >= 10 },
  { id: 'centurion',       label: 'Centurion',          desc: 'View 100 listings',                 icon: '💯',  xp: 200, condition: s => s.viewCount >= 100 },
]

export function getLevel(xp) {
  return [...LEVELS].reverse().find(l => xp >= l.minXP) || LEVELS[0]
}

export function getNextLevel(xp) {
  return LEVELS.find(l => l.minXP > xp) || null
}

export function getXPProgress(xp) {
  const current = getLevel(xp)
  const next    = getNextLevel(xp)
  if (!next) return 100
  const range = next.minXP - current.minXP
  const earned = xp - current.minXP
  return Math.round((earned / range) * 100)
}

export function checkAchievements(stats, already = []) {
  return ACHIEVEMENTS.filter(a => !already.includes(a.id) && a.condition(stats))
}

export const DEFAULT_STATS = {
  totalXP:              0,
  viewCount:            0,
  savedCount:           0,
  shareCount:           0,
  searchCount:          0,
  loginStreak:          1,
  layersUsed:           [],
  filtersUsed:          [],
  neighborhoodsExplored:0,
  walkscore:            false,
  crimeLookup:          false,
  weatherCheck:         false,
  achievements:         [],
  xpLog:                [],
  lastLogin:            null,
}

export function addXP(stats, action) {
  const def = XP_ACTIONS[action]
  if (!def) return stats
  const gained = def.xp
  const newXP  = (stats.totalXP || 0) + gained
  const entry  = { action, xp: gained, label: def.label, icon: def.icon, ts: Date.now() }
  return {
    ...stats,
    totalXP: newXP,
    xpLog: [entry, ...(stats.xpLog || [])].slice(0, 50),
  }
}
