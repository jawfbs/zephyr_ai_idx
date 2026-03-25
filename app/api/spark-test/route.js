import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const body = await request.json()
    const { apiKey, apiSecret, mode } = body

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key is required' })
    }

    // ── Spark API endpoints ───────────────────────────────────────────────
    // Replication: https://replication.sparkplatform.com/api/v1
    // Live/Hybrid: https://api.sparkplatform.com/v1
    const base = mode === 'live'
      ? 'https://api.sparkplatform.com/v1'
      : 'https://replication.sparkplatform.com/api/v1'

    const url = `${base}/listings?_limit=1`

    console.log('[Spark Test] Mode:', mode)
    console.log('[Spark Test] Base URL:', base)
    console.log('[Spark Test] Full URL:', url)
    console.log('[Spark Test] API Key (first 8):', apiKey?.slice(0, 8) + '...')

    // ── Try multiple auth header formats ─────────────────────────────────
    // Spark supports several depending on account type
    const authFormats = [
      // Format 1: Standard SparkApi key format
      { name: 'SparkApi key', header: `SparkApi key="${apiKey}"` },
      // Format 2: Bearer token (if key is an OAuth access token)
      { name: 'Bearer',       header: `Bearer ${apiKey}` },
      // Format 3: Basic auth with key:secret
      { name: 'Basic',        header: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString('base64')}` },
      // Format 4: Just the key as-is
      { name: 'ApiKey plain', header: apiKey },
    ]

    const results = []

    for (const fmt of authFormats) {
      try {
        console.log(`[Spark Test] Trying auth format: ${fmt.name}`)

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Authorization':         fmt.header,
            'Accept':                'application/json',
            'Content-Type':          'application/json',
            'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
          },
          signal: AbortSignal.timeout(10000),
        })

        let responseBody = ''
        let responseJson = null
        try {
          responseBody = await res.text()
          responseJson = JSON.parse(responseBody)
        } catch {
          // body is not JSON
        }

        console.log(`[Spark Test] ${fmt.name} → status: ${res.status}`)
        console.log(`[Spark Test] ${fmt.name} → body preview:`, responseBody?.slice(0, 300))

        results.push({
          format:     fmt.name,
          status:     res.status,
          ok:         res.ok,
          body:       responseBody?.slice(0, 500),
          json:       responseJson,
        })

        // If this format worked — return success immediately
        if (res.ok) {
          const listings = responseJson?.D?.Results || responseJson?.Results || responseJson?.value || []
          return NextResponse.json({
            success:        true,
            status:         res.status,
            mode,
            workingFormat:  fmt.name,
            resultCount:    listings.length,
            message:        `✅ Connected! Working auth format: "${fmt.name}". Found ${listings.length} listing(s).`,
            sampleId:       listings[0]?.Id || listings[0]?.ListingId || null,
            sampleCity:     listings[0]?.StandardFields?.City || null,
            debug:          { url, authFormat: fmt.name },
          })
        }

        // Rate limit hit — stop trying
        if (res.status === 429) break

      } catch (fetchErr) {
        console.error(`[Spark Test] ${fmt.name} fetch error:`, fetchErr.message)
        results.push({ format: fmt.name, error: fetchErr.message })
      }
    }

    // ── None of the formats worked — return full debug info ───────────────
    const bestResult = results.find(r => r.status && r.status !== 401 && r.status !== 403) || results[0]

    // Parse the error message from Spark if available
    let sparkMessage = ''
    try {
      const j = bestResult?.json
      sparkMessage = j?.D?.Message || j?.message || j?.error_description || j?.error || ''
    } catch {}

    const statusMessages = {
      401: 'Invalid credentials. Your API key was not recognized by Spark.',
      403: 'Access forbidden. Your API key may not have Listings permission, or your account may not have replication access enabled.',
      404: 'Endpoint not found. The API URL may be incorrect for your account type.',
      422: 'Invalid request format.',
      500: 'Spark API server error. Try again shortly.',
      503: 'Spark API temporarily unavailable.',
    }

    const commonStatus = results.find(r => r.status)?.status
    const statusMsg    = statusMessages[commonStatus] || `HTTP ${commonStatus}`

    return NextResponse.json({
      success: false,
      status:  commonStatus,
      mode,
      message: [
        `❌ Connection failed (${statusMsg})`,
        sparkMessage ? `Spark says: "${sparkMessage}"` : '',
        '',
        'Troubleshooting steps:',
        '1. Verify your API key is copied correctly (no extra spaces)',
        '2. Check sparkplatform.com/developers → your app has "Listings" scope',
        '3. For Replication: confirm your account has replication agreement with FBS',
        '4. For Live: confirm Hybrid API is enabled on your account',
        '5. Try generating a new API key from your Spark developer portal',
      ].filter(Boolean).join('\n'),
      debug: {
        url,
        testedFormats: results.map(r => ({ format: r.format, status: r.status, error: r.error })),
        sparkErrorMessage: sparkMessage,
      },
    })

  } catch (err) {
    console.error('[Spark Test] Outer error:', err)
    return NextResponse.json({
      success: false,
      message: `Server error: ${err.message}`,
      debug:   { error: err.message, stack: err.stack?.slice(0, 500) },
    })
  }
}
