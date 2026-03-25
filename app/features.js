export const FEATURES = [
  // ── Tier 1 — Core AI Analysis ─────────────────────────────────────────
  { id:'savage_mode',         label:'🔥 Roast Mode',           icon:'🔥', description:'Brutally honest AI teardown of any listing',                        difficulty:1, category:'AI Analysis'   },
  { id:'hidden_gem',          label:'💎 Hidden Gem Radar',      icon:'💎', description:'Flags undervalued listings with conspiracy-style analysis',          difficulty:1, category:'AI Analysis'   },
  { id:'vibe_roulette',       label:'🎰 Vibe Roulette',         icon:'🎰', description:'Spin for a wild property vibe match',                               difficulty:1, category:'Discovery'      },
  { id:'emotional_fit',       label:'💝 Emotional Fit',         icon:'💝', description:'Personality quiz → AI love story for matched homes',                 difficulty:2, category:'AI Analysis'   },
  { id:'ghost_stories',       label:'👻 Ghost of Homes Past',   icon:'👻', description:'AI-generated dramatized history of older homes',                    difficulty:2, category:'Storytelling'   },
  { id:'renovation_blender',  label:'🔨 Reno Blender',          icon:'🔨', description:'Describe wild reno ideas → AI cost + ROI breakdown',                difficulty:2, category:'Finance'        },
  { id:'regret_minimizer',    label:'🎯 Regret Minimizer',      icon:'🎯', description:'AI simulates negotiation paths + outcomes',                          difficulty:2, category:'Finance'        },
  { id:'parallel_lives',      label:'🌀 Parallel Lives',        icon:'🌀', description:'See branching life timelines for any property',                      difficulty:2, category:'Storytelling'   },
  { id:'market_intelligence', label:'📊 Market Brief',          icon:'📊', description:'Real-time AI market analysis per listing',                           difficulty:2, category:'Finance'        },
  { id:'maintenance_forecast',label:'🔧 Maintenance Forecast',  icon:'🔧', description:'5-10 year AI maintenance cost predictions',                          difficulty:2, category:'AI Analysis'   },
  { id:'climate_fortune',     label:'🌡️ Climate Fortune',       icon:'🌡️', description:'10-30 year climate projection overlay',                             difficulty:3, category:'Data'           },
  { id:'due_diligence',       label:'📋 Due Diligence',         icon:'📋', description:'Auto-compiled inspection + title risk report',                       difficulty:3, category:'Finance'        },

  // ── Tier 2 — Professional & Agentic ──────────────────────────────────
  { id:'lead_qualifier',      label:'🎯 Lead Qualifier',        icon:'🎯', description:'AI scores + qualifies buyer leads, drafts responses, schedules tours',difficulty:2, category:'Professional'   },
  { id:'buyer_education',     label:'🎓 Buyer Education',       icon:'🎓', description:'Dynamic learning modules: financing, inspections, closing process',  difficulty:2, category:'Professional'   },
  { id:'vendor_coordinator',  label:'🔧 Vendor Coordinator',    icon:'🔧', description:'AI prioritizes service needs + suggests vetted local MN vendors',    difficulty:2, category:'Professional'   },
  { id:'intelligence_brief',  label:'📄 Intelligence Brief',    icon:'📄', description:'One-click full property intelligence report: value, risk, lifestyle', difficulty:2, category:'Finance'        },
  { id:'inspection_orchestrator',label:'🔍 Inspection Planner', icon:'🔍', description:'AI builds custom inspection workflow with ND-specific risk priorities',difficulty:2, category:'Professional'   },
  { id:'financing_modeler',   label:'💳 Financing Modeler',     icon:'💳', description:'Multi-variable financing simulations with equity projections',        difficulty:2, category:'Finance'        },
  { id:'title_insight',       label:'📜 Title Insights',        icon:'📜', description:'AI extracts + explains liens, easements, flood-zone flags from title',difficulty:2, category:'Finance'        },
  { id:'sustainability_rebates',label:'♻️ Rebate Maximizer',    icon:'♻️', description:'Identifies all federal + MN state energy rebates + solar credits',   difficulty:2, category:'Data'           },
  { id:'relocation_planner',  label:'📦 Relocation Planner',    icon:'📦', description:'Personalized 90-day post-closing move-in orchestration plan',         difficulty:2, category:'Professional'   },
  { id:'referral_engine',     label:'⭐ Referral Engine',        icon:'⭐', description:'Post-transaction satisfaction surveys + smart referral requests',     difficulty:2, category:'Professional'   },
  { id:'investment_simulator', label:'📈 Investment Simulator', icon:'📈', description:'IRR, cash-flow + equity projections for investors',                   difficulty:2, category:'Finance'        },
  { id:'neighborhood_resilience',label:'🛡️ Resilience Profile', icon:'🛡️', description:'Climate, economic, and infrastructure resilience report per area',   difficulty:3, category:'Data'           },
  { id:'closing_predictor',   label:'📅 Closing Predictor',     icon:'📅', description:'Forecasts closing costs, timeline + risk-adjusted delay buffers',     difficulty:2, category:'Finance'        },
  { id:'esg_score',           label:'🌿 ESG Scorer',            icon:'🌿', description:'Multi-factor sustainability score with improvement roadmap',           difficulty:2, category:'Data'           },
  { id:'cma_generator',       label:'📑 CMA Generator',         icon:'📑', description:'Professional comparative market analysis with adjusted comps table',  difficulty:3, category:'Finance'        },
  { id:'marketing_generator', label:'📣 Marketing Generator',   icon:'📣', description:'Full listing marketing package: descriptions, captions, email copy',  difficulty:2, category:'Professional'   },
  { id:'buyer_journey',       label:'🗺️ Buyer Journey Map',     icon:'🗺️', description:'Step-by-step personalized path-to-closing roadmap',                  difficulty:2, category:'Professional'   },
  { id:'post_closing_advisor', label:'🏡 Post-Closing Advisor', icon:'🏡', description:'12-month settle-in plan with seasonal MN maintenance calendar',       difficulty:2, category:'Professional'   },
]

export const FEATURE_CATEGORIES = ['All','AI Analysis','Finance','Discovery','Storytelling','Data','Professional']

export const DEFAULT_FEATURE_SETTINGS = Object.fromEntries(
  FEATURES.map(f => [f.id, true])
)
