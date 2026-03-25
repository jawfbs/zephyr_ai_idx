import { NextResponse } from 'next/server'

// ── Correct Spark API base URLs ───────────────────────────────────────────────
const SPARK_BASE = {
  live:        'https://sparkapi.com/v1',
  replication: 'https://replication.sparkapi.com/v1',
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function photoLabel(i) {
  return [
    '🏠 Exterior', '🛋️ Living Room', '🍳 Kitchen',
    '🛏️ Master Bedroom', '🛏️ Guest Bedroom', '🎮 Game Room',
    '🏊 Pool', '🚁 Drone View',
  ][i] || `📷 Photo ${i + 1}`
}

function mapType(raw = '') {
  const r = raw.toLowerCase()
  if (r.includes('condo'))                     return 'Condo'
  if (r.includes('town'))                      return 'Townhouse'
  if (r.includes('multi'))                     return 'Multi-Family'
  if (r.includes('land') || r.includes('lot')) return 'Land'
  return 'Single Family'
}

function mapStatus(raw = '') {
  const r = raw.toLowerCase()
  if (r.includes('pending'))                              return 'Pending'
  if (r.includes('coming'))                               return 'Coming Soon'
  if (r.includes('under contract') || r.includes(' uc')) return 'Active Under Contract'
  if (r.includes('closed') || r.includes('sold'))        return 'Sold'
  return 'Active'
}

function mapListing(raw, idx) {
  const s = raw.StandardFields || raw

  const lat = parseFloat(s.Latitude  || s.GeoLat || 0) || null
  const lon = parseFloat(s.Longitude || s.GeoLon || 0) || null

  const mediaArr = raw.Media || s.Media || raw.Photos || s.Photos || []
  const photos = mediaArr
    .filter(m => m && (m.Uri || m.MediaUri || m.Url))
    .sort((a, b) => (a.Order || a.MediaOrder || 0) - (b.Order || b.MediaOrder || 0))
    .map((m, i) => ({ url: m.Uri || m.MediaUri || m.Url, label: photoLabel(i) }))

  const fallback = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'

  const address = [s.StreetNumber, s.StreetDirPrefix, s.StreetName, s.StreetSuffix]
    .filter(Boolean).join(' ').replace(/\s+/g, ' ').trim()
    || s.UnparsedAddress || s.StreetAddress || 'Address Not Available'

  return {
    id:           raw.Id || raw.ListingId || `spark_${idx}`,
    mlsId:        s.ListingId || s.MlsId  || raw.Id || '',
    address,
    city:         s.City            || s.PostalCity   || '',
    state:        s.StateOrProvince || s.State         || '',
    zip:          s.PostalCode      || '',
    price:        parseFloat(s.ListPrice || s.CurrentPrice || 0),
    beds:         parseInt(s.BedsTotal   || s.Bedrooms     || 0),
    baths:        parseFloat(s.BathsTotal || s.BathroomsTotalDecimal || s.BathroomsFull || 0),
    sqft:         parseInt(s.BuildingAreaTotal || s.LivingArea || s.AboveGradeFinishedArea || 0),
    type:         mapType(s.PropertySubType   || s.PropertyType || ''),
    status:       mapStatus(s.StandardStatus  || s.MlsStatus    || s.Status || ''),
    daysOnMarket: parseInt(s.DaysOnMarket     || s.CumulativeDaysOnMarket || 0),
    yearBuilt:    parseInt(s.YearBuilt || 0) || null,
    lotSize:      s.LotSizeArea ? `${s.LotSizeArea} ${s.LotSizeUnits || 'acres'}` : null,
    description:  s.PublicRemarks || s.PrivateRemarks || '',
    lat,
    lon,
    photo:        photos[0]?.url || fallback,
    photos:       photos.length > 0 ? photos : [{ url: fallback, label: '🏠 Exterior' }],
  }
}

function buildFilter(query) {
  if (!query) return "City Eq 'Fargo' Or City Eq 'West Fargo' Or City Eq 'Moorhead'"
  const q = query.trim()
  if (/^\d{5}$/.test(q))        return `PostalCode Eq '${q}'`
  if (/^[A-Z]{2}\d+$/i.test(q)) return `ListingId Eq '${q.toUpperCase()}'`
  return `City Eq '${q}'`
}

function authFormats(apiKey, apiSecret) {
  return [
    { name: 'SparkApi key', value: `SparkApi key="${apiKey}"` },
    { name: 'Bearer',       value: `Bearer ${apiKey}` },
    { name: 'Basic',        value: `Basic ${Buffer.from(`${apiKey}:${apiSecret || ''}`).toString('base64')}` },
  ]
}

// ── Main handler ──────────────────────────────────────────────────────────────
export async function GET(request) {
  const sp        = new URL(request.url).searchParams
  const query     = sp.get('query')     || ''
  const apiKey    = sp.get('apiKey')    || process.env.SPARK_API_KEY    || ''
  const apiSecret = sp.get('apiSecret') || process.env.SPARK_API_SECRET || ''
  const mode      = sp.get('mode')      || 'replication'
  const limit     = parseInt(sp.get('limit') || '50')

  if (!apiKey) {
    return NextResponse.json({
      success: false, source: 'no_credentials',
      message: 'No API key provided', listings: [],
    })
  }

  const base   = SPARK_BASE[mode] || SPARK_BASE.replication
  const filter = buildFilter(query)

  const fields = [
    'ListingId', 'StandardStatus', 'MlsStatus', 'Status',
    'ListPrice', 'CurrentPrice',
    'StreetNumber', 'StreetDirPrefix', 'StreetName', 'StreetSuffix',
    'UnparsedAddress', 'StreetAddress',
    'City', 'PostalCity', 'StateOrProvince', 'State', 'PostalCode',
    'BedsTotal', 'Bedrooms', 'BathsTotal', 'BathroomsTotalDecimal', 'BathroomsFull',
    'BuildingAreaTotal', 'LivingArea', 'AboveGradeFinishedArea',
    'PropertySubType', 'PropertyType',
    'YearBuilt', 'DaysOnMarket', 'CumulativeDaysOnMarket',
    'PublicRemarks', 'PrivateRemarks',
    'LotSizeArea', 'LotSizeUnits',
    'Latitude', 'Longitude', 'GeoLat', 'GeoLon',
  ].join(',')

  const url = `${base}/listings?_limit=${limit}&_filter=${encodeURIComponent(filter)}&_expand=Photos&_fields=${encodeURIComponent(fields)}`

  console.log('[Spark Listings] URL:', url)
  console.log('[Spark Listings] Mode:', mode)

  for (const fmt of authFormats(apiKey, apiSecret)) {
    try {
      console.log('[Spark Listings] Trying:', fmt.name)

      const res = await fetch(url, {
        method:  'GET',
        headers: {
          'Authorization':         fmt.value,
          'Accept':                'application/json',
          'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
        },
        signal: AbortSignal.timeout(15000),
        next:   { revalidate: 60 },
      })

      console.log('[Spark Listings]', fmt.name, '→ status:', res.status)

      if (res.status === 429) {
        return NextResponse.json({
          success: false, source: 'rate_limit',
          message: 'Rate limit exceeded — try again in a moment', listings: [],
        })
      }

      if (res.status === 401 || res.status === 403) {
        // Try next auth format
        continue
      }

      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        console.warn('[Spark Listings] Non-OK response:', res.status, txt?.slice(0, 200))
        continue
      }

      const data = await res.json()
      const raw  = data?.D?.Results || data?.Results || data?.value || []

      console.log('[Spark Listings] Results count:', raw.length, '| Auth format used:', fmt.name)

      if (!Array.isArray(raw) || raw.length === 0) {
        return NextResponse.json({
          success: true, source: 'spark_api', mode,
          count: 0, message: 'No listings found for this search',
          listings: [],
        })
      }

      const listings = raw.map((item, i) => mapListing(item, i))

      return NextResponse.json({
        success:    true,
        source:     'spark_api',
        mode,
        authFormat: fmt.name,
        count:      listings.length,
        listings,
      })

    } catch (err) {
      console.error('[Spark Listings]', fmt.name, 'error:', err.message)
    }
  }

  return NextResponse.json({
    success: false,
    source:  'auth_failed',
    message: 'Could not authenticate with Spark API. Verify your key has Listings permission.',
    listings: [],
  })
}
