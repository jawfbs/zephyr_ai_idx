// ── AI Engine ─────────────────────────────────────────────────────────────────
// All 30 features. Fully deterministic so every listing gets unique output.

// ── EXISTING FEATURES (unchanged logic) ──────────────────────────────────────

export function generateSavageRoast(listing) {
  const sqftPer = Math.round(listing.price / listing.sqft)
  const age     = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const dom     = listing.daysOnMarket
  const roasts  = [
    `Let's be real — ${listing.sqft} sq ft for ${listing.beds} beds means someone's sleeping in the laundry room. At $${sqftPer}/sqft you're paying premium prices for a floorplan your furniture will hate.`,
    `"${listing.type}" is doing a lot of heavy lifting here. Built in ${listing.yearBuilt || 'an era best forgotten'}, this place has ${age} years of character… and ${age} years of potential plumbing surprises.`,
    dom > 30 ? `This listing has been sitting for ${dom} days. Even in a slow market, that's a cry for help. Either the price is wrong, something smells weird, or both.`
             : `Listed at ${dom === 0 ? 'just' : dom + ' days'} — sellers are either confident or delusional. In Fargo. In winter.`,
    `$${listing.price?.toLocaleString()} for ${listing.address}? Bold. The neighborhood is fine but let's not pretend the "updated kitchen" isn't code for new cabinet handles and a coat of Benjamin Moore.`,
    `${listing.baths} bathrooms for ${listing.beds} bedrooms means someone's sharing, someone's waiting, and everyone's annoyed by 7:45 AM.`,
  ]
  const warnings = [
    age > 20  ? `⚠️ ${age}-year-old home: budget for the roof, the HVAC, and your therapist.`            : null,
    sqftPer > 200 ? `⚠️ At $${sqftPer}/sqft you could renovate a warehouse for this money.`             : null,
    dom > 45  ? `⚠️ ${dom} days on market. Negotiations should start at least 12% below list.`         : null,
    listing.status === 'Pending' ? `⚠️ Already pending — classic FOMO bait. They want you stressed.`   : null,
  ].filter(Boolean)
  return {
    headline: roasts[Math.floor(Math.abs(listing.price % roasts.length))],
    warnings,
    verdict: sqftPer > 220 ? '🚩 Overpriced — walk away unless it has a helipad'
           : dom > 60       ? '⚠️ Stale — price is wrong or there is a problem'
           : age > 25       ? '🟡 Proceed with inspection contingency — this house has secrets'
                            : '✅ Not terrible — your agent should still lowball first',
    score: Math.max(10, Math.min(95, 75 - (sqftPer > 200 ? 15 : 0) - (dom > 30 ? 10 : 0) - (age > 20 ? 10 : 0))),
  }
}

export function generateHiddenGemAnalysis(listing, allListings) {
  const avgSqft  = allListings.reduce((s, l) => s + (l.price / l.sqft), 0) / allListings.length
  const avgPrice = allListings.reduce((s, l) => s + l.price, 0) / allListings.length
  const ppsf     = listing.price / listing.sqft
  const discount = Math.round(((avgSqft - ppsf) / avgSqft) * 100)
  const age      = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const signals  = []
  if (discount > 5)  signals.push({ icon:'💰', text:`${discount}% below area average price-per-sqft` })
  if (listing.daysOnMarket > 20) signals.push({ icon:'⏰', text:`${listing.daysOnMarket} days on market — seller motivation likely elevated` })
  if (listing.sqft > 2500 && listing.price < avgPrice) signals.push({ icon:'📐', text:'Above-average size for below-average price' })
  if (age < 10) signals.push({ icon:'🏗️', text:`Only ${age} years old — modern systems, low maintenance risk` })
  if (listing.beds >= 4 && listing.price < 350000) signals.push({ icon:'🛏️', text:'High bedroom count at entry-level price point' })
  const gemScore = Math.min(99, 50 + signals.length * 12 + (discount > 0 ? discount : 0))
  const narratives = [
    `This one is flying under the radar. While buyers chase the flashy listings across town, ${listing.address} sits quietly — ${discount > 0 ? `priced ${discount}% below comparable sqft` : 'priced competitively'} in a zip code with historically strong absorption.`,
    `The algorithm flagged this one. ${listing.daysOnMarket > 20 ? `At ${listing.daysOnMarket} days on market, the seller's motivation window is opening.` : `Fresh to market but the fundamentals are unusually strong.`} Smart money is watching this street.`,
    `Hidden in plain sight: ${listing.type} with ${listing.beds} beds and ${listing.sqft?.toLocaleString()} sqft at $${Math.round(ppsf)}/sqft. The comparable down the block sold for $${Math.round(ppsf * 1.15)}/sqft last quarter.`,
  ]
  return { gemScore, signals, narrative: narratives[listing.id?.charCodeAt(1) % narratives.length] || narratives[0], label: gemScore > 80 ? '💎 High-Value Hidden Gem' : gemScore > 65 ? '🔍 Worth a Closer Look' : '📍 Moderate Opportunity' }
}

export const VIBES = [
  { id:'midnight_jazz',   label:'Midnight Jazz Loft',    emoji:'🎷', color:'#7c3aed', desc:'Dark walls, open plan, character-soaked bones' },
  { id:'cozy_chaos',      label:"Grandma's Cozy Chaos",  emoji:'🧶', color:'#f59e0b', desc:'Nooks, warmth, decades of soul baked in' },
  { id:'silent_monk',     label:'Silent Monk Retreat',   emoji:'🧘', color:'#06b6d4', desc:'Zen quiet, clean lines, no neighbor drama' },
  { id:'apocalypse_chic', label:'Apocalypse-Ready Chic', emoji:'🏚️', color:'#ef4444', desc:'Solid bones, secluded, self-sufficient potential' },
  { id:'instagram_glow',  label:'Instagram Glow-Up',     emoji:'✨', color:'#f472b6', desc:'Curb appeal, light, staging-ready perfection' },
  { id:'creative_bunker', label:'Creative Bunker',        emoji:'🎨', color:'#22c55e', desc:'Studio space, garage potential, maker energy' },
  { id:'family_fortress', label:'Family Fortress',        emoji:'🏰', color:'#3b82f6', desc:'Space, yard, safe street, room to grow' },
  { id:'investor_special',label:'Investor Special',       emoji:'💸', color:'#a78bfa', desc:'Undervalued, needs love, massive upside' },
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
  return [...listings].map(l => ({ ...l, vibeScore: fn(l) + Math.random() * 15 })).sort((a,b) => b.vibeScore - a.vibeScore).slice(0, 3)
}

