import { NextResponse } from 'next/server'

// ── Quick connectivity test — no full data pull ───────────────────────────────
export async function POST(request) {
  try {
    const { apiKey, apiSecret, mode } = await request.json()

    if (!apiKey) {
      return NextResponse.json({ success: false, message: 'API key is required' })
    }

    const base = mode === 'live'
      ? 'https://api.sparkplatform.com/v1'
      : 'https://replication.sparkplatform.com/api/v1'

    // Minimal request — just fetch 1 listing to verify auth
    const url = `${base}/listings?_limit=1&_fields=ListingId,ListPrice,City`

    const res = await fetch(url, {
      headers: {
        'Authorization': `SparkApi key="${apiKey}"`,
        'Accept':        'application/json',
        'X-SparkApi-User-Agent': 'ZephyrAI IDX/1.0',
      },
    })

    if (res.status === 401 || res.status === 403) {
      return NextResponse.json({
        success: false,
        status:  res.status,
        message: 'Authentication failed. Verify your API key is correct and has active permissions.',
      })
    }

    if (!res.ok) {
      return NextResponse.json({
        success: false,
        status:  res.status,
        message: `Spark API responded with status ${res.status}. Check your account status.`,
      })
    }

    const data = await res.json()
    const results = data?.D?.Results || data?.Results || []

    return NextResponse.json({
      success:      true,
      status:       res.status,
      mode,
      resultCount:  results.length,
      message:      `✅ Connected successfully. Spark ${mode} API is responding.`,
      sampleId:     results[0]?.Id || results[0]?.ListingId || null,
    })

  } catch (err) {
    return NextResponse.json({
      success: false,
      message: `Connection error: ${err.message}`,
    })
  }
}
