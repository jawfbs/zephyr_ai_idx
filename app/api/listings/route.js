import { NextResponse } from 'next/server'
import crypto from 'crypto'

// ── Spark API base URLs ───────────────────────────────────────────────────────
const SPARK_BASE = {
  live:        'https://sparkapi.com/v1',
  replication: 'https://replication.sparkapi.com/v1',
}

// ── OAuth 1.0a HMAC-SHA1 signer ──────────────────────────────────────────────
// Spark requires every request to be signed with OAuth 1.0a
function buildOAuthHeader(method, url, apiKey, apiSecret, extraParams = {}) {
  const oauthParams = {
    oauth_consumer_key:     apiKey,
    oauth_nonce:            crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        Math.floor(Date.now() / 1000).toString(),
    oauth_token:            '',
    oauth_version:          '1.0',
  }

  // Parse query params from the URL
  const urlObj       = new URL(url)
  const queryParams  = {}
  urlObj.searchParams.forEach((v, k) => { queryParams[k] = v })

  // Combine all params for signature base string
  const allParams = { ...queryParams, ...oauthParams, ...extraParams }

  // Sort and encode
  const paramString = Object.keys(allParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&')

  // Signature base string
  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(urlObj.origin + urlObj.pathname),
    encodeURIComponent(paramString),
  ].join('&')

  // Signing key — consumer secret + '&' + token secret (empty for 2-legged)
  const signingKey = `${encodeURIComponent(apiSecret)}&`

  // HMAC-SHA1 signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64')

  oauthParams.oauth_signature = signature

  // Build Authorization header (only oauth_ params go in header)
  const headerParts = Object.entries(oauthParams)
    .filter(([k]) => k.startsWith('oauth_') && oauthParams[k] !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(', ')

  return `OAuth realm="", ${headerParts}`
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
  const photos   = mediaArr
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
    price:        parseFloat(s.ListPrice  || s.CurrentPrice || 0),
    beds:         parseInt(s.BedsTotal    || s.Bedrooms     || 0),
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

// ── Main GET handler ──────────────────────────────────────────────────────────
export async function GET(request) {
  const sp        = new URL(request.url).searchParams
  const query     = sp.get('query')     || ''
  const apiKey    = sp.get('apiKey')    || process.env.SPARK_API_KEY    || ''
  const apiSecret = sp.get('apiSecret') || process.env.SPARK_API_SECRET || ''
  const mode      = sp.get('mode')      || 'replication'
  const limit     = parseInt(sp.get('limit') || '50')

  if (!apiKey || !apiSecret) {
    return NextResponse.json({
      success: false,
      source:  'no_credentials',
      message: 'Both API key and API secret are required for Spark OAuth signing',
      listings: [],
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
  console.log('[Spark Listings] Key (first 8):', apiKey?.slice(0, 8))

  try {
    // Build OAuth 1.0a signed header
    const authHeader = buildOAuthHeader('GET', url, apiKey, apiSecret)

    console.log('[Spark Listings] OAuth header built — making request')

    const res = await fetch(url, {
      method:  'GET',
      headers: {
        'Authorization':         authHeader,
        'Accept':                'application/json',
        'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
      },
      signal: AbortSignal.timeout(15000),
      next:   { revalidate: 60 },
    })

    console.log('[Spark Listings] Response status:', res.status)

    if (res.status === 401 || res.status === 403) {
      const txt = await res.text().catch(() => '')
      let msg = ''
      try { msg = JSON.parse(txt)?.D?.Message || '' } catch {}
      console.error('[Spark Listings] Auth error:', res.status, msg)
      return NextResponse.json({
        success: false,
        source:  'auth_error',
        status:  res.status,
        message: msg || 'Authentication failed',
        listings: [],
      })
    }

    if (res.status === 429) {
      return NextResponse.json({
        success: false, source: 'rate_limit',
        message: 'Rate limit exceeded — try again shortly', listings: [],
      })
    }

    if (!res.ok) {
      const txt = await res.text().catch(() => '')
      console.error('[Spark Listings] Non-OK:', res.status, txt?.slice(0, 300))
      return NextResponse.json({
        success: false, source: 'api_error',
        status: res.status, message: `Spark returned HTTP ${res.status}`, listings: [],
      })
    }

    const data = await res.json()
    const raw  = data?.D?.Results || data?.Results || data?.value || []

    console.log('[Spark Listings] Results count:', raw.length)

    if (!Array.isArray(raw) || raw.length === 0) {
      return NextResponse.json({
        success: true, source: 'spark_api', mode,
        count: 0, message: 'No listings found for this search', listings: [],
      })
    }

    const listings = raw.map((item, i) => mapListing(item, i))

    return NextResponse.json({
      success:  true,
      source:   'spark_api',
      mode,
      count:    listings.length,
      listings,
    })

  } catch (err) {
    console.error('[Spark Listings] Fetch error:', err.message)
    return NextResponse.json({
      success: false, source: 'network_error',
      message: `Network error: ${err.message}`, listings: [],
    })
  }
}