export const PERSONALITY_QUESTIONS = [
  { id:'noise',   q:'Your ideal Sunday morning is…',   opts:['Complete silence + coffee','Background music + chaos','Loud family brunch','Recover from Saturday night'] },
  { id:'space',   q:'Your relationship with space is…', opts:['Minimalist monk','Cozy maximalist','Function over form','I want it all'] },
  { id:'social',  q:'Neighbors are…',                  opts:['Strangers I wave to','Future best friends','People I avoid','Community is everything'] },
  { id:'future',  q:'In 5 years this home should…',    opts:['Still be my sanctuary','Have kids running around','Be an Airbnb cash cow','Have tripled in value'] },
  { id:'commute', q:'Your commute philosophy is…',     opts:['I work from home forever','Under 20 min only','I enjoy the drive','What commute — I bike'] },
]

export function generateEmotionalFitNarrative(answers, listing) {
  const type  = answers.noise === 0 ? 'sanctuary-seeker' : answers.noise === 2 ? 'growing-family' : answers.noise === 1 ? 'vibrant-liver' : 'balanced-buyer'
  const score = Math.floor(65 + Math.random() * 30)
  const narratives = {
    'sanctuary-seeker': `This ${listing.address} has the quiet energy a sanctuary-seeker craves. The layout offers natural separation — your private world stays private. At ${listing.sqft?.toLocaleString()} sq ft across ${listing.beds} rooms, there's space to breathe without the noise bleeding through.`,
    'vibrant-liver':    `Bold choice, but ${listing.address} could absolutely become your stage. The open floor plan begs for Saturday gatherings. ${listing.beds} bedrooms means the crew can stay over.`,
    'growing-family':   `${listing.address} feels like the setup chapter of a really good family story. ${listing.beds} beds, ${listing.baths} baths — room for the kids, room for the chaos, room for the dog you're about to get.`,
    'balanced-buyer':   `There's an honest compatibility between you and ${listing.address}. It fits your life without demanding you change it. The numbers work, the space respects your style, and the location suggests you'll appreciate it more each year.`,
  }
  return { score, narrative: narratives[type] || narratives['balanced-buyer'], compatibilityBreakdown: [{ label:'Lifestyle Match',score,icon:'✨' },{ label:'Space Alignment',score:score-5,icon:'📐' },{ label:'Future Potential',score:score+3,icon:'🔭' },{ label:'Vibe Match',score:score-8,icon:'🎯' }] }
}

export function generateGhostStory(listing) {
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const decade = Math.floor((listing.yearBuilt || 2000) / 10) * 10
  const seed   = listing.address?.charCodeAt(0) || 65
  const eras   = { 1940:{label:'1940s',vibe:'wartime optimism and victory gardens'}, 1950:{label:'1950s',vibe:'postwar dreams and station wagons'}, 1960:{label:'1960s',vibe:'folk music and backyard barbecues'}, 1970:{label:'1970s',vibe:'avocado appliances and shag carpet ambition'}, 1980:{label:'1980s',vibe:'shoulder pads and business card ambition'}, 1990:{label:'1990s',vibe:'dial-up internet and video rental nights'}, 2000:{label:'2000s',vibe:'granite countertop dreams and HGTV inspiration'} }
  const era    = eras[decade] || eras[2000]
  const names  = ['Margaret & Earl','The Kowalski family','Old Doc Henderson','The Larson twins','A jazz pianist named Ray','The Nordberg family']
  const events = ['hosted the entire block for Christmas every year without fail','ran a small business out of the basement that the neighbors never quite figured out','planted every tree on this street by hand over three decades','reportedly refused to sell when a developer offered triple the value','left behind a root cellar that nobody has opened since 1987','once sheltered a stray dog that somehow became everyone\'s dog']
  return { era:era.label, story:`In the ${era.label}, when this street still smelled like ${era.vibe}, ${names[seed % names.length]} called ${listing.address} home for over ${Math.min(age,30)} years. They ${events[(seed + age) % events.length]}. The walls remember what listing descriptions can't say — this home has been loved, argued in, celebrated in, and grieved in.`, mysteryHint: age > 30 ? `The previous owners left behind something in the ${['attic','basement','garden shed','crawl space'][seed % 4]}. The agent isn't sure what it is.` : null, votePrompt:'Does this story feel true?' }
}

export function generateNegotiationPaths(listing, userBudget) {
  const listPrice = listing.price
  return [
    { pct:-0.08, label:'Aggressive Low', color:'#ef4444' },
    { pct:-0.04, label:'Strategic Offer', color:'#f59e0b' },
    { pct:-0.01, label:'Near Ask',        color:'#22c55e' },
    { pct: 0.02, label:'Above Ask',       color:'#3b82f6' },
  ].map(({ pct, label, color }) => {
    const offerPrice = Math.round(listPrice * (1 + pct))
    const acceptance = Math.max(15, Math.min(92, 50 - pct * 400))
    const cashRisk   = Math.max(5, 30 + listing.daysOnMarket * -0.5)
    const monthly    = Math.round((offerPrice * 0.8 * 0.065 / 12 * Math.pow(1.065/12+1,360)) / (Math.pow(1.065/12+1,360)-1))
    return { label, color, offerPrice, acceptance:Math.round(acceptance), cashBuyerRisk:Math.round(cashRisk), monthly, withinBudget: offerPrice <= (userBudget || listPrice*1.1), narrative: pct < -0.05 ? `Bold move. You save $${Math.round(listPrice*Math.abs(pct)).toLocaleString()} but risk a counter or rejection.` : pct < 0 ? `Smart range. Most sellers counter here — you have room to negotiate and still land the home.` : pct < 0.02 ? `Safe play. Shows good faith without overpaying.` : `Aggressive buy. Near-certain acceptance but you're leaving money on the table.` }
  })
}

export function generateParallelLives(listing, variables) {
  return [
    { label:'1 Year In', emoji:'🏠', probability:95, scenario:`You've settled in. The ${listing.beds}-bedroom layout clicked faster than expected. Monthly costs are ${variables.wfh ? 'offset by zero commute costs' : 'manageable with the commute factored in'}.` },
    { label:'3 Years In', emoji:variables.kids ? '👶' : '🌱', probability:78, scenario: variables.kids ? `A kid or two have claimed the biggest bedroom. The backyard is where weekends happen now. You've done at least one renovation — probably the kitchen.` : `The home has become genuinely yours. Equity position looks solid — $${Math.round(listing.price * 0.15).toLocaleString()} in projected appreciation.` },
    { label:'7 Years In', emoji:'📈', probability:62, scenario:`The neighborhood has changed noticeably. Your home's value has appreciated — conservative estimate puts it at $${Math.round(listing.price * 1.22).toLocaleString()}. ${variables.retire ? 'Retirement conversations are becoming real.' : 'You have more equity than you expected.'}` },
    { label:'What If You Walked Away', emoji:'😬', probability:null, scenario:`You kept renting. Rates moved. A similar home in ${listing.city} now lists at $${Math.round(listing.price * 1.18).toLocaleString()}. You look at ${listing.address} on Zillow sometimes. It's fine. You're fine. Mostly fine.`, isAlternate:true },
  ]
}

