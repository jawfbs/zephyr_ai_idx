import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { type, propertyData } = await request.json();

    // In production, call OpenAI/Anthropic API here
    // For demo, return simulated data
    
    const insights = {
      priceAnalysis: {
        score: 78,
        verdict: 'Good Deal',
        analysis: 'Priced competitively for the area',
      },
      investmentPotential: {
        score: 82,
        verdict: 'Strong Investment',
        estimatedRent: Math.round(propertyData.price * 0.008),
      },
    };

    return NextResponse.json(insights);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to generate insights' },
      { status: 500 }
    );
  }
}
