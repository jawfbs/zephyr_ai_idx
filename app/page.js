'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import {
  Search, Heart, Bed, Bath, MapPin, SlidersHorizontal,
  List, Map, ChevronDown, X, Clock, MessageSquare,
  Moon, Sunset, Sun, Home, Check, Sparkles,
  TrendingUp, ArrowUpRight, LayoutGrid, Maximize2,
  DollarSign, AlertCircle, User, Phone, Mail, LogOut,
  Share2, EyeOff, Trophy, Zap,
} from 'lucide-react'
import { THEMES }           from './themes'
import { DEMO_LISTINGS, formatPrice } from './data'
import AccordionSection     from './AccordionSection'
import AccountPage          from './AccountPage'
import SignInModal          from './SignInModal'
import ListingModal         from './ListingModal'
import MapPanel             from './MapPanel'
import GamificationPanel    from './GamificationPanel'
import XPToast              from './XPToast'
import PhotoCarousel        from './PhotoCarousel'
import FeaturePanel         from './FeaturePanel'
import Tutorial             from './Tutorial'
import { isProfessional, getLevelLabel, getLevelColor, getLevelBadge } from './auth'
import { addXP, checkAchievements, DEFAULT_STATS, getLevel, ACHIEVEMENTS, XP_ACTIONS } from './gamification'
import { DEFAULT_FEATURE_SETTINGS } from './features'
import { LAYOUTS, DEFAULT_LAYOUT_ID } from './layouts'

const LS_KEY = 'zephyr_gstats'
const FS_KEY = 'zephyr_features'
function loadStats()  { try { return JSON.parse(localStorage.getItem(LS_KEY))  || DEFAULT_STATS            } catch { return DEFAULT_STATS            } }
function saveStats(s) { try { localStorage.setItem(LS_KEY,  JSON.stringify(s)) } catch {} }
function loadFeat()   { try { return JSON.parse(localStorage.getItem(FS_KEY))  || DEFAULT_FEATURE_SETTINGS } catch { return DEFAULT_FEATURE_SETTINGS } }
function saveFeat(s)  { try { localStorage.setItem(FS_KEY,  JSON.stringify(s)) } catch {} }

let toastId = 0

