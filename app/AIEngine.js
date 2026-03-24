// ── AI Engine — all feature logic ────────────────────────────────────────────
// Uses simulated responses keyed to listing data so every response feels
// unique and real. Drop in a real Claude API key later via /api/claude route.

// ── Savage Roast ─────────────────────────────────────────────────────────────
export function generateSavageRoast(listing) {
  const sqftPer = Math.round(listing.price / listing.sqft)
  const age     = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const dom     = listing.daysOnMarket

  const roasts = [
    `Let's be real — ${listing.sqft} sq ft for ${listing.beds} beds means someone's sleeping in the laundry room. At $${sqftPer}/sqft you're paying premium prices for a floorplan your furniture will hate.`,
    `"${listing.type}" is doing a lot of heavy lifting here. Built in ${listing.yearBuilt || 'an era best forgotten'}, this place has ${age} years of character… and ${age} years of potential plumbing surprises.`,
    dom > 30
      ? `This listing has been sitting for ${dom} days. Even in a slow market, that's a cry for help. Either the price is wrong, something smells weird, or both.`
      : `Listed at ${dom === 0 ? 'just' : dom + ' days'} — sellers are either confident or delusional. In Fargo. In winter.`,
    `$${listing.price?.toLocaleString()} for ${listing.address}? Bold. The neighborhood is fine but let's not pretend the "updated kitchen" isn't code for new cabinet handles and a coat of Benjamin Moore.`,
    `${listing.baths} bathrooms for ${listing.beds} bedrooms means someone's sharing, someone's waiting, and everyone's annoyed by 7:45 AM. Just saying.`,
  ]

  const warnings = [
    age > 20 ? `⚠️ ${age}-year-old home: budget for the roof, the HVAC, and your therapist.` : null,
    sqftPer > 200 ? `⚠️ At $${sqftPer}/sqft you could renovate a warehouse for this money.` : null,
    dom > 45 ? `⚠️ ${dom} days on market. Negotiations should start at least 12% below list.` : null,
    listing.status === 'Pending' ? `⚠️ Already pending — classic FOMO bait. They want you stressed.` : null,
  ].filter(Boolean)

  return {
    headline: roasts[Math.floor(Math.abs(listing.price % roasts.length))],
    warnings,
    verdict: sqftPer > 220
      ? '🚩 Overpriced — walk away unless it has a helipad'
      : dom > 60
      ? '⚠️ Stale — price is wrong or there is a problem'
      : age > 25
      ? '🟡 Proceed with inspection contingency — this house has secrets'
      : '✅ Not terrible — your agent should still lowball first',
    score: Math.max(10, Math.min(95, 75 - (sqftPer > 200 ? 15 : 0) - (dom > 30 ? 10 : 0) - (age > 20 ? 10 : 0))),
  }
}

// ── Hidden Gem Radar ──────────────────────────────────────────────────────────
export function generateHiddenGemAnalysis(listing, allListings) {
  const avgPrice = allListings.reduce((s, l) => s + l.price, 0) / allListings.length
  const avgSqft  = allListings.reduce((s, l) => s + (l.price / l.sqft), 0) / allListings.length
  const ppsf     = listing.price / listing.sqft
  const discount = Math.round(((avgSqft - ppsf) / avgSqft) * 100)
  const dom      = listing.daysOnMarket
  const age      = new Date().getFullYear() - (listing.yearBuilt || 2000)

  const signals = []
  if (discount > 5)  signals.push({ icon: '💰', text: `${discount}% below area average price-per-sqft` })
  if (dom > 20)      signals.push({ icon: '⏰', text: `${dom} days on market — seller motivation likely elevated` })
  if (listing.sqft > 2500 && listing.price < avgPrice) signals.push({ icon: '📐', text: 'Above-average size for below-average price' })
  if (age < 10)      signals.push({ icon: '🏗️', text: `Only ${age} years old — modern systems, low maintenance risk` })
  if (listing.beds >= 4 && listing.price < 350000) signals.push({ icon: '🛏️', text: 'High bedroom count at entry-level price point' })

  const gemScore = Math.min(99, 50 + signals.length * 12 + (discount > 0 ? discount : 0))

  const narratives = [
    `This one is flying under the radar. While buyers chase the flashy listings across town, ${listing.address} sits quietly — ${discount > 0 ? `priced ${discount}% below comparable sqft` : 'priced competitively'} in a zip code with historically strong absorption.`,
    `The algorithm flagged this one. ${listing.daysOnMarket > 20 ? `At ${listing.daysOnMarket} days on market, the seller's motivation window is opening.` : `Fresh to market but the fundamentals are unusually strong.`} Smart money is watching this street.`,
    `Hidden in plain sight: ${listing.type} with ${listing.beds} beds and ${listing.sqft?.toLocaleString()} sqft at $${Math.round(ppsf)}/sqft. The comparable down the block sold for ${Math.round(ppsf * 1.15)}/sqft last quarter.`,
  ]

  return {
    gemScore,
    signals,
    narrative: narratives[listing.id?.charCodeAt(1) % narratives.length] || narratives[0],
    label: gemScore > 80 ? '💎 High-Value Hidden Gem' : gemScore > 65 ? '🔍 Worth a Closer Look' : '📍 Moderate Opportunity',
  }
}

