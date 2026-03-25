import { NextResponse } from 'next/server'

// ── Spark API (FBS) listing fetcher ──────────────────────────────────────────
// Supports both Replication and Live (Hybrid) modes.
// Docs: https://sparkplatform.com/docs/api_services/listings

const SPARK_BASE_LIVE        = 'https://api.sparkplatform.com/v1'
const SPARK_BASE_REPLICATION = 'https://replication.sparkplatform.com/api/v1'

// ── Field mappings from Spark → our listing schema ───────────────────────────
function mapSparkListing(raw, index) {
  const std = raw.StandardFields || {}

  const lat = std.Latitude  || std.GeoLat || null
  const lon = std.Longitude || std.GeoLon || null

  // Photos: Spark returns Media array
  const media  = raw.Media || std.Media || []
  const photos = media
    .filter(m => m.MediaCategory === 'Photo' || m.MediaType === 'Photo' || m.Uri)
    .sort((a, b) => (a.Order||0) - (b.Order||0))
    .map((m, i) => ({
      url:   m.Uri || m.MediaUri || m.Url || '',
      label: photoLabel(i),
    }))
    .filter(p => p.url)

  // Fallback photo if none
  const fallbackPhoto = 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80'

  const price       = std.ListPrice         || std.ClosePrice  || 0
  const beds        = std.BedsTotal         || std.Bedrooms    || 0
  const baths       = std.BathsTotal        || std.BathroomsTotalDecimal || std.BathroomsFull || 0
  const sqft        = std.BuildingAreaTotal || std.LivingArea  || std.AboveGradeFinishedArea || 0
  const address     = std.StreetNumber && std.StreetName
    ? `${std.StreetNumber} ${std.StreetDirPrefix||''} ${std.StreetName} ${std.StreetSuffix||''}`.replace(/\s+/g,' ').trim()
    : std.UnparsedAddress || std.StreetAddress || 'Address Unavailable'

  return {
    id:           raw.Id   || raw.ListingId || `spark_${index}`,
    mlsId:        std.ListingId || std.MlsId || raw.Id || '',
    address,
    city:         std.City          || std.PostalCity || '',
    state:        std.StateOrProvince || std.State || '',
    zip:          std.PostalCode    || '',
    price,
    beds,
    baths,
    sqft,
    type:         mapPropertyType(std.PropertySubType || std.PropertyType || ''),
    status:       mapStatus(std.StandardStatus || std.MlsStatus || std.Status || 'Active'),
    daysOnMarket: std.DaysOnMarket  || std.CumulativeDaysOnMarket || 0,
    yearBuilt:    std.YearBuilt     || null,
    lotSize:      std.LotSizeArea   ? `${std.LotSizeArea} ${std.LotSizeUnits||'acres'}` : null,
    description:  std.PublicRemarks || std.PrivateRemarks || '',
    lat:          lat ? parseFloat(lat) : null,
    lon:          lon ? parseFloat(lon) : null,
    photo:        photos[0]?.url || fallbackPhoto,
    photos:       photos.length > 0 ? photos : [{ url: fallbackPhoto, label: '🏠 Exterior' }],
  }
}

function photoLabel(i) {
  const labels = ['🏠 Exterior','🛋️ Living Room','🍳 Kitchen','🛏️ Master Bedroom','🛏️ Guest Bedroom','🎮 Game Room','🏊 Pool','🚁 Drone View']
  return labels[i] || `📷 Photo ${i + 1}`
}

function mapPropertyType(raw) {
  const r = raw.toLowerCase()
  if (r.includes('condo') || r.includes('condominium')) return 'Condo'
  if (r.includes('town'))                               return 'Townhouse'
  if (r.includes('multi'))                              return 'Multi-Family'
  if (r.includes('land') || r.includes('lot'))          return 'Land'
  return 'Single Family'
}

function mapStatus(raw) {
  const r = raw.toLowerCase()
  if (r.includes('pending'))                             return 'Pending'
  if (r.includes('coming'))                              return 'Coming Soon'
  if (r.includes('under contract') || r.includes('uc')) return 'Active Under Contract'
  if (r.includes('closed') || r.includes('sold'))       return 'Sold'
  return 'Active'
}