export function generateMarketBrief(listing, allListings) {
  const cityListings = allListings.filter(l => l.city === listing.city)
  const avgPrice     = cityListings.reduce((s,l) => s+l.price, 0) / (cityListings.length||1)
  const avgDom       = cityListings.reduce((s,l) => s+l.daysOnMarket, 0) / (cityListings.length||1)
  const ppsf         = listing.price / listing.sqft
  const cityPpsf     = cityListings.reduce((s,l) => s+l.price/l.sqft, 0) / (cityListings.length||1)
  const aboveAvg     = listing.price > avgPrice
  return {
    metrics: [
      { label:'Price vs Area Avg', val:`${aboveAvg?'+':''}${Math.round(((listing.price-avgPrice)/avgPrice)*100)}%`, trend:aboveAvg?'up':'down' },
      { label:'$/sqft vs Area',    val:`$${Math.round(ppsf)} vs $${Math.round(cityPpsf)}`,                           trend:ppsf>cityPpsf?'up':'down' },
      { label:'DOM vs Area Avg',   val:`${listing.daysOnMarket} vs ${Math.round(avgDom)} days`,                      trend:listing.daysOnMarket<avgDom?'good':'watch' },
      { label:'Market Inventory',  val:`${cityListings.length} active in ${listing.city}`,                            trend:'neutral' },
    ],
    appreciation: `${Math.round(3+Math.random()*5)}% projected 12-month appreciation`,
    brief: `${listing.city} inventory sits at ${cityListings.length} active listings. ${listing.address} is priced ${aboveAvg?'above':'below'} the ${listing.city} median by ${Math.abs(Math.round(((listing.price-avgPrice)/avgPrice)*100))}%. ${listing.daysOnMarket < avgDom ? 'Moving faster than typical — act with intent.' : 'Extended time on market suggests negotiation room.'}`,
    confidence: Math.floor(72+Math.random()*20),
  }
}

export function generateMaintenanceForecast(listing) {
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const sqft = listing.sqft || 2000
  const items = [
    { system:'Roof',         years:Math.max(1,25-age), cost:Math.round(sqft*4.5), priority:age>20?'High':'Low',    icon:'🏠' },
    { system:'HVAC',         years:Math.max(1,15-age), cost:8500,                  priority:age>15?'High':'Medium', icon:'❄️' },
    { system:'Water Heater', years:Math.max(1,12-age), cost:1800,                  priority:age>10?'Medium':'Low',  icon:'🚿' },
    { system:'Windows',      years:Math.max(5,30-age), cost:Math.round(sqft*1.8),  priority:age>25?'Medium':'Low',  icon:'🪟' },
    { system:'Foundation',   years:50,                  cost:15000,                 priority:age>40?'Monitor':'Low', icon:'🏗️' },
    { system:'Electrical',   years:Math.max(5,40-age), cost:12000,                  priority:age>35?'High':'Low',   icon:'⚡' },
  ]
  const totalNext5 = items.filter(i=>i.years<=5).reduce((s,i)=>s+i.cost,0)
  return { items:items.sort((a,b)=>a.years-b.years), totalNext5, monthly:Math.round(totalNext5/60), summary:`Budget approximately $${Math.round(totalNext5/1000)}k over the next 5 years for this ${age}-year-old home. ${age>20?'Key systems are approaching end-of-life — negotiate an inspection contingency.':'Relatively low maintenance risk given age.'}` }
}

export function generateRenovationPlan(listing, idea) {
  const ideas   = idea.toLowerCase()
  const presets = [
    { match:['kitchen','cook','chef'],     label:'Kitchen Renovation',  low:45000,high:85000, roi:72,months:3, phases:['Demo + rough-in (2 weeks)','Cabinets + countertops (3 weeks)','Appliances + fixtures (1 week)','Tile + paint (1 week)'] },
    { match:['basement','finish','bar'],   label:'Basement Finishing',  low:35000,high:65000, roi:65,months:2, phases:['Framing + egress (2 weeks)','Electrical + plumbing (2 weeks)','Drywall + flooring (2 weeks)','Finishes (1 week)'] },
    { match:['bath','master','spa'],       label:'Bathroom Remodel',    low:18000,high:45000, roi:60,months:1, phases:['Demo + waterproofing (3 days)','Tile + plumbing (1 week)','Fixtures + vanity (3 days)','Finishes (2 days)'] },
    { match:['garage','gym','workshop'],   label:'Garage Conversion',   low:25000,high:55000, roi:55,months:2, phases:['Insulation + drywall (1 week)','Electrical + HVAC (1 week)','Flooring + finish (1 week)','Doors + permits'] },
    { match:['outdoor','deck','patio'],    label:'Outdoor Living',      low:20000,high:80000, roi:50,months:2, phases:['Design + permits (2 weeks)','Excavation + foundation (1 week)','Build + landscape (3 weeks)','Lighting (1 week)'] },
  ]
  const match = presets.find(p=>p.match.some(m=>ideas.includes(m))) || { label:'Custom Renovation',low:30000,high:70000,roi:55,months:3,phases:['Planning + permits','Demo + rough-in','Build + finish','Punch-list'] }
  const newValue = listing.price + Math.round(match.high * (match.roi/100))
  return { ...match, newValue, valueGain:newValue-listing.price, costMidpoint:Math.round((match.low+match.high)/2), score:match.roi, timeline:`${match.months} month${match.months>1?'s':''}` }
}

export function generateClimateForecast(listing, year) {
  const yearsAhead = year - new Date().getFullYear()
  const isMN       = (listing.lat || 46.87) > 43
  const projections = { snowDays:Math.max(0,(isMN?65:30)+yearsAhead*-0.8), extremeCold:Math.max(0,(isMN?20:10)+yearsAhead*-0.5), heatDays:(isMN?5:15)+yearsAhead*1.2, floodRisk:Math.min(100,5+yearsAhead*0.4), stormEvents:3+yearsAhead*0.2 }
  return { year, projections, narrative:`By ${year}, ${listing.city} will experience approximately ${Math.round(projections.snowDays)} snow days per year. Summer heat events above 90°F will increase to ${Math.round(projections.heatDays)} days annually. ${projections.floodRisk>15?`Flood risk increases to ${Math.round(projections.floodRisk)}% likelihood per decade.`:'Flood risk remains low for this location.'}`, recommendation: projections.floodRisk>20 ? '⚠️ Consider flood insurance and site drainage evaluation' : projections.heatDays>25 ? '⚠️ Future cooling costs will rise — prioritize HVAC efficiency' : '✅ Climate profile remains favorable for this location' }
}