// ── Vibe Roulette ─────────────────────────────────────────────────────────────
export const VIBES = [
  { id: 'midnight_jazz',    label: 'Midnight Jazz Loft',     emoji: '🎷', color: '#7c3aed', desc: 'Dark walls, open plan, character-soaked bones' },
  { id: 'cozy_chaos',       label: "Grandma's Cozy Chaos",   emoji: '🧶', color: '#f59e0b', desc: 'Nooks, warmth, decades of soul baked in' },
  { id: 'silent_monk',      label: 'Silent Monk Retreat',    emoji: '🧘', color: '#06b6d4', desc: 'Zen quiet, clean lines, no neighbor drama' },
  { id: 'apocalypse_chic',  label: 'Apocalypse-Ready Chic',  emoji: '🏚️', color: '#ef4444', desc: 'Solid bones, secluded, self-sufficient potential' },
  { id: 'instagram_glow',   label: 'Instagram Glow-Up',      emoji: '✨', color: '#f472b6', desc: 'Curb appeal, light, staging-ready perfection' },
  { id: 'creative_bunker',  label: 'Creative Bunker',        emoji: '🎨', color: '#22c55e', desc: 'Studio space, garage potential, maker energy' },
  { id: 'family_fortress',  label: 'Family Fortress',        emoji: '🏰', color: '#3b82f6', desc: 'Space, yard, safe street, room to grow' },
  { id: 'investor_special', label: 'Investor Special',       emoji: '💸', color: '#a78bfa', desc: 'Undervalued, needs love, massive upside' },
]

export function matchVibeToListings(vibe, listings) {
  const scoreFn = {
    midnight_jazz:    l => (l.price > 300000 ? 20 : 0) + (l.type === 'Condo' ? 30 : 0) + (l.sqft < 2000 ? 15 : 0),
    cozy_chaos:       l => (l.yearBuilt < 2005 ? 30 : 0) + (l.beds >= 3 ? 20 : 0) + (l.price < 350000 ? 20 : 0),
    silent_monk:      l => (l.daysOnMarket < 5 ? 20 : 0) + (l.type !== 'Condo' ? 20 : 0) + (l.sqft > 1800 ? 20 : 0),
    apocalypse_chic:  l => (l.lotSize ? 25 : 0) + (l.price < 300000 ? 30 : 0) + (l.yearBuilt < 2000 ? 20 : 0),
    instagram_glow:   l => (l.daysOnMarket < 3 ? 30 : 0) + (l.status === 'Active' ? 20 : 0) + (l.price > 400000 ? 20 : 0),
    creative_bunker:  l => (l.type === 'Single Family' ? 20 : 0) + (l.sqft > 2000 ? 20 : 0) + (l.price < 500000 ? 20 : 0),
    family_fortress:  l => (l.beds >= 4 ? 30 : 0) + (l.baths >= 3 ? 20 : 0) + (l.sqft > 2500 ? 20 : 0),
    investor_special: l => (l.daysOnMarket > 15 ? 30 : 0) + (l.price < 300000 ? 30 : 0) + (l.yearBuilt < 2010 ? 10 : 0),
  }
  const fn = scoreFn[vibe.id] || (() => 0)
  return [...listings]
    .map(l => ({ ...l, vibeScore: fn(l) + Math.random() * 15 }))
    .sort((a, b) => b.vibeScore - a.vibeScore)
    .slice(0, 3)
}