// ── Build Spark query params ──────────────────────────────────────────────────
function buildSparkParams(query, limit = 50) {
  const params = new URLSearchParams({
    _limit:  String(limit),
    _expand: 'Photos,Media',
    _fields: [
      'ListingId','StandardStatus','MlsStatus','ListPrice','ClosePrice',
      'StreetNumber','StreetDirPrefix','StreetName','StreetSuffix','UnparsedAddress',
      'City','StateOrProvince','PostalCode',
      'BedsTotal','BathsTotal','BathroomsTotalDecimal','BathroomsFull',
      'BuildingAreaTotal','LivingArea','AboveGradeFinishedArea',
      'PropertySubType','PropertyType',
      'YearBuilt','DaysOnMarket','CumulativeDaysOnMarket',
      'PublicRemarks','LotSizeArea','LotSizeUnits',
      'Latitude','Longitude','GeoLat','GeoLon',
      'Media',
    ].join(','),
  })

  // Location filter
  if (query) {
    const q = query.trim()
    // Zip code
    if (/^\d{5}$/.test(q)) {
      params.set('_filter', `PostalCode Eq '${q}'`)
    // MLS ID
    } else if (/^[A-Z]{2}\d+$/i.test(q)) {
      params.set('_filter', `ListingId Eq '${q.toUpperCase()}'`)
    // City name
    } else {
      params.set('_filter', `City Eq '${q}'`)
    }
  } else {
    // Default: Fargo ND area
    params.set('_filter', "City Eq 'Fargo' Or City Eq 'West Fargo' Or City Eq 'Moorhead'")
  }

  return params
}

// ── Auth header builders ──────────────────────────────────────────────────────
function getAuthHeaders(apiKey, apiSecret, mode) {
  if (mode === 'oauth') {
    // Bearer token mode (if apiKey is already an access token)
    return {
      'Authorization': `Bearer ${apiKey}`,
      'Accept':        'application/json',
      'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
    }
  }
  // API Key mode (most common for Spark)
  return {
    'Authorization': `SparkApi key="${apiKey}"`,
    'Accept':        'application/json',
    'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
  }
}

// ── Main route handler ────────────────────────────────────────────────────────
export async function GET(request) {
  const { searchParams } = new URL(request.url)

  const query     = searchParams.get('query')     || ''
  const apiKey    = searchParams.get('apiKey')    || process.env.SPARK_API_KEY    || ''
  const apiSecret = searchParams.get('apiSecret') || process.env.SPARK_API_SECRET || ''
  const mode      = searchParams.get('mode')      || 'replication'
  const limit     = parseInt(searchParams.get('limit') || '50')

  // ── No credentials — return demo signal ──────────────────────────────────
  if (!apiKey) {
    return NextResponse.json({
      success: false,
      source:  'no_credentials',
      message: 'No Spark API credentials provided',
      listings: [],
    })
  }

  const base    = mode === 'live' ? SPARK_BASE_LIVE : SPARK_BASE_REPLICATION
  const params  = buildSparkParams(query, limit)
  const headers = getAuthHeaders(apiKey, apiSecret, 'apikey')
  const url     = `${base}/listings?${params.toString()}`

  console.log('[Spark API] Fetching:', url)

  try {
    const res = await fetch(url, {
      headers,
      next: { revalidate: 60 }, // cache 60 seconds
    })

    // ── Handle auth errors ──────────────────────────────────────────────────
    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({
        success: false,
        source:  'auth_error',
        status:  res.status,
        message: 'Invalid Spark API credentials. Check your API key and secret.',
        listings: [],
      }, { status: 200 }) // return 200 so client can handle gracefully
    }

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[Spark API] Error response:', res.status, text)
      return NextResponse.json({
        success: false,
        source:  'api_error',
        status:  res.status,
        message: `Spark API returned ${res.status}`,
        listings: [],
      }, { status: 200 })
    }

    const data = await res.json()

    // Spark wraps results in D.Results or just Results
    const raw = data?.D?.Results || data?.Results || data?.value || []

    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({
        success:  true,
        source:   'spark_api',
        count:    0,
        message:  'No listings found for this search',
        listings: [],
      })
    }

    const listings = raw.map((item, i) => mapSparkListing(item, i))

    return NextResponse.json({
      success:  true,
      source:   'spark_api',
      mode,
      count:    listings.length,
      listings,
    })

  } catch (err) {
    console.error('[Spark API] Fetch error:', err)
    return NextResponse.json({
      success: false,
      source:  'network_error',
      message: err.message || 'Network error connecting to Spark API',
      listings: [],
    }, { status: 200 })
  }
}