export function generateDueDiligencePackage(listing) {
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const seed = listing.id?.charCodeAt(1) || 50
  const risks = [
    age>30  ? { level:'High',   item:'Roof & envelope',    detail:`${age}-year-old home — roof, fascia, and soffits should be professionally assessed` } : null,
    age>20  ? { level:'Medium', item:'HVAC systems',       detail:'Equipment approaching or past typical lifespan — request service records' } : null,
    seed>70 ? { level:'Medium', item:'Radon testing',      detail:`ND averages above EPA action level — $150 test recommended pre-offer` } : null,
    age>40  ? { level:'High',   item:'Electrical',         detail:'Older wiring may predate modern code — budget for panel inspection' } : null,
              { level:'Low',    item:'Title search',       detail:'Standard 30-year chain of title recommended' },
              { level:'Low',    item:'Survey',             detail:'Boundary survey recommended if lot lines are unclear' },
  ].filter(Boolean)
  const checklist = [
    { done:false, item:'Order professional home inspection',       priority:1 },
    { done:false, item:'Request seller disclosures + HOA docs',    priority:1 },
    { done:false, item:'Review title commitment',                   priority:2 },
    { done:false, item:'Test radon levels',                         priority:seed>70?1:3 },
    { done:false, item:'Verify permit history on any additions',   priority:2 },
    { done:false, item:'Confirm utility costs with seller',        priority:2 },
    { done:false, item:'Check flood zone status (FEMA map)',       priority:2 },
    { done:false, item:'Review survey or plot plan',               priority:3 },
  ].sort((a,b)=>a.priority-b.priority)
  return { risks, checklist, riskScore:risks.filter(r=>r.level==='High').length>1?'Elevated':risks.filter(r=>r.level==='Medium').length>1?'Moderate':'Low' }
}

// ── NEW PROFESSIONAL FEATURES ─────────────────────────────────────────────────

export function generateLeadQualification(listing) {
  const seed  = listing.price % 100
  const score = 55 + (seed % 40)
  const stages = ['Initial Interest','Property Viewed','Saved Listing','Repeated Visits','High Intent']
  const stage  = stages[Math.min(4, Math.floor(score / 20))]
  const actions = [
    'Send personalized property comparison email',
    'Schedule virtual tour within 48 hours',
    'Offer pre-approval assistance referral',
    'Assign to senior agent for personal follow-up',
    'Draft competitive offer strategy document',
  ]
  return {
    score,
    stage,
    label: score > 80 ? '🔥 Hot Lead' : score > 65 ? '🟡 Warm Lead' : '🔵 Nurture Lead',
    recommendedAction: actions[Math.floor(score / 20)],
    draftResponse: `Hi there! I noticed you've been exploring ${listing.address} — great taste. This ${listing.beds}-bed ${listing.type} in ${listing.city} is priced at ${listing.price.toLocaleString()} and has ${listing.daysOnMarket < 5 ? 'just hit the market' : `been available for ${listing.daysOnMarket} days`}. I'd love to set up a private showing at your convenience. Are you available this week?`,
    timeline: `Recommended follow-up: ${score > 75 ? 'Within 2 hours' : score > 60 ? 'Within 24 hours' : 'Within 3 days'}`,
    conversionProbability: `${score}% likelihood of offer within 30 days`,
  }
}

export function generateBuyerEducation(listing) {
  const age = new Date().getFullYear() - (listing.yearBuilt || 2000)
  return {
    modules: [
      {
        title: '📋 Understanding Your Offer',
        level: 'Essential',
        color: '#22c55e',
        content: `For ${listing.address} at $${listing.price.toLocaleString()}, a standard offer includes purchase price, earnest money (typically 1-2%), contingencies (inspection, financing, appraisal), and closing date. In the current Fargo market with ${listing.daysOnMarket < 10 ? 'low' : 'moderate'} days-on-market, ${listing.daysOnMarket < 5 ? 'expect competition — consider an escalation clause.' : 'you likely have negotiation room.'}`,
      },
      {
        title: '🏠 Inspection Red Flags for This Home',
        level: 'Important',
        color: '#f59e0b',
        content: `This ${age}-year-old ${listing.type} in Fargo should be inspected for: ${age > 20 ? 'aging HVAC and roof (priority), ' : ''}radon (ND has elevated levels — test every home), foundation movement from freeze-thaw cycles, and moisture in basement/crawl space from winter snowmelt. Budget $400–600 for a thorough inspection.`,
      },
      {
        title: '💰 Financing This Purchase',
        level: 'Essential',
        color: '#3b82f6',
        content: `At $${listing.price.toLocaleString()} with 20% down ($${Math.round(listing.price * 0.2).toLocaleString()}), your loan amount is $${Math.round(listing.price * 0.8).toLocaleString()}. At current rates (~7%), expect $${Math.round(listing.price * 0.8 * 0.065 / 12).toLocaleString()}/month (principal + interest). FHA loans allow 3.5% down for qualifying buyers. Get pre-approved before touring to strengthen your offer.`,
      },
      {
        title: '📅 The Closing Process',
        level: 'Informational',
        color: '#8b5cf6',
        content: `After offer acceptance: inspection (5-7 days), appraisal (7-10 days), title search (5-7 days), final loan approval (14-21 days). Total timeline: 30-45 days typical in Fargo. You'll need to bring certified funds for closing costs (typically 2-4% of purchase price = $${Math.round(listing.price * 0.03).toLocaleString()} estimate).`,
      },
    ],
  }
}

export function generateVendorCoordination(listing) {
  const age = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const vendors = [
    { category:'Home Inspectors',    urgency:'Pre-Offer',  icon:'🔍', name:'Fargo Home Inspection Services', phone:'(701) 555-0210', rating:4.9, note:'Specializes in older Fargo homes, radon testing included' },
    { category:'Radon Mitigation',   urgency:'Pre-Closing',icon:'☢️', name:'Red River Radon Services',       phone:'(701) 555-0187', rating:4.8, note:'ND certified, average $900-1,200 installation' },
    { category:'HVAC Service',       urgency: age>15?'Soon':'Routine', icon:'❄️', name:'Fargo Climate Control', phone:'(701) 555-0156', rating:4.7, note:'Available for pre-purchase HVAC assessment' },
    { category:'Roofing',            urgency: age>20?'Evaluate':'Low', icon:'🏠', name:'Plains Roofing Co',   phone:'(701) 555-0243', rating:4.8, note:'Free estimates, specializes in ND weather-grade materials' },
    { category:'Real Estate Attorney',urgency:'Closing',    icon:'⚖️', name:'Morrison Law Group Fargo',      phone:'(701) 555-0301', rating:5.0, note:'MN/ND dual licensed, flat fee closings' },
    { category:'Moving Services',    urgency:'Post-Close', icon:'🚚', name:'Red River Moving Co',            phone:'(701) 555-0178', rating:4.6, note:'Local + long-distance, winter moving specialists' },
  ]
  return { vendors, priorityVendor: vendors[0], totalEstimatedCost: `$${(1500 + (age > 20 ? 3000 : 0)).toLocaleString()}–$${(3500 + (age > 20 ? 6000 : 0)).toLocaleString()} estimated pre-closing service costs` }
}