// ── Emotional Fit ─────────────────────────────────────────────────────────────
export const PERSONALITY_QUESTIONS = [
  { id: 'noise',    q: 'Your ideal Sunday morning is…', opts: ['Complete silence + coffee', 'Background music + chaos', 'Loud family brunch', 'Recover from Saturday night'] },
  { id: 'space',    q: 'Your relationship with space is…', opts: ['Minimalist monk', 'Cozy maximalist', 'Function over form', 'I want it all'] },
  { id: 'social',   q: 'Neighbors are…', opts: ["Strangers I wave to", 'Future best friends', 'People I avoid', 'Community is everything'] },
  { id: 'future',   q: 'In 5 years this home should…', opts: ['Still be my sanctuary', 'Have kids running around', 'Be an Airbnb cash cow', 'Have tripled in value'] },
  { id: 'commute',  q: 'Your commute philosophy is…', opts: ['I work from home forever', 'Under 20 min only', 'I enjoy the drive', 'What commute — I bike'] },
]

export function generateEmotionalFitNarrative(answers, listing) {
  const styles = {
    noise_0: 'sanctuary-seeker',
    noise_1: 'vibrant-liver',
    noise_2: 'social-hub-builder',
    noise_3: 'night-owl-creative',
    space_0: 'clean-space-devotee',
    space_1: 'warm-nest-builder',
    future_0: 'long-term-nester',
    future_1: 'growing-family',
    future_2: 'investor-mindset',
  }

  const type   = styles[`noise_${answers.noise}`] || 'balanced-buyer'
  const score  = Math.floor(65 + Math.random() * 30)

  const narratives = {
    'sanctuary-seeker': `This ${listing.address} has the quiet energy a sanctuary-seeker craves. The layout offers natural separation — your private world stays private. At ${listing.sqft?.toLocaleString()} sq ft across ${listing.beds} rooms, there's space to breathe without the noise bleeding through. The street is calm, the neighbors are the wave-not-chat type. This is where you write the book.`,
    'vibrant-liver': `Bold choice, but ${listing.address} could absolutely become your stage. The open floor plan begs for Saturday gatherings. ${listing.beds} bedrooms means the crew can stay over. The kitchen layout is social-first — made for people who cook loudly and laugh louder. Your energy will fill this place in about a week.`,
    'growing-family': `${listing.address} feels like the setup chapter of a really good family story. ${listing.beds} beds, ${listing.baths} baths — room for the kids, room for the chaos, room for the dog you're about to get. The yard is the kind that gets mud-footprinted by October. That's not a flaw. That's the dream.`,
    'balanced-buyer': `There's an honest compatibility between you and ${listing.address}. It won't be love at first sight — it's better than that. It fits your life without demanding you change it. The numbers work, the space respects your style, and the location suggests you'll appreciate it more each year.`,
  }

  return {
    score,
    narrative: narratives[type] || narratives['balanced-buyer'],
    compatibilityBreakdown: [
      { label: 'Lifestyle Match',  score: score,        icon: '✨' },
      { label: 'Space Alignment',  score: score - 5,    icon: '📐' },
      { label: 'Future Potential', score: score + 3,    icon: '🔭' },
      { label: 'Vibe Match',       score: score - 8,    icon: '🎯' },
    ],
  }
}

