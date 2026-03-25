import { NextResponse } from 'next/server'
import crypto from 'crypto'

const BASE = {
  live:        'https://sparkapi.com/v1',
  replication: 'https://replication.sparkapi.com/v1',
}

// ── OAuth 1.0a HMAC-SHA1 ─────────────────────────────────────────────────────
function pct(s) { return encodeURIComponent(String(s)) }

function sign(method, rawUrl, consumerKey, consumerSecret) {
  const op = {
    oauth_consumer_key:     consumerKey,
    oauth_nonce:            crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        String(Math.floor(Date.now() / 1000)),
    oauth_version:          '1.0',
  }
  const u  = new URL(rawUrl)
  const qp = {}
  u.searchParams.forEach((v, k) => { qp[k] = v })
  const all    = { ...qp, ...op }
  const sorted = Object.keys(all).sort().map(k => `${pct(k)}=${pct(all[k])}`).join('&')
  const base   = `${method.toUpperCase()}&${pct(u.origin + u.pathname)}&${pct(sorted)}`
  const key    = `${pct(consumerSecret)}&`
  op.oauth_signature = crypto.createHmac('sha1', key).update(base).digest('base64')
  const parts  = Object.entries(op).sort(([a],[b])=>a.localeCompare(b)).map(([k,v])=>`${pct(k)}="${pct(v)}"`).join(', ')
  return `OAuth realm="", ${parts}`
}

// ── Mapping helpers ───────────────────────────────────────────────────────────
function photoLabel(i) {
  return ['🏠 Exterior','🛋️ Living Room','🍳 Kitchen','🛏️ Master Bedroom','🛏️ Guest Bedroom','🎮 Game Room','🏊 Pool','🚁 Drone View'][i] || `📷 Photo ${i+1}`
}
function mapType(r='') {
  r = r.toLowerCase()
  if (r.includes('condo'))  return 'Condo'
  if (r.includes('town'))   return 'Townhouse'
  if (r.includes('multi'))  return 'Multi-Family'
  if (r.includes('land'))   return 'Land'
  return 'Single Family'
}
function mapStatus(r='') {
  r = r.toLowerCase()
  if (r.includes('pending'))           return 'Pending'
  if (r.includes('coming'))            return 'Coming Soon'
  if (r.includes('under contract'))    return 'Active Under Contract'
  if (r.includes('closed')||r.includes('sold')) return 'Sold'
  return 'Active'
}
function mapListing(raw, idx) {
  const s   = raw.StandardFields || raw
  const lat = parseFloat(s.Latitude  || s.GeoLat || 0) || null
  const lon = parseFloat(s.Longitude || s.GeoLon || 0) || null
  const mediaArr = raw.Media || s.Media || raw.Photos || s.Photos || []
  const photos   = mediaArr
    .filter(m => m && (m.Uri || m.MediaUri || m.Url))
    .sort((a,b) => (a.Order||0)-(b.Order||0))
    .map((m,i) => ({ url: m.Uri||m.MediaUri||m.Url, label: photoLabel(i) }))
  const fallback = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'
  const address  = [s.StreetNumber,s.StreetDirPrefix,s.StreetName,s.StreetSuffix]
    .filter(Boolean).join(' ').replace(/\s+/g,' ').trim() || s.UnparsedAddress || 'Address Not Available'
  return {
    id:           raw.Id || raw.ListingId || `spark_${idx}`,
    mlsId:        s.ListingId || s.MlsId || raw.Id || '',
    address,
    city:         s.City            || s.PostalCity  || '',
    state:        s.StateOrProvince || s.State        || '',
    zip:          s.PostalCode      || '',
    price:        parseFloat(s.ListPrice  || s.CurrentPrice || 0),
    beds:         parseInt(s.BedsTotal    || s.Bedrooms     || 0),
    baths:        parseFloat(s.BathsTotal || s.BathroomsTotalDecimal || s.BathroomsFull || 0),
    sqft:         parseInt(s.BuildingAreaTotal || s.LivingArea || 0),
    type:         mapType(s.PropertySubType   || s.PropertyType  || ''),
    status:       mapStatus(s.StandardStatus  || s.MlsStatus     || ''),
    daysOnMarket: parseInt(s.DaysOnMarket     || 0),
    yearBuilt:    parseInt(s.YearBuilt || 0) || null,
    lotSize:      s.LotSizeArea ? `${s.LotSizeArea} ${s.LotSizeUnits||'acres'}` : null,
    description:  s.PublicRemarks || '',
    lat, lon,
    photo:        photos[0]?.url || fallback,
    photos:       photos.length > 0 ? photos : [{ url:fallback, label:'🏠 Exterior' }],
  }
}
function buildFilter(query) {
  if (!query) return "City Eq 'Fargo' Or City Eq 'West Fargo' Or City Eq 'Moorhead'"
  const q = query.trim()
  if (/^\d{5}$/.test(q))        return `PostalCode Eq '${q}'`
  if (/^[A-Z]{2}\d+$/i.test(q)) return `ListingId Eq '${q.toUpperCase()}'`
  return `City Eq '${q}'`
}

