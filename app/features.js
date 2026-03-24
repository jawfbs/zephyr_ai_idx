// ── Master feature registry ───────────────────────────────────────────────
// Each feature has: id, label, icon, description, difficulty (1=easy 5=hard)
// Settings panel reads this list to build toggles automatically.

export const FEATURES = [
  // ── Tier 1 — Pure UI / no API ─────────────────────────────────────────
  {
    id: 'savage_mode',
    label: 'Savage Roast Mode',
    icon: '🔥',
    description: 'Brutally honest AI teardown of any listing',
    difficulty: 1,
    category: 'AI Analysis',
  },
  {
    id: 'hidden_gem',
    label: 'Hidden Gem Radar',
    icon: '💎',
    description: 'Flags undervalued listings with conspiracy-style analysis',
    difficulty: 1,
    category: 'AI Analysis',
  },
  {
    id: 'vibe_roulette',
    label: 'Vibe Roulette',
    icon: '🎰',
    description: 'Spin for a wild property vibe match',
    difficulty: 1,
    category: 'Discovery',
  },
  {
    id: 'emotional_fit',
    label: 'Emotional Fit Matching',
    icon: '💝',
    description: 'Personality quiz → AI love story for matched homes',
    difficulty: 2,
    category: 'AI Analysis',
  },
  {
    id: 'ghost_stories',
    label: 'Ghost of Homes Past',
    icon: '👻',
    description: 'AI-generated dramatized history of older homes',
    difficulty: 2,
    category: 'Storytelling',
  },
  {
    id: 'renovation_blender',
    label: 'Renovation Budget Blender',
    icon: '🔨',
    description: 'Describe wild reno ideas → AI cost + ROI breakdown',
    difficulty: 2,
    category: 'Finance',
  },
  {
    id: 'regret_minimizer',
    label: 'Regret Minimizer',
    icon: '🎯',
    description: 'AI simulates negotiation paths + outcomes',
    difficulty: 2,
    category: 'Finance',
  },
  {
    id: 'parallel_lives',
    label: 'Parallel Lives Simulator',
    icon: '🌀',
    description: 'See branching life timelines for any property',
    difficulty: 2,
    category: 'Storytelling',
  },
  {
    id: 'market_intelligence',
    label: 'Market Intelligence Brief',
    icon: '📊',
    description: 'Real-time AI market analysis per listing',
    difficulty: 2,
    category: 'Finance',
  },
  {
    id: 'maintenance_forecast',
    label: 'Maintenance Forecast',
    icon: '🔧',
    description: '5-10 year AI maintenance cost predictions',
    difficulty: 2,
    category: 'AI Analysis',
  },
  {
    id: 'best_friend_chat',
    label: 'Savage Best Friend Chat',
    icon: '🤖',
    description: 'AI chat persona that roasts your decisions',
    difficulty: 3,
    category: 'AI Analysis',
  },
  {
    id: 'climate_fortune',
    label: 'Climate Fortune Teller',
    icon: '🌡️',
    description: '10-30 year climate projection overlay',
    difficulty: 3,
    category: 'Data',
  },
  {
    id: 'due_diligence',
    label: 'Due Diligence Package',
    icon: '📋',
    description: 'Auto-compiled inspection + title risk report',
    difficulty: 3,
    category: 'Finance',
  },
  {
    id: 'neighborhood_evolution',
    label: 'Neighborhood Evolution',
    icon: '🔭',
    description: '5-10 year AI neighborhood forecast',
    difficulty: 3,
    category: 'Data',
  },
  {
    id: 'renovation_speedrun',
    label: 'Renovation Speedrun',
    icon: '⚡',
    description: '60-second timed reno planning challenge',
    difficulty: 3,
    category: 'Discovery',
  },
]

export const FEATURE_CATEGORIES = ['All', 'AI Analysis', 'Finance', 'Discovery', 'Storytelling', 'Data']

export const DEFAULT_FEATURE_SETTINGS = Object.fromEntries(
  FEATURES.map(f => [f.id, true])
)