// ── Ghost Stories ─────────────────────────────────────────────────────────────
export function generateGhostStory(listing) {
  const age       = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const decade    = Math.floor((listing.yearBuilt || 2000) / 10) * 10
  const seed      = listing.address?.charCodeAt(0) || 65

  const eras = {
    1940: { label: '1940s', vibe: 'wartime optimism and victory gardens' },
    1950: { label: '1950s', vibe: 'postwar dreams and station wagons' },
    1960: { label: '1960s', vibe: 'folk music and backyard barbecues' },
    1970: { label: '1970s', vibe: 'avocado appliances and shag carpet ambition' },
    1980: { label: '1980s', vibe: 'shoulder pads and business card ambition' },
    1990: { label: '1990s', vibe: 'dial-up internet and video rental nights' },
    2000: { label: '2000s', vibe: 'granite countertop dreams and HGTV inspiration' },
  }

  const era    = eras[decade] || eras[2000]
  const names  = ['Margaret & Earl', 'The Kowalski family', 'Old Doc Henderson', 'The Larson twins', 'A jazz pianist named Ray', 'The Nordberg family']
  const name   = names[seed % names.length]
  const events = [
    `hosted the entire block for Christmas every year without fail`,
    `ran a small business out of the basement that the neighbors never quite figured out`,
    `planted every tree on this street by hand over three decades`,
    `reportedly refused to sell when a developer offered triple the value`,
    `left behind a root cellar that nobody has opened since 1987`,
    `once sheltered a stray dog that somehow became everyone's dog`,
  ]
  const event = events[(seed + age) % events.length]

  return {
    era: era.label,
    story: `In the ${era.label}, when this street still smelled like ${era.vibe}, ${name} called ${listing.address} home for over ${Math.min(age, 30)} years. They ${event}. The walls remember what listing descriptions can't say — this home has been loved, argued in, celebrated in, and grieved in. What you're buying isn't just ${listing.sqft?.toLocaleString()} square feet. You're inheriting a story.`,
    mysteryHint: age > 30
      ? `The previous owners left behind something in the ${['attic', 'basement', 'garden shed', 'crawl space'][seed % 4]}. The agent isn't sure what it is. Nobody is.`
      : null,
    votePrompt: 'Does this story feel true?',
  }
}

// ── Regret Minimizer ──────────────────────────────────────────────────────────
export function generateNegotiationPaths(listing, userBudget, mustHaves) {
  const listPrice = listing.price
  const offers    = [
    { pct: -0.08, label: 'Aggressive Low', color: '#ef4444' },
    { pct: -0.04, label: 'Strategic Offer', color: '#f59e0b' },
    { pct: -0.01, label: 'Near Ask',        color: '#22c55e' },
    { pct:  0.02, label: 'Above Ask',       color: '#3b82f6' },
  ]

  return offers.map(({ pct, label, color }) => {
    const offerPrice   = Math.round(listPrice * (1 + pct))
    const acceptance   = Math.max(15, Math.min(92, 50 - pct * 400))
    const cashRisk     = Math.max(5, 30 + listing.daysOnMarket * -0.5)
    const monthly      = Math.round((offerPrice * 0.8 * 0.065 / 12 * Math.pow(1.065 / 12 + 1, 360)) / (Math.pow(1.065 / 12 + 1, 360) - 1))

    return {
      label,
      color,
      offerPrice,
      acceptance: Math.round(acceptance),
      cashBuyerRisk: Math.round(cashRisk),
      monthly,
      withinBudget: offerPrice <= (userBudget || listPrice * 1.1),
      narrative: pct < -0.05
        ? `Bold move. You save $${Math.round(listPrice * Math.abs(pct)).toLocaleString()} but risk a counter or rejection. Best if DOM is high.`
        : pct < 0
        ? `Smart range. Most sellers counter here — you have room to negotiate and still land the home.`
        : pct < 0.02
        ? `Safe play. Shows good faith without overpaying. Likely to stick in a balanced market.`
        : `Aggressive buy. Near-certain acceptance but you're leaving money on the table. Only justified if you'll regret losing it.`,
    }
  })
}