// ── GET /api/listings ─────────────────────────────────────────────────────────
export async function GET(request) {
  const sp        = new URL(request.url).searchParams
  const query     = sp.get('query')     || ''
  const apiKey    = sp.get('apiKey')    || process.env.SPARK_API_KEY    || ''
  const apiSecret = sp.get('apiSecret') || process.env.SPARK_API_SECRET || ''
  const mode      = sp.get('mode')      || 'replication'
  const limit     = parseInt(sp.get('limit') || '50')

  if (!apiKey || !apiSecret) {
    return NextResponse.json({ success:false, source:'no_credentials', message:'API key and secret are both required', listings:[] })
  }

  const base   = BASE[mode] || BASE.replication
  const filter = buildFilter(query)
  const fields = [
    'ListingId','StandardStatus','MlsStatus','Status',
    'ListPrice','CurrentPrice',
    'StreetNumber','StreetDirPrefix','StreetName','StreetSuffix','UnparsedAddress',
    'City','PostalCity','StateOrProvince','State','PostalCode',
    'BedsTotal','Bedrooms','BathsTotal','BathroomsTotalDecimal','BathroomsFull',
    'BuildingAreaTotal','LivingArea','AboveGradeFinishedArea',
    'PropertySubType','PropertyType',
    'YearBuilt','DaysOnMarket','CumulativeDaysOnMarket',
    'PublicRemarks','LotSizeArea','LotSizeUnits',
    'Latitude','Longitude','GeoLat','GeoLon',
  ].join(',')

  const url  = `${base}/listings?_limit=${limit}&_filter=${encodeURIComponent(filter)}&_expand=Photos&_fields=${encodeURIComponent(fields)}`
  const auth = sign('GET', url, apiKey, apiSecret)

  console.log('[Spark] URL:', url)
  console.log('[Spark] Key[:8]:', apiKey.slice(0,8))

  try {
    const res = await fetch(url, {
      headers: {
        Authorization:          auth,
        Accept:                 'application/json',
        'X-SparkApi-User-Agent':'ZephyrAI/1.0',
      },
      signal: AbortSignal.timeout(15000),
      next:   { revalidate: 60 },
    })

    console.log('[Spark] status:', res.status)

    if (!res.ok) {
      const txt = await res.text().catch(()=>'')
      let   msg = ''
      try { msg = JSON.parse(txt)?.D?.Message || '' } catch {}
      console.error('[Spark] error:', res.status, msg)
      return NextResponse.json({ success:false, source:'api_error', status:res.status, message:msg||`HTTP ${res.status}`, listings:[] })
    }

    const data = await res.json()
    const raw  = data?.D?.Results || data?.Results || data?.value || []

    console.log('[Spark] results:', raw.length)

    if (!raw.length) {
      return NextResponse.json({ success:true, source:'spark_api', mode, count:0, message:'No listings found', listings:[] })
    }

    const listings = raw.map((item,i) => mapListing(item,i))
    return NextResponse.json({ success:true, source:'spark_api', mode, count:listings.length, listings })

  } catch (err) {
    console.error('[Spark] fetch error:', err.message)
    return NextResponse.json({ success:false, source:'network_error', message:err.message, listings:[] })
  }
}