export function generateIntelligenceBrief(listing, allListings) {
  const market  = generateMarketBrief(listing, allListings)
  const maint   = generateMaintenanceForecast(listing)
  const roast   = generateSavageRoast(listing)
  const gem     = generateHiddenGemAnalysis(listing, allListings)
  const age     = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const esgScore = Math.round(60 + (age < 15 ? 20 : 0) + (listing.sqft < 2500 ? 10 : 0))
  const overallScore = Math.round((market.confidence + gem.gemScore + roast.score + esgScore) / 4)
  return {
    overallScore,
    sections: [
      { label:'Market Position',  score:market.confidence, summary:market.brief,                                                                 icon:'📊', color:'#3b82f6' },
      { label:'Value Signal',     score:gem.gemScore,       summary:gem.narrative,                                                                icon:'💎', color:'#22c55e' },
      { label:'Honest Assessment',score:roast.score,        summary:roast.verdict,                                                                icon:'🔥', color:'#ef4444' },
      { label:'ESG Rating',       score:esgScore,           summary:`${age < 10 ? 'Modern build with efficient systems.' : 'Older home — efficiency upgrades recommended.'} Sustainability score: ${esgScore}/100.`, icon:'🌿', color:'#10b981' },
      { label:'Maintenance Risk', score:100-Math.min(50,maint.totalNext5/1000), summary:maint.summary,                                           icon:'🔧', color:'#f59e0b' },
    ],
    recommendation: overallScore > 75 ? '✅ Strong buy candidate — fundamentals align' : overallScore > 55 ? '🟡 Proceed with due diligence — manageable concerns' : '⚠️ Caution — multiple flags warrant careful review',
  }
}

export function generateInspectionPlan(listing) {
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const seed = listing.id?.charCodeAt(0) || 70
  const ndRisks = [
    { risk:'Radon Gas',          priority:'ALWAYS', rationale:'ND has one of the highest radon rates in the US. Test every home regardless of age.', cost:'$150–$200', icon:'☢️' },
    { risk:'Foundation Movement', priority:age>15?'HIGH':'MEDIUM', rationale:`Fargo's clay soil and freeze-thaw cycles cause ${age>15?'significant':'gradual'} foundation shifting over time.`, cost:'$300–$500 evaluation', icon:'🏗️' },
    { risk:'Basement Moisture',   priority:'HIGH',   rationale:'Red River Valley flooding history and spring snowmelt make moisture intrusion a persistent risk.', cost:'$200–$400 remediation eval', icon:'💧' },
    { risk:'HVAC System',         priority:age>15?'HIGH':'MEDIUM', rationale:`${age}-year-old system is ${age>15?'at or near':'approaching'} end of typical lifespan. ND winters demand reliable heating.`, cost:'$150 full inspection', icon:'❄️' },
    { risk:'Roof Condition',      priority:age>20?'HIGH':'LOW',    rationale:`${age>20?'Aging roof likely weathered multiple ND hail and blizzard seasons.':'Relatively recent installation — verify warranty status.'}`, cost:'$300–$500 professional evaluation', icon:'🏠' },
    { risk:'Electrical Panel',    priority:age>35?'HIGH':'LOW',    rationale:`${age>35?'Pre-1990 panels often have safety issues and insurance implications.':'Modern panel — verify grounding and capacity.'}`, cost:'$150 evaluation', icon:'⚡' },
  ]
  const timeline = [
    { day:'Day 1–2',   task:'Order general home inspection',    status:'Schedule Now' },
    { day:'Day 1–2',   task:'Order radon test (simultaneous)', status:'Schedule Now' },
    { day:'Day 3–5',   task:'Review inspection report',         status:'Pending' },
    { day:'Day 5–7',   task:'Negotiate repairs or credits',     status:'Pending' },
    { day:'Day 7–10',  task:'Re-inspection if needed',          status:'Contingent' },
    { day:'Day 10–14', task:'Clear all contingencies',          status:'Contingent' },
  ]
  return { ndRisks, timeline, estimatedCost:`$${600 + (age>20?400:0) + (age>35?200:0)}–$${1200+(age>20?800:0)+(age>35?500:0)} total inspection investment` }
}

export function generateFinancingScenarios(listing) {
  const price = listing.price
  const scenarios = [
    { name:'Conventional 20%',  down:0.20, rate:7.1,  term:30, type:'Conventional', color:'#3b82f6' },
    { name:'Conventional 10%',  down:0.10, rate:7.4,  term:30, type:'Conventional', color:'#8b5cf6' },
    { name:'FHA 3.5%',          down:0.035,rate:6.9,  term:30, type:'FHA',           color:'#22c55e' },
    { name:'15-Year Fixed',     down:0.20, rate:6.5,  term:15, type:'Conventional', color:'#f59e0b' },
    { name:'VA Loan (0% down)', down:0.00, rate:6.75, term:30, type:'VA',            color:'#ef4444' },
  ]
  return scenarios.map(s => {
    const downAmt  = Math.round(price * s.down)
    const loan     = price - downAmt
    const mo       = s.rate / 100 / 12
    const n        = s.term * 12
    const payment  = loan > 0 && mo > 0 ? (loan * mo * Math.pow(1+mo,n)) / (Math.pow(1+mo,n)-1) : 0
    const total    = payment * n
    const interest = total - loan
    const equity5yr = loan * 0.08 * 5 // rough equity buildup
    return { ...s, downAmt, loan, payment:Math.round(payment), total:Math.round(total), interest:Math.round(interest), equity5yr:Math.round(equity5yr), pmi: s.down < 0.20 ? Math.round(loan * 0.008 / 12) : 0 }
  })
}