// ── Parallel Lives ────────────────────────────────────────────────────────────
export function generateParallelLives(listing, variables) {
  const timelines = [
    {
      label: '1 Year In',
      emoji: '🏠',
      probability: 95,
      scenario: `You've settled in. The ${listing.beds}-bedroom layout clicked faster than expected. The neighborhood feels familiar — you know the coffee shop, you have a parking spot strategy. Monthly costs are ${variables.wfh ? 'offset by zero commute costs' : 'manageable with the commute factored in'}.`,
    },
    {
      label: '3 Years In',
      emoji: variables.kids ? '👶' : '🌱',
      probability: 78,
      scenario: variables.kids
        ? `A kid or two have claimed the biggest bedroom. The backyard is where weekends happen now. You've done at least one renovation — probably the kitchen. The neighbors know your name.`
        : `The home has become genuinely yours. You've renovated something you didn't expect to care about. The equity position looks solid — ${Math.round((listing.price * 0.15)).toLocaleString()} in projected appreciation at current rates.`,
    },
    {
      label: '7 Years In',
      emoji: '📈',
      probability: 62,
      scenario: `The neighborhood has changed noticeably. ${listing.city} has grown around you. Your home's value has appreciated — conservative estimate puts it at $${Math.round(listing.price * 1.22).toLocaleString()}. ${variables.retire ? 'Retirement conversations are becoming real.' : 'You have more equity than you expected at this stage.'}`,
    },
    {
      label: 'What If You Walked Away',
      emoji: '😬',
      probability: null,
      scenario: `You kept renting. Rates moved. A similar home in ${listing.city} now lists at $${Math.round(listing.price * 1.18).toLocaleString()}. You look at ${listing.address} on Zillow sometimes. It's fine. You're fine. Mostly fine.`,
      isAlternate: true,
    },
  ]

  return timelines
}

// ── Market Intelligence ───────────────────────────────────────────────────────
export function generateMarketBrief(listing, allListings) {
  const cityListings = allListings.filter(l => l.city === listing.city)
  const avgPrice     = cityListings.reduce((s, l) => s + l.price, 0) / (cityListings.length || 1)
  const avgDom       = cityListings.reduce((s, l) => s + l.daysOnMarket, 0) / (cityListings.length || 1)
  const ppsf         = listing.price / listing.sqft
  const cityPpsf     = cityListings.reduce((s, l) => s + l.price / l.sqft, 0) / (cityListings.length || 1)
  const aboveAvg     = listing.price > avgPrice

  return {
    metrics: [
      { label: 'Price vs Area Avg',   val: `${aboveAvg ? '+' : ''}${Math.round(((listing.price - avgPrice) / avgPrice) * 100)}%`, trend: aboveAvg ? 'up' : 'down' },
      { label: '$/sqft vs Area',      val: `$${Math.round(ppsf)} vs $${Math.round(cityPpsf)}`,                                    trend: ppsf > cityPpsf ? 'up' : 'down' },
      { label: 'DOM vs Area Avg',     val: `${listing.daysOnMarket} vs ${Math.round(avgDom)} days`,                               trend: listing.daysOnMarket < avgDom ? 'good' : 'watch' },
      { label: 'Market Inventory',    val: `${cityListings.length} active in ${listing.city}`,                                    trend: 'neutral' },
    ],
    appreciation: `${Math.round(3 + Math.random() * 5)}% projected 12-month appreciation`,
    brief: `${listing.city} inventory sits at ${cityListings.length} active listings. ${listing.address} is priced ${aboveAvg ? 'above' : 'below'} the ${listing.city} median by ${Math.abs(Math.round(((listing.price - avgPrice) / avgPrice) * 100))}%. At ${listing.daysOnMarket} days on market vs a ${Math.round(avgDom)}-day area average, ${listing.daysOnMarket < avgDom ? 'this listing is moving faster than typical — act with intent.' : 'there may be negotiation room given extended time on market.'}`,
    confidence: Math.floor(72 + Math.random() * 20),
  }
}