export default function ZephyrPage() {
  const [colorMode,     setColorMode]     = useState('light')
  const [activeTheme,   setActiveTheme]   = useState(THEMES.nature.variants[1])
  const [themeCategory, setThemeCategory] = useState('nature')

  const [user,          setUser]          = useState(null)
  const [signInOpen,    setSignInOpen]    = useState(false)
  const [accordionOpen, setAccordionOpen] = useState(false)
  const [contactOpen,   setContactOpen]   = useState(false)
  const [accountOpen,   setAccountOpen]   = useState(false)
  const [tutorialOpen,  setTutorialOpen]  = useState(false)

  const [apiCreds,         setApiCreds]         = useState(null)
  const [selectedListing,  setSelectedListing]  = useState(null)
  const [featureListing,   setFeatureListing]   = useState(null)
  const [hiddenIds,        setHiddenIds]        = useState([])
  const [query,            setQuery]            = useState('')
  const [saved,            setSaved]            = useState([])
  const [viewMode,         setViewMode]         = useState('grid')
  const [listings,         setListings]         = useState(DEMO_LISTINGS)
  const [loading,          setLoading]          = useState(false)

  const [activeNav,      setActiveNav]      = useState('Buy')
  const [priceOpen,      setPriceOpen]      = useState(false)
  const [bedsOpen,       setBedsOpen]       = useState(false)
  const [typeOpen,       setTypeOpen]       = useState(false)
  const [sortOpen,       setSortOpen]       = useState(false)
  const [filterBeds,     setFilterBeds]     = useState('')
  const [filterPriceMin, setFilterPriceMin] = useState('')
  const [filterPriceMax, setFilterPriceMax] = useState('')
  const [filterType,     setFilterType]     = useState('')
  const [sortBy,         setSortBy]         = useState('price_desc')
  const [hoveredCard,    setHoveredCard]    = useState(null)

  const [gamificationEnabled, setGamificationEnabled] = useState(true)
  const [gamificationOpen,    setGamificationOpen]    = useState(false)
  const [userStats,           setUserStats]           = useState(DEFAULT_STATS)
  const [toasts,              setToasts]              = useState([])
  const [newAchievement,      setNewAchievement]      = useState(null)
  const [featureSettings,     setFeatureSettings]     = useState(DEFAULT_FEATURE_SETTINGS)
  const [activeLayoutId,      setActiveLayoutId]      = useState(DEFAULT_LAYOUT_ID)

  const accordionRef = useRef(null)
  const contactRef   = useRef(null)

  // ── Mount: load persisted state ───────────────────────────────────────────
  useEffect(() => {
    setUserStats(loadStats())
    setFeatureSettings(loadFeat())
    const cm = document.cookie.split(';').find(c => c.trim().startsWith('zephyr_colormode='))
    if (cm) setColorMode(cm.split('=')[1].trim())
    const lc = document.cookie.split(';').find(c => c.trim().startsWith('zephyr_layout='))
    if (lc) setActiveLayoutId(lc.split('=')[1].trim())
    const skip = document.cookie.split(';').find(c => c.trim().startsWith('zephyr_skip_tutorial='))
    if (!skip) setTutorialOpen(true)
  }, [])

  useEffect(() => { saveFeat(featureSettings) }, [featureSettings])
  useEffect(() => { document.cookie = `zephyr_colormode=${colorMode}; max-age=31536000; path=/` }, [colorMode])
  useEffect(() => { document.cookie = `zephyr_layout=${activeLayoutId}; max-age=31536000; path=/` }, [activeLayoutId])

  // ── XP grant ─────────────────────────────────────────────────────────────
  const grantXP = useCallback((action) => {
    if (!gamificationEnabled) return
    const def = XP_ACTIONS[action]
    if (!def) return
    setUserStats(prev => {
      const next    = addXP(prev, action)
      const newOnes = checkAchievements(next, next.achievements || [])
      let final     = next
      if (newOnes.length > 0) {
        final = { ...next, achievements: [...(next.achievements || []), ...newOnes.map(a => a.id)] }
        setNewAchievement(newOnes[0])
        newOnes.forEach(a => { final = { ...final, totalXP: final.totalXP + a.xp } })
      }
      saveStats(final)
      return final
    })
    const id = ++toastId
    setToasts(p => [...p, { id, xp: def.xp, label: def.label, icon: def.icon }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }, [gamificationEnabled])

  // ── Click outside dropdowns ───────────────────────────────────────────────
  useEffect(() => {
    const h = (e) => {
      if (accordionRef.current && !accordionRef.current.contains(e.target)) setAccordionOpen(false)
      if (contactRef.current   && !contactRef.current.contains(e.target))   setContactOpen(false)
    }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  const handleSaveApiCreds = useCallback((creds) => {
    setApiCreds(creds)
    setAccordionOpen(false)
    setLoading(true)
    fetch(`/api/listings?query=${encodeURIComponent(query)}`)
      .then(r => r.json())
      .then(d => { setListings(d.listings?.length > 0 ? d.listings : DEMO_LISTINGS); setLoading(false) })
      .catch(() => { setListings(DEMO_LISTINGS); setLoading(false) })
  }, [query])

  const handleSignIn  = (u) => { setUser(u); grantXP('DAILY_LOGIN') }
  const handleSignOut = () => { setUser(null); setApiCreds(null); setAccordionOpen(false) }
  const handleHide    = (id) => setHiddenIds(p => [...p, id])
  const toggleSaved   = (id) => {
    setSaved(p => {
      if (!p.includes(id)) {
        grantXP('SAVE_LISTING')
        setUserStats(ps => { const ns = { ...ps, savedCount:(ps.savedCount||0)+1 }; saveStats(ns); return ns })
      }
      return p.includes(id) ? p.filter(x => x !== id) : [...p, id]
    })
  }

  const closeAllFilters = () => { setPriceOpen(false); setBedsOpen(false); setTypeOpen(false); setSortOpen(false) }

  const handleSearch = (e) => {
    e.preventDefault()
    grantXP('SEARCH')
    setUserStats(ps => { const ns = { ...ps, searchCount:(ps.searchCount||0)+1 }; saveStats(ns); return ns })
    setLoading(true)
    setTimeout(() => {
      const q = query.toLowerCase()
      const filtered = DEMO_LISTINGS.filter(l =>
        !query || l.city.toLowerCase().includes(q) || l.address.toLowerCase().includes(q) || l.zip.includes(q) || l.state.toLowerCase().includes(q)
      )
      setListings(filtered.length > 0 ? filtered : DEMO_LISTINGS)
      setLoading(false)
    }, 500)
  }

  const parsePriceFilter = (str) => {
    if (!str) return null
    if (str.includes('M')) return parseFloat(str) * 1000000
    return parseInt(str.replace(/\D/g, '')) * 1000
  }

  const displayed = listings
    .filter(l => !hiddenIds.includes(l.id))
    .filter(l => {
      if (filterBeds && l.beds < parseInt(filterBeds)) return false
      if (filterType && l.type !== filterType) return false
      const minV = parsePriceFilter(filterPriceMin)
      const maxV = parsePriceFilter(filterPriceMax)
      if (minV && l.price < minV) return false
      if (maxV && l.price > maxV) return false
      return true
    })
    .sort((a, b) => {
      if (sortBy === 'price_desc') return b.price - a.price
      if (sortBy === 'price_asc')  return a.price - b.price
      if (sortBy === 'newest')     return a.daysOnMarket - b.daysOnMarket
      if (sortBy === 'sqft')       return b.sqft - a.sqft
      return 0
    })

  // ── Layout + color mode resolution ───────────────────────────────────────
  const activeLayout = LAYOUTS.find(l => l.id === activeLayoutId) || LAYOUTS[0]

  const cm = {
    light:  { bg:'#f8fafc', surface:'#ffffff', surfaceAlt:'#f1f5f9', border:'rgba(0,0,0,0.08)', text:'#0f172a', textMuted:'#64748b', textFaint:'#94a3b8', headerBg:'#ffffff', cardBg:'#ffffff', inputBg:'#f8fafc', pillBg:'#f1f5f9', pillBorder:'#e2e8f0', searchShadow:'0 4px 24px rgba(0,0,0,0.08)' },
    mellow: { bg:'#1e1e2e', surface:'#27273a', surfaceAlt:'#2e2e42', border:'rgba(255,255,255,0.08)', text:'#e2e8f0', textMuted:'#94a3b8', textFaint:'#64748b', headerBg:'#1a1a2e', cardBg:'#27273a', inputBg:'#2e2e42', pillBg:'#2e2e42', pillBorder:'rgba(255,255,255,0.1)', searchShadow:'0 4px 24px rgba(0,0,0,0.3)' },
    dark:   { bg:'#0a0a0f', surface:'#111118', surfaceAlt:'#18181f', border:'rgba(255,255,255,0.06)', text:'#f1f5f9', textMuted:'#94a3b8', textFaint:'#475569', headerBg:'#0a0a0f', cardBg:'#111118', inputBg:'#18181f', pillBg:'#18181f', pillBorder:'rgba(255,255,255,0.07)', searchShadow:'0 4px 32px rgba(0,0,0,0.5)' },
  }

  const c = activeLayout.overrides ? { ...cm[colorMode], ...activeLayout.overrides } : cm[colorMode]
  const t = activeTheme

  const ModeIcon  = colorMode === 'light' ? Sun : colorMode === 'mellow' ? Sunset : Moon
  const cycleMode = () => setColorMode(p => p === 'light' ? 'mellow' : p === 'mellow' ? 'dark' : 'light')

  const pill = (active) => ({
    display:'flex', alignItems:'center', gap:'6px', padding:'7px 14px',
    border:`1px solid ${active ? t.accent : c.pillBorder}`, borderRadius:'24px',
    background: active ? `${t.accent}20` : c.pillBg, cursor:'pointer', fontSize:'13px',
    color: active ? t.accent : c.text, fontWeight:500, whiteSpace:'nowrap', transition:'all 0.2s',
  })

  const dropdown = {
    position:'absolute', top:'100%', left:0, marginTop:'8px',
    backgroundColor:c.surface, border:`1px solid ${c.border}`,
    borderRadius:'14px', boxShadow:'0 16px 48px rgba(0,0,0,0.3)',
    padding:'16px', zIndex:200,
  }

  const statusBg = (s) => ({ 'Active':'#16a34a', 'Pending':'#ea580c', 'Coming Soon':t.accent, 'Active Under Contract':'#ca8a04' }[s] || '#6b7280')
  const isPro    = user && isProfessional(user.level)
  const curLevel = getLevel(userStats.totalXP || 0)

  const accordionSections = user ? [
    { label:'👤 Account',       isAccount:true },
    { label:'🔔 Notifications', isNotifications:true },
    { label:'🎨 Appearance',    isAppearance:true },
    { label:'🎮 Gamification',  isGamification:true },
    { label:'🤖 AI Features',   isAIFeatures:true },
    ...(isPro ? [{ label:'🔌 Integrations', isIntegrations:true }] : []),
    { label:'❓ Help & Tour',   isHelp:true },
    { label:'🔒 Privacy',       isPrivacy:true },
  ] : []

  const navItems      = ['Buy', 'Rent']
  const propertyTypes = ['Single Family', 'Condo', 'Townhouse', 'Multi-Family', 'Land']
  const sortOptions   = [
    { value:'price_desc', label:'Price: High to Low' },
    { value:'price_asc',  label:'Price: Low to High' },
    { value:'newest',     label:'Newest Listed' },
    { value:'sqft',       label:'Largest First' },
  ]

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', overflow:'hidden', fontFamily:'"Inter",system-ui,sans-serif', backgroundColor:c.bg, color:c.text, transition:'background 0.3s,color 0.3s', position:'relative' }}>

      {/* Bold Tech overlays */}
      {activeLayoutId === 'bold_tech' && (
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, backgroundImage:'linear-gradient(rgba(0,245,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.04) 1px,transparent 1px)', backgroundSize:'40px 40px', opacity:0.6 }} />
      )}
      {activeLayoutId === 'bold_tech' && (
        <div style={{ position:'fixed', inset:0, pointerEvents:'none', zIndex:0, backgroundImage:'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,245,255,0.015) 2px,rgba(0,245,255,0.015) 4px)' }} />
      )}

      {/* XP toasts */}
      {gamificationEnabled && <XPToast toasts={toasts} />}

      {/* Achievement popup */}
      {newAchievement && (
        <div style={{ position:'fixed', top:'72px', left:'50%', transform:'translateX(-50%)', zIndex:99999, background:'rgba(15,15,25,0.97)', backdropFilter:'blur(16px)', border:`1px solid ${t.accent}60`, borderRadius:'16px', padding:'16px 24px', boxShadow:`0 24px 60px rgba(0,0,0,0.6)`, display:'flex', alignItems:'center', gap:'14px', minWidth:'280px' }}>
          <span style={{ fontSize:'32px' }}>{newAchievement.icon}</span>
          <div>
            <p style={{ fontWeight:900, fontSize:'14px', color:t.accent, margin:0 }}>Achievement Unlocked!</p>
            <p style={{ fontWeight:700, fontSize:'13px', color:'#fff', margin:'2px 0 0' }}>{newAchievement.label}</p>
            <p style={{ fontSize:'11px', color:'rgba(255,255,255,0.6)', margin:'2px 0 0' }}>{newAchievement.desc} · +{newAchievement.xp} XP</p>
          </div>
          <button onClick={() => setNewAchievement(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,0.4)', cursor:'pointer', fontSize:'16px', marginLeft:'auto' }}>✕</button>
        </div>
      )}

      {/* Modals */}
      {tutorialOpen && (
        <Tutorial c={c} t={t} onClose={() => setTutorialOpen(false)} onSignIn={() => setSignInOpen(true)} />
      )}
      {accountOpen      && <AccountPage    c={c} t={t} onClose={() => setAccountOpen(false)} />}
      {signInOpen       && <SignInModal     c={c} t={t} onClose={() => setSignInOpen(false)} onSignIn={handleSignIn} />}
      {gamificationOpen && <GamificationPanel c={c} t={t} stats={userStats} onClose={() => setGamificationOpen(false)} />}
      {selectedListing  && (
        <ListingModal
          listing={selectedListing} c={c} t={t}
          onClose={() => setSelectedListing(null)}
          isSaved={saved.includes(selectedListing.id)}
          onToggleSaved={toggleSaved} onHide={handleHide}
          user={user} onXP={grantXP}
        />
      )}
      {featureListing && (
        <FeaturePanel
          listing={featureListing}
          allListings={displayed}
          t={t} c={c}
          enabledFeatures={featureSettings}
          onClose={() => setFeatureListing(null)}
          onSelectListing={(l) => { setFeatureListing(null); setSelectedListing(l) }}
        />
      )}

      {/* ── HEADER ── */}
      <header style={{
        backgroundColor: activeLayoutId === 'bold_tech' ? 'rgba(5,5,16,0.88)' : c.headerBg,
        borderBottom: `1px solid ${c.border}`,
        backdropFilter: activeLayout.vars?.['--header-blur'] || 'none',
        WebkitBackdropFilter: activeLayout.vars?.['--header-blur'] || 'none',
        boxShadow: activeLayoutId === 'bold_tech' ? '0 1px 0 rgba(0,245,255,0.15),0 4px 24px rgba(0,0,0,0.4)' : 'none',
        padding: '0 20px',
        height: '58px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        zIndex: 100,
        position: 'relative',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:'28px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', boxShadow:`0 0 16px ${t.accentGlow}` }}>
              <span style={{ color:'#fff', fontWeight:900, fontSize:'18px' }}>Z</span>
            </div>
            <div style={{ lineHeight:1.1 }}>
              <div style={{ fontWeight:800, fontSize:'15px', color:c.text }}>ZephyrAI</div>
              <div style={{ fontWeight:700, fontSize:'10px', color:t.accent, letterSpacing:'1.5px', textTransform:'uppercase' }}>IDX Platform</div>
            </div>
          </div>
          <nav style={{ display:'flex', gap:'2px' }}>
            {navItems.map(item => (
              <button key={item} onClick={() => setActiveNav(item)}
                style={{ padding:'6px 14px', fontSize:'13px', fontWeight:600, border:'none', borderRadius:'8px', cursor:'pointer', transition:'all 0.2s', background:activeNav===item ? `${t.accent}18` : 'transparent', color:activeNav===item ? t.accent : c.textMuted }}>
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
          {gamificationEnabled && user && (
            <button onClick={() => setGamificationOpen(true)}
              style={{ display:'flex', alignItems:'center', gap:'6px', padding:'6px 12px', borderRadius:'10px', border:`1px solid ${t.accent}50`, background:`${t.accent}15`, cursor:'pointer', transition:'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}25` }}
              onMouseLeave={e => { e.currentTarget.style.background = `${t.accent}15` }}>
              <span style={{ fontSize:'14px' }}>{curLevel.badge}</span>
              <span style={{ fontSize:'12px', fontWeight:700, color:t.accent }}>{(userStats.totalXP||0).toLocaleString()} XP</span>
            </button>
          )}

          <button onClick={cycleMode}
            style={{ width:'38px', height:'38px', borderRadius:'10px', border:`1px solid ${c.border}`, background:c.surfaceAlt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:t.accent, transition:'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = `${t.accent}20` }}
            onMouseLeave={e => { e.currentTarget.style.background = c.surfaceAlt }}>
            <ModeIcon size={17} />
          </button>

          {/* Contact */}
          <div style={{ position:'relative' }} ref={contactRef}>
            <button onClick={() => { setContactOpen(!contactOpen); setAccordionOpen(false) }}
              style={{ width:'38px', height:'38px', borderRadius:'10px', border:`1px solid ${contactOpen ? t.accent : c.border}`, background:contactOpen ? `${t.accent}15` : c.surfaceAlt, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:contactOpen ? t.accent : c.textMuted, transition:'all 0.2s' }}>
              <MessageSquare size={17} />
            </button>
            {contactOpen && (
              <div style={{ position:'absolute', top:'100%', right:0, marginTop:'8px', backgroundColor:c.surface, border:`1px solid ${c.border}`, borderRadius:'14px', boxShadow:'0 16px 48px rgba(0,0,0,0.3)', padding:'16px', zIndex:200, width:'300px' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                  <div style={{ width:'40px', height:'40px', borderRadius:'10px', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <MessageSquare size={18} color="#fff" />
                  </div>
                  <div>
                    <p style={{ fontWeight:700, fontSize:'14px', color:c.text, margin:0 }}>Contact Us</p>
                    <p style={{ fontSize:'12px', color:c.textMuted, margin:0 }}>We reply within 1 hour</p>
                  </div>
                </div>
                {[
                  { icon:Phone,         label:'Call Us',   sub:'+1 (701) 555-0199',    color:'#16a34a' },
                  { icon:Mail,          label:'Email Us',  sub:'hello@zephyrai.idx',   color:t.accent  },
                  { icon:MessageSquare, label:'Live Chat', sub:'Start a conversation', color:'#7c3aed' },
                ].map(({ icon:Icon, label, sub, color }) => (
                  <button key={label}
                    style={{ width:'100%', display:'flex', alignItems:'center', gap:'12px', padding:'10px', borderRadius:'10px', border:'none', background:'transparent', cursor:'pointer', marginBottom:'4px', transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <div style={{ width:'34px', height:'34px', borderRadius:'8px', background:`${color}20`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                      <Icon size={16} style={{ color }} />
                    </div>
                    <div style={{ textAlign:'left' }}>
                      <p style={{ fontSize:'13px', fontWeight:600, color:c.text, margin:0 }}>{label}</p>
                      <p style={{ fontSize:'12px', color:c.textMuted, margin:0 }}>{sub}</p>
                    </div>
                    <ArrowUpRight size={14} style={{ color:c.textFaint, marginLeft:'auto' }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings */}
          <div style={{ position:'relative' }} ref={accordionRef}>
            <button onClick={() => { setAccordionOpen(!accordionOpen); setContactOpen(false) }}
              style={{ display:'flex', alignItems:'center', gap:'8px', padding:'7px 14px', borderRadius:'10px', border:`1px solid ${accordionOpen ? t.accent : c.border}`, background:accordionOpen ? `${t.accent}15` : c.surfaceAlt, cursor:'pointer', transition:'all 0.2s', color:accordionOpen ? t.accent : c.text, fontSize:'13px', fontWeight:600 }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'3.5px' }}>
                {[16,12,16].map((w,i) => (
                  <span key={i} style={{ display:'block', width:`${w}px`, height:'1.5px', background:'currentColor', borderRadius:'2px' }} />
                ))}
              </div>
              <User size={15} />
            </button>

            {accordionOpen && (
              <div style={{ position:'absolute', top:'100%', right:0, marginTop:'8px', backgroundColor:c.surface, border:`1px solid ${c.border}`, borderRadius:'14px', boxShadow:'0 16px 48px rgba(0,0,0,0.3)', padding:'8px', zIndex:300, width:'300px', maxHeight:'75vh', overflowY:'auto', isolation:'isolate' }}>
                {user ? (
                  <>
                    <div style={{ padding:'12px', borderRadius:'10px', background:c.surfaceAlt, marginBottom:'8px' }}>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px' }}>
                        <div style={{ width:'40px', height:'40px', borderRadius:'50%', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, boxShadow:`0 0 12px ${t.accentGlow}` }}>
                          <span style={{ fontSize:'18px' }}>{getLevelBadge(user.level)}</span>
                        </div>
                        <div style={{ flex:1, minWidth:0 }}>
                          <p style={{ fontWeight:700, fontSize:'13px', color:c.text, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.firstName} {user.lastName}</p>
                          <p style={{ fontSize:'11px', color:c.textMuted, margin:0, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user.email}</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                        <span style={{ padding:'3px 10px', borderRadius:'20px', fontSize:'11px', fontWeight:700, background:`${getLevelColor(user.level)}20`, color:getLevelColor(user.level), border:`1px solid ${getLevelColor(user.level)}40` }}>
                          {getLevelBadge(user.level)} {getLevelLabel(user.level)}
                        </span>
                        <button onClick={handleSignOut}
                          style={{ display:'flex', alignItems:'center', gap:'4px', padding:'4px 10px', borderRadius:'6px', border:`1px solid ${c.border}`, background:'transparent', cursor:'pointer', fontSize:'11px', color:c.textMuted, fontWeight:600 }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.color = '#ef4444' }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = c.border;  e.currentTarget.style.color = c.textMuted }}>
                          <LogOut size={11} /> Sign Out
                        </button>
                      </div>
                      {apiCreds && (
                        <div style={{ marginTop:'8px', padding:'6px 10px', borderRadius:'6px', background:'rgba(34,197,94,0.1)', border:'1px solid rgba(34,197,94,0.3)', display:'flex', alignItems:'center', gap:'5px' }}>
                          <div style={{ width:'6px', height:'6px', borderRadius:'50%', background:'#22c55e' }} />
                          <span style={{ fontSize:'11px', color:'#22c55e', fontWeight:600 }}>SparkAPI {apiCreds.mode==='live' ? 'Live' : 'Replication'} Connected</span>
                        </div>
                      )}
                    </div>
                    {accordionSections.map(section => (
                      <AccordionSection
                        key={section.label}
                        section={section} c={c} t={t}
                        colorMode={colorMode}     setColorMode={setColorMode}
                        themeCategory={themeCategory} setThemeCategory={setThemeCategory}
                        activeTheme={activeTheme} setActiveTheme={setActiveTheme}
                        THEMES={THEMES}
                        onOpenAccount={() => { setAccountOpen(true); setAccordionOpen(false) }}
                        onSaveApiCreds={handleSaveApiCreds}
                        gamificationEnabled={gamificationEnabled} setGamificationEnabled={setGamificationEnabled}
                        onOpenGamification={() => { setGamificationOpen(true); setAccordionOpen(false) }}
                        userStats={userStats}
                        featureSettings={featureSettings} setFeatureSettings={setFeatureSettings}
                        onOpenHelp={() => { setTutorialOpen(true); setAccordionOpen(false) }}
                        activeLayoutId={activeLayoutId} setActiveLayoutId={setActiveLayoutId}
                      />
                    ))}
                  </>
                ) : (
                  <div style={{ padding:'16px' }}>
                    <div style={{ textAlign:'center', marginBottom:'16px' }}>
                      <div style={{ width:'52px', height:'52px', borderRadius:'50%', background:t.gradient, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px', boxShadow:`0 0 20px ${t.accentGlow}` }}>
                        <User size={24} color="#fff" />
                      </div>
                      <p style={{ fontWeight:800, fontSize:'15px', color:c.text, margin:'0 0 4px' }}>Welcome to ZephyrAI IDX</p>
                      <p style={{ fontSize:'12px', color:c.textMuted, margin:0 }}>Sign in to access all AI features</p>
                    </div>
                    <button onClick={() => { setSignInOpen(true); setAccordionOpen(false) }}
                      style={{ width:'100%', padding:'12px', borderRadius:'10px', border:'none', background:t.gradient, color:'#fff', cursor:'pointer', fontSize:'14px', fontWeight:700, boxShadow:`0 4px 16px ${t.accentGlow}`, display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                      <User size={15} /> Sign In / Register
                    </button>
                  
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* ── SEARCH + FILTERS ── */}
      <div style={{ backgroundColor:c.surface, borderBottom:`1px solid ${c.border}`, padding:'14px 20px 12px', flexShrink:0, boxShadow:c.searchShadow, zIndex:90, position:'relative' }}>
        <form onSubmit={handleSearch} style={{ display:'flex', maxWidth:'720px', marginBottom:'12px' }}>
          <div style={{ flex:1, position:'relative' }}>
            <MapPin size={16} style={{ position:'absolute', left:'14px', top:'50%', transform:'translateY(-50%)', color:c.textFaint, pointerEvents:'none' }} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              placeholder="City, Zip, Neighborhood, Address, MLS# — Fargo ND area"
              style={{ width:'100%', padding:'11px 14px 11px 40px', border:`1px solid ${c.border}`, borderRight:'none', borderRadius:'10px 0 0 10px', fontSize:'14px', background:c.inputBg, color:c.text, outline:'none', boxSizing:'border-box' }}
              onFocus={e => { e.target.style.borderColor = t.accent; e.target.style.boxShadow = `0 0 0 3px ${t.accentGlow}` }}
              onBlur={e  => { e.target.style.borderColor = c.border; e.target.style.boxShadow = 'none' }} />
          </div>
          <button type="submit"
            style={{ padding:'11px 22px', background:t.gradient, color:'#fff', border:'none', borderRadius:'0 10px 10px 0', cursor:'pointer', display:'flex', alignItems:'center', gap:'7px', fontWeight:700, fontSize:'14px', boxShadow:`0 4px 16px ${t.accentGlow}` }}>
            <Search size={16} /> Search
          </button>
        </form>

        <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>

          {/* Price */}
          <div style={{ position:'relative' }}>
            <button style={pill(filterPriceMin||filterPriceMax)} onClick={() => { closeAllFilters(); setPriceOpen(!priceOpen) }}>
              <DollarSign size={13} />
              {filterPriceMin||filterPriceMax ? `${filterPriceMin||'Any'} – ${filterPriceMax||'Any'}` : 'Price'}
              <ChevronDown size={12} style={{ transform:priceOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
            </button>
            {priceOpen && (
              <div style={{ ...dropdown, width:'270px' }}>
                <p style={{ fontSize:'13px', fontWeight:700, color:c.text, marginBottom:'12px' }}>Price Range</p>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
                  {[['Min',filterPriceMin,setFilterPriceMin,['','$100K','$200K','$300K','$500K','$750K','$1M']],['Max',filterPriceMax,setFilterPriceMax,['','$200K','$300K','$500K','$750K','$1M','$2M']]].map(([label,val,setter,opts]) => (
                    <div key={label}>
                      <label style={{ fontSize:'11px', color:c.textMuted, fontWeight:600, display:'block', marginBottom:'5px', textTransform:'uppercase' }}>{label}</label>
                      <select value={val} onChange={e => setter(e.target.value)} style={{ width:'100%', padding:'8px', border:`1px solid ${c.border}`, borderRadius:'8px', fontSize:'13px', background:c.inputBg, color:c.text, outline:'none' }}>
                        {opts.map(p => <option key={p} value={p}>{p || `No ${label}`}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
                <button onClick={() => { setPriceOpen(false); if (filterPriceMin||filterPriceMax) grantXP('USE_FILTER') }}
                  style={{ marginTop:'12px', width:'100%', padding:'9px', background:t.gradient, color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontSize:'13px', fontWeight:700 }}>Apply</button>
              </div>
            )}
          </div>

          {/* Beds */}
          <div style={{ position:'relative' }}>
            <button style={pill(filterBeds)} onClick={() => { closeAllFilters(); setBedsOpen(!bedsOpen) }}>
              <Bed size={13} />{filterBeds ? `${filterBeds}+ Beds` : 'Beds'}
              <ChevronDown size={12} style={{ transform:bedsOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
            </button>
            {bedsOpen && (
              <div style={{ ...dropdown, width:'230px' }}>
                <p style={{ fontSize:'13px', fontWeight:700, color:c.text, marginBottom:'12px' }}>Bedrooms</p>
                <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                  {['Any','1','2','3','4','5+'].map(b => (
                    <button key={b} onClick={() => { setFilterBeds(b==='Any' ? '' : b.replace('+','')); setBedsOpen(false); grantXP('USE_FILTER') }}
                      style={{ padding:'8px 14px', borderRadius:'8px', border:`1px solid ${(b==='Any'&&!filterBeds)||filterBeds===b.replace('+','') ? t.accent : c.border}`, background:(b==='Any'&&!filterBeds)||filterBeds===b.replace('+','') ? t.accent : 'transparent', color:(b==='Any'&&!filterBeds)||filterBeds===b.replace('+','') ? '#fff' : c.text, cursor:'pointer', fontSize:'13px', fontWeight:600 }}>{b}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Type */}
          <div style={{ position:'relative' }}>
            <button style={pill(filterType)} onClick={() => { closeAllFilters(); setTypeOpen(!typeOpen) }}>
              <Home size={13} />{filterType || 'Home Type'}
              <ChevronDown size={12} style={{ transform:typeOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
            </button>
            {typeOpen && (
              <div style={{ ...dropdown, width:'210px', padding:'8px' }}>
                {['All Types',...propertyTypes].map(type => (
                  <button key={type} onClick={() => { setFilterType(type==='All Types' ? '' : type); setTypeOpen(false); grantXP('USE_FILTER') }}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderRadius:'8px', border:'none', background:'transparent', cursor:'pointer', fontSize:'13px', color:c.text, transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {type}{(filterType===type||(type==='All Types'&&!filterType)) && <Check size={14} style={{ color:t.accent }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Sort */}
          <div style={{ position:'relative' }}>
            <button style={pill(false)} onClick={() => { closeAllFilters(); setSortOpen(!sortOpen) }}>
              <TrendingUp size={13} />{sortOptions.find(s => s.value===sortBy)?.label || 'Sort'}
              <ChevronDown size={12} style={{ transform:sortOpen ? 'rotate(180deg)' : 'none', transition:'transform 0.2s' }} />
            </button>
            {sortOpen && (
              <div style={{ ...dropdown, width:'210px', padding:'8px' }}>
                {sortOptions.map(opt => (
                  <button key={opt.value} onClick={() => { setSortBy(opt.value); setSortOpen(false) }}
                    style={{ width:'100%', display:'flex', alignItems:'center', justifyContent:'space-between', padding:'9px 12px', borderRadius:'8px', border:'none', background:'transparent', cursor:'pointer', fontSize:'13px', color:c.text, transition:'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = c.surfaceAlt}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    {opt.label}{sortBy===opt.value && <Check size={14} style={{ color:t.accent }} />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button style={pill(false)}><SlidersHorizontal size={13} /> More</button>

          {(filterBeds||filterPriceMin||filterPriceMax||filterType) && (
            <button onClick={() => { setFilterBeds(''); setFilterPriceMin(''); setFilterPriceMax(''); setFilterType('') }}
              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'7px 12px', borderRadius:'24px', border:'1px solid rgba(239,68,68,0.4)', background:'rgba(239,68,68,0.1)', cursor:'pointer', fontSize:'13px', color:'#ef4444', fontWeight:600 }}>
              <X size={12} /> Clear
            </button>
          )}

          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:'10px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:'6px', padding:'5px 12px', borderRadius:'20px', background:`${t.accent}15`, border:`1px solid ${t.accent}40` }}>
              <Sparkles size={12} style={{ color:t.accent }} />
              <span style={{ fontSize:'12px', fontWeight:700, color:t.accent }}>{displayed.length} homes</span>
            </div>
            <div style={{ display:'flex', border:`1px solid ${c.border}`, borderRadius:'10px', overflow:'hidden', background:c.surfaceAlt }}>
              {[{mode:'grid',icon:LayoutGrid},{mode:'list',icon:List},{mode:'split',icon:Map}].map(({ mode, icon:Icon }) => (
                <button key={mode} onClick={() => { setViewMode(mode); if (mode==='split') grantXP('VIEW_MAP') }}
                  style={{ padding:'7px 11px', border:'none', borderLeft:mode!=='grid' ? `1px solid ${c.border}` : 'none', background:viewMode===mode ? t.accent : 'transparent', color:viewMode===mode ? '#fff' : c.textMuted, cursor:'pointer', transition:'all 0.2s', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Icon size={15} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ── */}
      <div style={{ display:'flex', flex:1, overflow:'hidden' }}>
        <div style={{ width:viewMode==='split' ? '50%' : '100%', overflowY:'auto', padding:'20px', backgroundColor:c.bg, transition:'width 0.3s' }}>

          {!loading && (
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'18px' }}>
              <div>
                <h1 style={{ fontSize:'20px', fontWeight:800, color:c.text, margin:0 }}>
                  {displayed.length} Homes For Sale · Fargo Area
                  {apiCreds && <span style={{ marginLeft:'10px', fontSize:'12px', color:'#22c55e', fontWeight:600 }}>● Live Data</span>}
                </h1>
                <p style={{ fontSize:'12px', color:c.textMuted, marginTop:'3px', display:'flex', alignItems:'center', gap:'5px' }}>
                  <Sparkles size={11} style={{ color:t.accent }} />
                  Fargo · West Fargo · Moorhead · Horace · Harwood · Dilworth
                </p>
              </div>
              {gamificationEnabled && user && (
                <button onClick={() => setGamificationOpen(true)}
                  style={{ display:'flex', alignItems:'center', gap:'8px', padding:'8px 14px', borderRadius:'12px', border:`1px solid ${t.accent}40`, background:`${t.accent}10`, cursor:'pointer', transition:'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = `${t.accent}20`}
                  onMouseLeave={e => e.currentTarget.style.background = `${t.accent}10`}>
                  <Trophy size={14} style={{ color:t.accent }} />
                  <div style={{ textAlign:'left' }}>
                    <p style={{ fontSize:'11px', fontWeight:800, color:t.accent, margin:0 }}>{curLevel.badge} {curLevel.title}</p>
                    <p style={{ fontSize:'10px', color:c.textMuted, margin:0 }}>{(userStats.achievements||[]).length}/{ACHIEVEMENTS.length} achievements</p>
                  </div>
                </button>
              )}
            </div>
          )}

          {loading ? (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
              {Array.from({ length:8 }).map((_,i) => (
                <div key={i} style={{ background:c.cardBg, borderRadius:'16px', overflow:'hidden', border:`1px solid ${c.border}`, animation:'pulse 1.5s infinite' }}>
                  <div style={{ height:'200px', background:c.surfaceAlt }} />
                  <div style={{ padding:'14px' }}>
                    <div style={{ height:'14px', background:c.surfaceAlt, borderRadius:'4px', marginBottom:'8px', width:'60%' }} />
                    <div style={{ height:'12px', background:c.surfaceAlt, borderRadius:'4px', width:'80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : displayed.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'300px' }}>
              <AlertCircle size={48} style={{ color:c.textFaint, marginBottom:'16px' }} />
              <p style={{ fontSize:'16px', fontWeight:600, color:c.text }}>No listings found</p>
              <p style={{ fontSize:'13px', color:c.textMuted, marginTop:'4px' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            <div style={{ display:'grid', gridTemplateColumns:viewMode==='list' ? '1fr' : 'repeat(auto-fill,minmax(280px,1fr))', gap:'16px' }}>
              {displayed.map(listing => {
                const isHovered    = hoveredCard === listing.id
                const isSaved_     = saved.includes(listing.id)
                const isNew        = listing.daysOnMarket <= 2
                const photos       = listing.photos || [{ url:listing.photo, label:'🏠 Exterior' }]
                const anyFeatureOn = Object.values(featureSettings).some(Boolean)

                const cardBg     = activeLayoutId === 'bold_tech' ? 'rgba(10,10,26,0.9)' : c.cardBg
                const cardRadius = activeLayout.vars?.['--radius-card'] || '16px'
                const cardBorder = activeLayoutId === 'bold_tech'
                  ? (isHovered ? `1px solid ${t.accent}` : '1px solid rgba(0,245,255,0.12)')
                  : `1px solid ${isHovered ? t.accent+'60' : c.border}`
                const cardShadow = isHovered
                  ? (activeLayoutId === 'bold_tech' ? `0 0 30px rgba(0,245,255,0.15),0 8px 32px rgba(0,0,0,0.5)` : `0 0 0 1px ${t.accent}40,0 8px 32px rgba(0,0,0,0.15)`)
                  : '0 1px 4px rgba(0,0,0,0.06)'

                return (
                  <div key={listing.id}
                    onMouseEnter={() => setHoveredCard(listing.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ background:cardBg, borderRadius:cardRadius, overflow:'hidden', border:cardBorder, cursor:'pointer', transition:'all 0.25s', boxShadow:cardShadow, transform:isHovered ? 'translateY(-3px)' : 'none', display:viewMode==='list' ? 'flex' : 'block' }}>

                    <div style={{ position:'relative', flexShrink:0, width:viewMode==='list' ? '220px' : '100%' }}
                      onClick={() => { setSelectedListing(listing); grantXP('VIEW_LISTING'); setUserStats(ps => { const ns = {...ps,viewCount:(ps.viewCount||0)+1}; saveStats(ns); return ns }) }}>
                      <PhotoCarousel photos={photos} height={viewMode==='list' ? 170 : 200} showLabel={isHovered} />

                      {/* Status badges */}
                      <div style={{ position:'absolute', top:'10px', left:'10px', display:'flex', gap:'5px', zIndex:15, pointerEvents:'none' }}>
                        <span style={{ background:statusBg(listing.status), color:'#fff', fontSize:'10px', fontWeight:700, padding:'3px 8px', borderRadius:'20px' }}>{listing.status}</span>
                        {isNew && <span style={{ background:t.accent, color:'#fff', fontSize:'10px', fontWeight:700, padding:'3px 8px', borderRadius:'20px', boxShadow:`0 0 8px ${t.accentGlow}` }}>✦ NEW</span>}
                      </div>

                      {/* Action buttons */}
                      {user && (
                        <div style={{ position:'absolute', top:'10px', right:'10px', display:'flex', gap:'5px', zIndex:15 }}>
                          <button onClick={e => { e.stopPropagation(); toggleSaved(listing.id) }}
                            style={{ width:'28px', height:'28px', borderRadius:'50%', background:isSaved_ ? t.accent : 'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}>
                            <Heart size={13} style={{ fill:isSaved_ ? '#fff' : 'none', color:'#fff' }} />
                          </button>
                          <button onClick={e => { e.stopPropagation(); grantXP('SHARE_LISTING'); setUserStats(ps => { const ns={...ps,shareCount:(ps.shareCount||0)+1}; saveStats(ns); return ns }) }}
                            style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                            <Share2 size={13} color="#fff" />
                          </button>
                          <button onClick={e => { e.stopPropagation(); handleHide(listing.id) }}
                            style={{ width:'28px', height:'28px', borderRadius:'50%', background:'rgba(0,0,0,0.5)', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.7)'}
                            onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.5)'}>
                            <EyeOff size={13} color="#fff" />
                          </button>
                        </div>
                      )}

                      {/* Price */}
                      <div style={{ position:'absolute', bottom:'10px', left:'10px', zIndex:15, pointerEvents:'none' }}>
                        <span style={{ color:'#fff', fontWeight:900, fontSize:'19px', textShadow:'0 2px 8px rgba(0,0,0,0.6)' }}>{formatPrice(listing.price)}</span>
                      </div>
                    </div>

                    {/* Card body */}
                    <div style={{ padding:'12px', flex:1 }}
                      onClick={() => { setSelectedListing(listing); grantXP('VIEW_LISTING') }}>
                      <div style={{ display:'flex', gap:'12px', marginBottom:'8px' }}>
                        {[{icon:Bed,val:listing.beds,unit:'bd'},{icon:Bath,val:listing.baths,unit:'ba'},{icon:Maximize2,val:listing.sqft?.toLocaleString(),unit:'ft²'}].map(({ icon:Icon, val, unit }) => (
                          <div key={unit} style={{ display:'flex', alignItems:'center', gap:'4px' }}>
                            <Icon size={12} style={{ color:t.accent }} />
                            <span style={{ fontSize:'12px', fontWeight:700, color:c.text }}>{val}</span>
                            <span style={{ fontSize:'10px', color:c.textFaint }}>{unit}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display:'flex', alignItems:'flex-start', gap:'4px', marginBottom:'8px' }}>
                        <MapPin size={12} style={{ color:t.accent, marginTop:'2px', flexShrink:0 }} />
                        <div>
                          <p style={{ fontSize:'12px', fontWeight:700, color:c.text, margin:0 }}>{listing.address}</p>
                          <p style={{ fontSize:'11px', color:c.textMuted, margin:'1px 0 0' }}>{listing.city}, {listing.state} {listing.zip}</p>
                        </div>
                      </div>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', paddingTop:'8px', borderTop:`1px solid ${c.border}` }}>
                        <span style={{ padding:'2px 7px', borderRadius:'5px', background:`${t.accent}15`, color:t.accent, fontSize:'10px', fontWeight:600, border:`1px solid ${t.accent}30` }}>{listing.type}</span>
                        <div style={{ display:'flex', alignItems:'center', gap:'6px' }}>
                          <span style={{ display:'flex', alignItems:'center', gap:'3px', fontSize:'10px', color:c.textFaint }}>
                            <Clock size={10} />{listing.daysOnMarket===0 ? 'Just listed' : `${listing.daysOnMarket}d`}
                          </span>
                          {anyFeatureOn && (
                            <button
                              onClick={e => { e.stopPropagation(); setFeatureListing(listing); grantXP('VIEW_LISTING') }}
                              style={{ display:'flex', alignItems:'center', gap:'5px', padding:'4px 10px', borderRadius:'20px', border:`1.5px solid ${t.accent}`, background:t.gradient, cursor:'pointer', fontSize:'11px', fontWeight:800, color:'#fff', boxShadow:`0 0 10px ${t.accentGlow},0 2px 8px rgba(0,0,0,0.2)`, animation:'aiPulse 2.2s ease-in-out infinite', transition:'all 0.2s', flexShrink:0 }}
                              onMouseEnter={e => { e.currentTarget.style.transform='scale(1.08)'; e.currentTarget.style.boxShadow=`0 0 18px ${t.accentGlow},0 4px 12px rgba(0,0,0,0.3)`; e.currentTarget.style.animation='none' }}
                              onMouseLeave={e => { e.currentTarget.style.transform='scale(1)'; e.currentTarget.style.boxShadow=`0 0 10px ${t.accentGlow},0 2px 8px rgba(0,0,0,0.2)`; e.currentTarget.style.animation='aiPulse 2.2s ease-in-out infinite' }}
                              title="Open AI Features for this listing">
                              <Zap size={11} style={{ filter:'drop-shadow(0 0 3px rgba(255,255,255,0.8))' }} />
                              AI Insights
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {viewMode === 'split' && (
          <div style={{ flex:1, position:'relative', overflow:'hidden', borderLeft:`1px solid ${c.border}` }}>
            <MapPanel listings={displayed} t={t} c={c} colorMode={colorMode} onSelectListing={setSelectedListing} onXP={grantXP} />
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:6px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:${t.accent}50;border-radius:10px}
        ::-webkit-scrollbar-thumb:hover{background:${t.accent}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes carouselFade{from{opacity:0.4;transform:scale(1.02)}to{opacity:1;transform:scale(1)}}
        @keyframes aiPulse{
          0%,100%{box-shadow:0 0 8px ${t.accentGlow},0 2px 8px rgba(0,0,0,0.2);transform:scale(1);}
          50%{box-shadow:0 0 20px ${t.accentGlow},0 0 32px ${t.accentGlow},0 2px 8px rgba(0,0,0,0.2);transform:scale(1.05);}
        }
        @keyframes aiSlideIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
        ${activeLayoutId === 'bold_tech' ? `
          h1,h2,h3,h4{font-weight:900!important;letter-spacing:-0.03em!important;}
          input:focus,select:focus,textarea:focus{box-shadow:0 0 0 2px rgba(0,245,255,0.4)!important;border-color:rgba(0,245,255,0.8)!important;}
        ` : ''}
        ${activeLayoutId === 'editorial' ? `
          h1,h2,h3{font-family:Georgia,'Times New Roman',serif!important;letter-spacing:-0.01em!important;}
        ` : ''}
      `}</style>
    </div>
  )
}