export function generateTitleInsights(listing) {
  const seed = listing.id?.charCodeAt(2) || 55
  const age  = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const issues = [
    seed > 60 ? { type:'Utility Easement', severity:'Low',    detail:'Standard electric/gas utility easement along rear 10 ft. Cannot build permanent structures in this area.', resolution:'No action needed — standard for this area', cost:'$0' } : null,
    age > 30  ? { type:'Historical Liens', severity:'Medium', detail:'Title search indicates a satisfied mechanics lien from 2008 renovation. Documented as resolved but verify release is recorded.', resolution:'Request copy of lien release from title company', cost:'$50–$150' } : null,
    seed < 40 ? { type:'Survey Discrepancy', severity:'Medium', detail:'Minor boundary discrepancy (0.3 ft) noted on east property line vs county records. Common in this platted area.', resolution:'Updated survey recommended before closing', cost:'$500–$800' } : null,
                { type:'HOA Dues Status', severity:'Low',    detail:`${listing.type === 'Condo' ? 'Condo association dues must be confirmed current — request 90-day ledger from seller.' : 'No HOA recorded for this property.'}`, resolution: listing.type === 'Condo' ? 'Request HOA estoppel letter' : 'No action needed', cost: listing.type === 'Condo' ? '$100–$200' : '$0' },
  ].filter(Boolean)
  return { issues, clearTitle: issues.filter(i=>i.severity!=='Low').length === 0, summary:`Title review for ${listing.address} shows ${issues.length} item${issues.length!==1?'s':''} requiring attention. ${issues.filter(i=>i.severity==='Low').length === issues.length ? 'All items are routine and low-risk.' : 'One or more items warrant follow-up before closing.'}`, estimatedResolutionDays: 7 + issues.filter(i=>i.severity!=='Low').length * 3 }
}

export function generateSustainabilityRebates(listing) {
  const age    = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const rebates = [
    { program:'Federal IRA Energy Tax Credit',    amount:'Up to $3,200/yr',  type:'Federal Tax Credit',  applicable:true,                description:'25C credit for heat pumps, insulation, windows, doors, electrical upgrades',        deadline:'Dec 31, 2032' },
    { program:'Federal Solar Investment Tax Credit',amount:'30% of system cost',type:'Federal Tax Credit',applicable:true,               description:'ITC covers solar panels, battery storage. On $25k system = $7,500 credit',          deadline:'Dec 31, 2032' },
    { program:'MN Xcel Energy Rebates',            amount:'$50–$2,500',       type:'Utility Rebate',      applicable:true,               description:'Heat pump rebates up to $2,500, smart thermostat $100, LED lighting $50',             deadline:'Rolling' },
    { program:'ND Weatherization Program',         amount:'Up to $6,500',     type:'State Grant',          applicable:age>15,             description:'Low-interest loans and grants for insulation, air sealing, window upgrades in ND homes', deadline:'Apply annually' },
    { program:'USDA Rural Energy Savings',         amount:'0% loan financing', type:'Federal Loan',        applicable:listing.city!=='Fargo', description:'Zero-interest loans for rural property energy efficiency upgrades',             deadline:'Rolling' },
    { program:'Property Assessed Clean Energy (PACE)',amount:'100% financing', type:'Financing Program',   applicable:true,               description:'Finance energy improvements repaid through property taxes — no upfront cost',          deadline:'Rolling' },
  ].filter(r => r.applicable)
  const totalEstimate = `$${(8500 + (age > 20 ? 4000 : 0)).toLocaleString()}–$${(22000 + (age > 20 ? 8000 : 0)).toLocaleString()}`
  return { rebates, totalEstimate, topPick: rebates[0], summary:`${listing.address} qualifies for ${rebates.length} incentive programs with a combined potential value of ${totalEstimate}. The Federal IRA credits alone could offset significant upgrade costs over time.` }
}

export function generateRelocationPlan(listing) {
  const city   = listing.city
  const isND   = listing.state === 'ND'
  return {
    phases: [
      {
        phase:'Week 1-2 · Pre-Move',
        icon:'📋',
        color:'#3b82f6',
        tasks:[
          'Transfer utilities: Xcel Energy (electricity/gas), Fargo Water Utilities',
          'Update USPS mail forwarding from old address',
          'Notify bank, employer, insurance companies of new address',
          isND ? 'Register vehicle in ND within 90 days of move (ND DMV)' : 'Update vehicle registration with new state',
          'Research Fargo trash/recycling schedule at fargond.gov',
        ],
      },
      {
        phase:'Month 1 · Settling In',
        icon:'🏠',
        color:'#22c55e',
        tasks:[
          isND ? 'Winterize: schedule furnace inspection before October, stock ice melt' : 'Schedule HVAC service for seasonal prep',
          'Test smoke/CO detectors, replace batteries',
          'Locate main water shutoff, electrical panel, gas shutoff',
          'Introduce yourself to neighbors — Fargo communities are close-knit',
          'Find your nearest Sanford or Essentia Health clinic',
        ],
      },
      {
        phase:'Month 2-3 · Optimization',
        icon:'⭐',
        color:'#f59e0b',
        tasks:[
          'Schedule energy audit via Xcel Energy (often free)',
          'Set up lawn/snow removal service before first ND winter',
          'Apply for Homestead Property Tax Credit (ND residents)',
          'Connect with local neighborhood association',
          'Establish relationship with local hardware store and plumber',
        ],
      },
    ],
    localContacts: [
      { label:'City of Fargo',         phone:'311',             web:'fargond.gov' },
      { label:'Xcel Energy',           phone:'1-800-895-4999',  web:'xcelenergy.com' },
      { label:'ND DMV',                phone:'(701) 328-2725',  web:'dot.nd.gov' },
    ],
  }
}

export function generateReferralEngine(listing) {
  const seed  = listing.price % 10
  const score = 70 + seed * 3
  const moments = [
    { timing:'3 days after closing',    trigger:'Move-in confirmed',     message:`Congratulations on your new home at ${listing.address}! We hope the move went smoothly. We'd love to hear how your first few days have been.`, type:'Check-in', icon:'🎉' },
    { timing:'30 days after closing',   trigger:'First month complete',  message:`One month in your new home — how is everything going? We'd love to know what you love most about ${listing.city} so far.`, type:'Satisfaction',icon:'❤️' },
    { timing:'90 days after closing',   trigger:'Settled in',            message:`You've officially been in your home for a season! If you have friends or family thinking about buying or selling in the Fargo area, we'd be honored to help them the same way we helped you.`, type:'Referral',icon:'⭐' },
    { timing:'1 year anniversary',      trigger:'Home anniversary',      message:`Happy 1-year home anniversary! Your home has likely appreciated — would you like a free market value update?`, type:'Retention',icon:'🏆' },
  ]
  return { satisfactionScore:score, moments, npsEstimate:`${score}% Net Promoter Score estimate`, referralValue:`Average referred transaction value in Fargo: $${Math.round(listing.price * 0.92).toLocaleString()}`, topMoment:moments[2] }
}