// ── Maintenance Forecast ──────────────────────────────────────────────────────
export function generateMaintenanceForecast(listing) {
  const age     = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const sqft    = listing.sqft || 2000

  const items = [
    { system: 'Roof',         years: Math.max(1, 25 - age),  cost: Math.round(sqft * 4.5),  priority: age > 20 ? 'High' : 'Low',    icon: '🏠' },
    { system: 'HVAC',         years: Math.max(1, 15 - age),  cost: 8500,                     priority: age > 15 ? 'High' : 'Medium', icon: '❄️' },
    { system: 'Water Heater', years: Math.max(1, 12 - age),  cost: 1800,                     priority: age > 10 ? 'Medium' : 'Low',  icon: '🚿' },
    { system: 'Windows',      years: Math.max(5, 30 - age),  cost: Math.round(sqft * 1.8),   priority: age > 25 ? 'Medium' : 'Low', icon: '🪟' },
    { system: 'Foundation',   years: 50,                     cost: 15000,                    priority: age > 40 ? 'Monitor' : 'Low', icon: '🏗️' },
    { system: 'Electrical',   years: Math.max(5, 40 - age),  cost: 12000,                    priority: age > 35 ? 'High' : 'Low',   icon: '⚡' },
  ]

  const totalNext5 = items.filter(i => i.years <= 5).reduce((s, i) => s + i.cost, 0)

  return {
    items: items.sort((a, b) => a.years - b.years),
    totalNext5,
    monthly: Math.round(totalNext5 / 60),
    summary: `Budget approximately $${Math.round(totalNext5 / 1000)}k over the next 5 years for this ${age}-year-old home. ${age > 20 ? 'Key systems are approaching end-of-life — negotiate an inspection contingency and get HVAC and roof checked.' : 'Relatively low maintenance risk given age, but standard monitoring applies.'}`,
  }
}

// ── Renovation Blender ────────────────────────────────────────────────────────
export function generateRenovationPlan(listing, idea) {
  const sqft  = listing.sqft || 2000
  const ideas = idea.toLowerCase()

  const presets = [
    {
      match:    ['kitchen', 'cook', 'chef'],
      label:    'Kitchen Renovation',
      low:      45000, high:  85000,
      roi:      72,    months: 3,
      phases:   ['Demo + rough-in (2 weeks)', 'Cabinets + countertops (3 weeks)', 'Appliances + fixtures (1 week)', 'Tile + paint + punch-list (1 week)'],
    },
    {
      match:    ['basement', 'finish', 'rec room', 'bar'],
      label:    'Basement Finishing',
      low:      35000, high: 65000,
      roi:      65,    months: 2,
      phases:   ['Framing + egress (2 weeks)', 'Electrical + plumbing rough-in (2 weeks)', 'Drywall + flooring (2 weeks)', 'Finishes + fixtures (1 week)'],
    },
    {
      match:    ['bath', 'master', 'spa', 'shower'],
      label:    'Bathroom Remodel',
      low:      18000, high: 45000,
      roi:      60,    months: 1,
      phases:   ['Demo + waterproofing (3 days)', 'Tile + plumbing rough-in (1 week)', 'Fixtures + vanity (3 days)', 'Finishes (2 days)'],
    },
    {
      match:    ['garage', 'gym', 'workshop', 'studio'],
      label:    'Garage Conversion',
      low:      25000, high: 55000,
      roi:      55,    months: 2,
      phases:   ['Insulation + drywall (1 week)', 'Electrical + HVAC (1 week)', 'Flooring + finish (1 week)', 'Doors + permits (ongoing)'],
    },
    {
      match:    ['outdoor', 'deck', 'patio', 'yard', 'pool'],
      label:    'Outdoor Living Space',
      low:      20000, high: 80000,
      roi:      50,    months: 2,
      phases:   ['Design + permits (2 weeks)', 'Excavation + foundation (1 week)', 'Build + landscape (3 weeks)', 'Lighting + finishes (1 week)'],
    },
  ]

  const match = presets.find(p => p.match.some(m => ideas.includes(m))) || {
    label:  'Custom Renovation',
    low:    30000, high: 70000,
    roi:    55,    months: 3,
    phases: ['Planning + permits', 'Demo + rough-in', 'Build + finish', 'Punch-list'],
  }

  const newValue = listing.price + Math.round(match.high * (match.roi / 100))

  return {
    ...match,
    newValue,
    valueGain:   newValue - listing.price,
    costMidpoint: Math.round((match.low + match.high) / 2),
    score: match.roi,
    timeline: `${match.months} month${match.months > 1 ? 's' : ''} typical`,
  }
}

