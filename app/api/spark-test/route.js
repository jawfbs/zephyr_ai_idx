import { NextResponse } from 'next/server'
import crypto from 'crypto'

// ── OAuth 1.0a HMAC-SHA1 signer (same as listings route) ─────────────────────
function buildOAuthHeader(method, url, apiKey, apiSecret) {
  const oauthParams = {
    oauth_consumer_key:     apiKey,
    oauth_nonce:            crypto.randomBytes(16).toString('hex'),
    oauth_signature_method: 'HMAC-SHA1',
    oauth_timestamp:        Math.floor(Date.now() / 1000).toString(),
    oauth_token:            '',
    oauth_version:          '1.0',
  }

  const urlObj      = new URL(url)
  const queryParams = {}
  urlObj.searchParams.forEach((v, k) => { queryParams[k] = v })

  const allParams = { ...queryParams, ...oauthParams }

  const paramString = Object.keys(allParams)
    .sort()
    .map(k => `${encodeURIComponent(k)}=${encodeURIComponent(allParams[k])}`)
    .join('&')

  const baseString = [
    method.toUpperCase(),
    encodeURIComponent(urlObj.origin + urlObj.pathname),
    encodeURIComponent(paramString),
  ].join('&')

  const signingKey  = `${encodeURIComponent(apiSecret)}&`
  const signature   = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64')

  oauthParams.oauth_signature = signature

  const headerParts = Object.entries(oauthParams)
    .filter(([k]) => k.startsWith('oauth_') && oauthParams[k] !== '')
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${encodeURIComponent(k)}="${encodeURIComponent(v)}"`)
    .join(', ')

  return `OAuth realm="", ${headerParts}`
}

export async function POST(request) {
  try {
    const body = await request.json()
    const { apiKey, apiSecret, mode } = body

    if (!apiKey) return NextResponse.json({ success: false, message: 'API key is required' })
    if (!apiSecret) return NextResponse.json({ success: false, message: 'API secret is required for OAuth signing' })

    const base = mode === 'live'
      ? 'https://sparkapi.com/v1'
      : 'https://replication.sparkapi.com/v1'

    const url = `${base}/listings?_limit=1`

    console.log('[Spark Test] URL:', url)
    console.log('[Spark Test] Key (first 8):', apiKey?.slice(0, 8))
    console.log('[Spark Test] Secret (first 4):', apiSecret?.slice(0, 4))

    // Build OAuth signed header
    const authHeader = buildOAuthHeader('GET', url, apiKey, apiSecret)
    console.log('[Spark Test] Auth header built successfully')

    const res = await fetch(url, {
      method:  'GET',
      headers: {
        'Authorization':         authHeader,
        'Accept':                'application/json',
        'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
      },
      signal: AbortSignal.timeout(12000),
    })

    console.log('[Spark Test] Response status:', res.status)

    let bodyText = ''
    let bodyJson = null
    try {
      bodyText = await res.text()
      bodyJson = JSON.parse(bodyText)
    } catch {}

    console.log('[Spark Test] Body preview:', bodyText?.slice(0, 400))

    // ── Success ───────────────────────────────────────────────────────────
    if (res.ok) {
      const results  = bodyJson?.D?.Results || bodyJson?.Results || bodyJson?.value || []
      return NextResponse.json({
        success:     true,
        status:      res.status,
        mode,
        resultCount: results.length,
        message:     `✅ OAuth signing worked! Connected to Spark ${mode === 'live' ? 'Live' : 'Replication'} API. Found ${results.length} listing(s).`,
        sampleId:    results[0]?.Id || results[0]?.ListingId || null,
        sampleCity:  results[0]?.StandardFields?.City || null,
      })
    }

    // ── Parse Spark error ─────────────────────────────────────────────────
    const sparkMsg  = bodyJson?.D?.Message || bodyJson?.message || bodyJson?.error_description || ''
    const sparkCode = bodyJson?.D?.Code    || bodyJson?.code    || ''

    const statusMessages = {
      401: 'OAuth signature rejected. Check that your API key AND secret are both correct.',
      403: 'Access forbidden. Your account may not have replication access enabled. Contact FBS support.',
      404: 'Endpoint not found.',
      429: 'Rate limit exceeded.',
      500: 'Spark server error.',
    }

    return NextResponse.json({
      success: false,
      status:  res.status,
      mode,
      message: [
        `❌ ${statusMessages[res.status] || `HTTP ${res.status}`}`,
        sparkMsg  ? `Spark message: "${sparkMsg}"` : '',
        sparkCode ? `Spark code: ${sparkCode}`     : '',
        '',
        'Common fixes:',
        '• Make sure BOTH the API Key AND API Secret are entered correctly',
        '• Keys are found at sparkplatform.com/developers → your application',
        '• For Replication: your FBS account must have replication enabled',
        '• Try the Live mode if Replication is not provisioned yet',
      ].filter(Boolean).join('\n'),
      debug: {
        url,
        status:            res.status,
        sparkMessage:      sparkMsg,
        sparkCode,
        bodyPreview:       bodyText?.slice(0, 300),
      },
    })

  } catch (err) {
    console.error('[Spark Test] Error:', err)
    return NextResponse.json({
      success: false,
      message: `Server error: ${err.message}`,
      debug:   { error: err.message },
    })
  }
}