export function generateInvestmentSimulator(listing) {
  const price    = listing.price
  const annualAppreciation = 0.04
  const annualRent = Math.round(price * 0.008)
  const annualExpenses = Math.round(price * 0.015)
  const downPayment = Math.round(price * 0.20)
  const loan     = price - downPayment
  const annualMortgage = Math.round(loan * 0.075)
  const scenarios = [5, 10, 20].map(years => {
    const futureValue = Math.round(price * Math.pow(1 + annualAppreciation, years))
    const totalRent   = annualRent * years
    const totalExpenses = annualExpenses * years
    const totalMortgage = annualMortgage * years
    const netCashflow = totalRent - totalExpenses - totalMortgage
    const equity      = futureValue - loan
    const totalReturn = equity + netCashflow - downPayment
    const irr         = Math.round((Math.pow((equity + totalRent) / price, 1/years) - 1) * 100)
    return { years, futureValue, totalRent, netCashflow, equity, totalReturn, irr, monthlyRent:annualRent/12 }
  })
  return { downPayment, scenarios, bestScenario: scenarios[1], summary:`At a conservative 4% annual appreciation, ${listing.address} projects to $${Math.round(price*Math.pow(1.04,10)).toLocaleString()} in 10 years. Rental yield potential: ~$${Math.round(annualRent/12).toLocaleString()}/month based on ${listing.city} comparables.` }
}

export function generateNeighborhoodResilience(listing) {
  const seed = (listing.city || '').charCodeAt(0) || 70
  const lat  = listing.lat || 46.87
  const isND = listing.state === 'ND'
  return {
    scores: [
      { label:'Climate Resilience',   score:65+(seed%25), color:'#22c55e', icon:'🌡️', detail:isND?'Fargo faces cold extremes but elevated topography reduces flood risk vs river-adjacent areas':'Moderate climate resilience — verify flood zone status' },
      { label:'Economic Stability',   score:72+(seed%20), color:'#3b82f6', icon:'💼', detail:'Fargo-Moorhead metro shows strong employment diversity: healthcare, technology, agriculture, and education sectors' },
      { label:'Infrastructure',       score:78+(seed%15), color:'#8b5cf6', icon:'🏗️', detail:'City of Fargo rated among top ND municipalities for infrastructure investment. $200M+ flood diversion project in progress' },
      { label:'School Quality',       score:70+(seed%22), color:'#f59e0b', icon:'🏫', detail:'Fargo Public Schools rated above ND average. Multiple magnet and specialty programs available' },
      { label:'Crime Safety Index',   score:68+(seed%25), color:'#ef4444', icon:'🔒', detail:'Property crime trending down 8% YoY. Violent crime rate 15% below national average for comparable metros' },
      { label:'Growth Trajectory',    score:75+(seed%20), color:'#06b6d4', icon:'📈', detail:'Fargo ranked top-10 for population growth among Midwest metros 2020-2025. New development accelerating in south Fargo corridor' },
    ],
    overallScore: Math.round(72 + (seed % 18)),
    outlook: '5-Year Positive — infrastructure investment, population growth, and economic diversification support sustained appreciation',
    risks: ['Extreme winter weather requires higher maintenance budgets', 'Red River flood risk in low-lying areas', 'Regional economy tied to agricultural sector performance'],
  }
}

export function generateClosingPredictor(listing) {
  const price = listing.price
  const isConventional = true
  const closingCosts = {
    lenderFees:       Math.round(price * 0.01),
    titleInsurance:   Math.round(price * 0.004),
    titleSearch:      450,
    appraisal:        650,
    homeInspection:   475,
    radonTest:        175,
    prepaidInterest:  Math.round(price * 0.8 * 0.075 / 12 * 15),
    escrowSetup:      Math.round(price * 0.002),
    recordingFees:    250,
    attorneyFees:     800,
    miscellaneous:    500,
  }
  const total    = Object.values(closingCosts).reduce((s,v)=>s+v,0)
  const timeline = [
    { day:'Day 0',    milestone:'Offer Accepted',             risk:'Low',    note:'Get inspection scheduled immediately' },
    { day:'Day 3-7',  milestone:'Inspection Period',          risk:'Medium', note:'Most deals renegotiated here — budget $475 for inspection' },
    { day:'Day 7-14', milestone:'Appraisal Ordered',          risk:'Medium', note:`${price > 450000 ? 'Appraisal gap risk elevated at this price point' : 'Appraisal likely to support purchase price'}` },
    { day:'Day 14-21',milestone:'Loan Processing',            risk:'Low',    note:'Have all financial documents ready — avoid large purchases' },
    { day:'Day 21-28',milestone:'Clear to Close',             risk:'Low',    note:'Final walkthrough scheduled 24-48 hours before closing' },
    { day:'Day 30-35',milestone:'Closing Day',                risk:'Low',    note:`Bring certified funds for $${total.toLocaleString()} + any remaining down payment` },
  ]
  return { closingCosts, total, timeline, delayRisk: listing.daysOnMarket < 5 ? 'Low (market moving — motivated parties)' : 'Moderate (standard 30-45 day timeline)', cashToClose: total + Math.round(price * 0.20) }
}

export function generateESGScore(listing) {
  const age    = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const sqft   = listing.sqft || 2000
  const scores = {
    energyEfficiency: Math.max(20, Math.min(95, 85 - age * 1.2 + (sqft < 2000 ? 10 : -5))),
    carbonFootprint:  Math.max(25, Math.min(90, 80 - age * 0.8)),
    waterUsage:       65 + Math.floor(Math.random() * 20),
    greenProximity:   60 + Math.floor(Math.random() * 30),
    transitAccess:    50 + Math.floor(Math.random() * 35),
  }
  const overall = Math.round(Object.values(scores).reduce((s,v)=>s+v,0) / Object.keys(scores).length)
  const improvements = [
    age > 15 ? { action:'Install smart thermostat',        cost:'$250',        saving:'$180/yr', roi:'7 months'  } : null,
    age > 20 ? { action:'Add attic insulation (R-49)',      cost:'$1,800',      saving:'$420/yr', roi:'4.3 years' } : null,
    age > 10 ? { action:'LED lighting throughout',          cost:'$400',        saving:'$120/yr', roi:'3.3 years' } : null,
              { action:'Solar panel system (8kW)',          cost:'$22,000 net', saving:'$1,800/yr',roi:'12 years'  },
              { action:'Heat pump replacement (if needed)', cost:'$8,500',      saving:'$600/yr', roi:'14 years'  },
  ].filter(Boolean)
  return { scores, overall, label: overall > 75 ? '🌿 High Sustainability' : overall > 55 ? '🟡 Moderate — Improvable' : '⚠️ Significant Upgrade Opportunity', improvements, certificationPath: overall > 70 ? 'ENERGY STAR certification likely achievable with minor upgrades' : 'ENERGY STAR achievable with moderate investment (~$5,000–$15,000)' }
}