// ── Climate Fortune ───────────────────────────────────────────────────────────
export function generateClimateForecast(listing, year) {
  const yearsAhead = year - new Date().getFullYear()
  const lat        = listing.lat || 46.87

  const isMN       = lat > 43 && lat < 49

  const projections = {
    snowDays:     Math.max(0, (isMN ? 65 : 30) + yearsAhead * -0.8),
    extremeCold:  Math.max(0, (isMN ? 20 : 10) + yearsAhead * -0.5),
    heatDays:     (isMN ? 5 : 15) + yearsAhead * 1.2,
    floodRisk:    Math.min(100, 5 + yearsAhead * 0.4),
    stormEvents:  3 + yearsAhead * 0.2,
  }

  return {
    year,
    projections,
    narrative: `By ${year}, ${listing.city} will experience approximately ${Math.round(projections.snowDays)} snow days per year — ${projections.snowDays < 60 ? 'down from today\'s average' : 'consistent with current patterns'}. Summer heat events above 90°F will increase to ${Math.round(projections.heatDays)} days annually. ${projections.floodRisk > 15 ? `Flood risk in this area increases to ${Math.round(projections.floodRisk)}% likelihood per decade — review elevation and drainage.` : 'Flood risk remains low for this location through the projection window.'} ${isMN ? 'Fargo winters will remain significant but warming trends suggest milder shoulder seasons.' : ''}`,
    recommendation: projections.floodRisk > 20
      ? '⚠️ Consider flood insurance and site drainage evaluation'
      : projections.heatDays > 25
      ? '⚠️ Future cooling costs will rise — prioritize HVAC efficiency'
      : '✅ Climate profile remains favorable for this location',
  }
}

// ── Due Diligence ─────────────────────────────────────────────────────────────
export function generateDueDiligencePackage(listing) {
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const seed = listing.id?.charCodeAt(1) || 50

  const risks = [
    age > 30  ? { level: 'High',   item: 'Roof & envelope', detail: `${age}-year-old home — roof, fascia, and soffits should be professionally assessed` } : null,
    age > 20  ? { level: 'Medium', item: 'HVAC systems',    detail: 'Equipment approaching or past typical lifespan — request service records' } : null,
    seed > 70 ? { level: 'Medium', item: 'Radon testing',   detail: `${listing.state} averages above EPA action level — $150 test recommended pre-offer` } : null,
    age > 40  ? { level: 'High',   item: 'Electrical',      detail: 'Older wiring may predate modern code — budget for panel inspection and potential upgrade' } : null,
               { level: 'Low',    item: 'Title search',     detail: 'Standard 30-year chain of title recommended — flag any gaps before closing' },
               { level: 'Low',    item: 'Survey',           detail: 'Boundary survey recommended if lot lines are unclear or fencing exists' },
  ].filter(Boolean)

  const checklist = [
    { done: false, item: 'Order professional home inspection', priority: 1 },
    { done: false, item: 'Request seller disclosures + HOA docs', priority: 1 },
    { done: false, item: 'Review title commitment', priority: 2 },
    { done: false, item: 'Test radon levels', priority: seed > 70 ? 1 : 3 },
    { done: false, item: 'Verify permit history on any additions', priority: 2 },
    { done: false, item: 'Confirm utility costs with seller', priority: 2 },
    { done: false, item: 'Check flood zone status (FEMA map)', priority: 2 },
    { done: false, item: 'Review survey or plot plan', priority: 3 },
  ].sort((a, b) => a.priority - b.priority)

  return { risks, checklist, riskScore: risks.filter(r => r.level === 'High').length > 1 ? 'Elevated' : risks.filter(r => r.level === 'Medium').length > 1 ? 'Moderate' : 'Low' }
}