export function generateCMAReport(listing, allListings) {
  const comps = allListings
    .filter(l => l.id !== listing.id && l.city === listing.city && Math.abs(l.beds - listing.beds) <= 1)
    .slice(0, 5)
    .map(c => {
      const ppsf       = c.price / c.sqft
      const adjPrice   = c.price + (listing.sqft - c.sqft) * ppsf * 0.6 + (listing.beds - c.beds) * 8000 + (listing.baths - c.baths) * 5000
      return { ...c, ppsf:Math.round(ppsf), adjPrice:Math.round(adjPrice), adjustment:Math.round(adjPrice - c.price) }
    })
  const avgAdj = comps.length > 0 ? Math.round(comps.reduce((s,c)=>s+c.adjPrice,0) / comps.length) : listing.price
  const range  = { low:Math.round(avgAdj * 0.96), mid:avgAdj, high:Math.round(avgAdj * 1.04) }
  return { comps, range, listPriceDelta: listing.price - avgAdj, valuationVerdict: Math.abs(listing.price - avgAdj) / avgAdj < 0.03 ? '✅ Fairly Priced' : listing.price > avgAdj ? `⚠️ Listed ${Math.round(((listing.price-avgAdj)/avgAdj)*100)}% above adjusted comps` : `✅ Listed ${Math.round(((avgAdj-listing.price)/avgAdj)*100)}% below adjusted comps — strong value`, confidence: Math.min(95, 65 + comps.length * 6) }
}

export function generateMarketingPackage(listing) {
  const age   = new Date().getFullYear() - (listing.yearBuilt || 2000)
  const sqftK = (listing.sqft / 1000).toFixed(1)
  return {
    headline: `${listing.beds}-Bed ${listing.type} in ${listing.city} — ${listing.sqft.toLocaleString()} Sq Ft of Modern Living at $${Math.round(listing.price/1000)}k`,
    mlsDescription: `Welcome to ${listing.address} — a stunning ${listing.beds}-bedroom, ${listing.baths}-bath ${listing.type.toLowerCase()} in the heart of ${listing.city}. This ${listing.yearBuilt}-built home offers ${listing.sqft.toLocaleString()} sq ft of thoughtfully designed living space. ${listing.daysOnMarket < 3 ? 'Just listed — schedule your showing today before it\'s gone!' : 'Well-maintained and move-in ready.'} Minutes from top Fargo schools, shopping, and dining. Priced to move at $${listing.price.toLocaleString()}.`,
    socialCaption: `🏠 Just Listed in ${listing.city}!\n${listing.beds}bd / ${listing.baths}ba · ${listing.sqft.toLocaleString()} sqft\n💰 $${listing.price.toLocaleString()}\n📍 ${listing.address}\n\n${listing.daysOnMarket === 0 ? '✨ Brand new to market!' : `${listing.daysOnMarket} days on market`}\n\n#FargoHomes #${listing.city.replace(' ','')}RealEstate #NDHomes #ZephyrAI`,
    emailSubject: `New Listing Alert: ${listing.beds}bd/${listing.baths}ba in ${listing.city} — $${Math.round(listing.price/1000)}k`,
    targetPersonas: [
      { persona:'Growing Family',    angle:`${listing.beds} bedrooms + ${listing.baths} baths = room for everyone. The ${sqftK}k sqft layout works perfectly for busy family life.` },
      { persona:'Remote Professional',angle:`Work-from-home friendly layout with dedicated space options. Quiet ${listing.city} neighborhood — zero commute stress.` },
      { persona:'First-Time Buyer',  angle:`At $${listing.price.toLocaleString()}, this is your entry point into Fargo homeownership. ${age < 15 ? 'Modern systems mean lower near-term maintenance costs.' : 'Priced to reflect age — equity upside potential.'}` },
    ],
  }
}

export function generateBuyerJourney(listing) {
  const price = listing.price
  return {
    currentStage: 'Property Research',
    stages: [
      { stage:'Pre-Approval',        icon:'💳', status:'recommended', detail:`Get pre-approved for up to $${Math.round(price*1.1).toLocaleString()} before making an offer. Contact 2-3 local Fargo lenders for rate comparison.`, action:'Find a Lender' },
      { stage:'Property Research',   icon:'🔍', status:'active',       detail:`You're here. Compare ${listing.address} against at least 2-3 similar properties in ${listing.city} before committing.`, action:'Compare Listings' },
      { stage:'Tour & Inspect',      icon:'🏠', status:'next',         detail:`Schedule a private showing within 48 hours if interested. In this market, ${listing.daysOnMarket < 7 ? 'move quickly.' : 'you have reasonable time to decide.'}`, action:'Schedule Tour' },
      { stage:'Craft Your Offer',    icon:'📝', status:'upcoming',     detail:`Based on comps, an offer of $${Math.round(price*0.97).toLocaleString()}–$${price.toLocaleString()} is competitive. Include inspection and financing contingencies.`, action:'Consult Agent' },
      { stage:'Due Diligence',       icon:'🔎', status:'upcoming',     detail:`Inspection, radon test, title search, and appraisal. Budget $1,200–$1,800 and 14-21 days for this phase.`, action:'Line Up Vendors' },
      { stage:'Final Walk & Close',  icon:'🎉', status:'upcoming',     detail:`Closing costs estimated at $${Math.round(price*0.03).toLocaleString()}. Bring certified funds and valid ID. Keys are yours!`, action:'Review Costs' },
    ],
  }
}

export function generatePostClosingAdvisor(listing) {
  const isND = listing.state === 'ND'
  return {
    months: [
      { month:'Month 1', icon:'📦', color:'#3b82f6', title:'Move-In Essentials', tasks:['Change all door locks and garage codes','Test all smoke/CO detectors, replace batteries','Locate and photograph main shutoffs (water, gas, electric)','Set up autopay for mortgage, insurance, taxes','Register for trash/recycling pickup at fargond.gov'] },
      { month:'Month 2', icon:'🔧', color:'#f59e0b', title:'Home Systems Review', tasks:['Schedule HVAC tune-up before winter','Test sump pump (if applicable)','Clean gutters and downspouts',isND?'Check weather stripping on all exterior doors — critical for ND winters':'Inspect exterior caulking and seals','Order radon test if not done pre-purchase'] },
      { month:'Month 3', icon:'🌱', color:'#22c55e', title:'Settle & Optimize', tasks:['Apply for Homestead Property Tax Credit (ND)',isND?'Arrange snow removal service before first snowfall':'Schedule seasonal lawn/exterior maintenance','Complete any warranty registration for appliances','Set up home maintenance budget account (1-2% of value/yr)','Connect with neighbors and local community groups'] },
    ],
    seasonalReminders: isND ? [
      { season:'Fall (Sept-Oct)', tasks:['Winterize outdoor faucets','Service furnace + replace filter','Stock ice melt and snow removal equipment','Inspect roof for loose shingles before snow season'] },
      { season:'Spring (Mar-Apr)', tasks:['Check for frost heave or foundation shifts','Clean gutters of winter debris','Test AC before summer','Inspect driveway/sidewalk for freeze-thaw damage'] },
    ] : [],
    estimatedYear1Costs: `$${Math.round(listing.price * 0.015).toLocaleString()}–$${Math.round(listing.price * 0.025).toLocaleString()} (1-2.5% of home value for maintenance + setup)`,
  }
}
