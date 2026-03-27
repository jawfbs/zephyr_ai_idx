'use client';

import { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';

export function AIFeatureButton({ title, description, icon, propertyData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Simulate AI API call
      // In production, you'd call your AI backend
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Simulated responses
      const responses = {
        'Price Analysis': {
          verdict: 'Good Deal',
          score: 78,
          analysis: `Based on comparable properties in this area, this home is priced competitively. 
The price per square foot (${
            Math.round(propertyData.price / propertyData.sqft)
          }) is slightly below the neighborhood average ($185), suggesting good value.`,
        },
        'Investment Potential': {
          verdict: 'Strong Rental Market',
          score: 82,
          analysis: `Estimated monthly rental potential: $${Math.round(
            propertyData.price * 0.008
          ).toLocaleString()}. 
The Fargo rental market has shown consistent 3% annual growth. With low vacancy rates in this area, this could be a solid investment.`,
        },
        'Market Comparison': {
          verdict: 'Below Market Average',
          score: 85,
          analysis: `This home is priced 8% below similar properties in the last 6 months. 
Average time on market for comparable homes: 28 days. This property has been listed for 15 days, giving you negotiating room.`,
        },
        'Neighborhood Score': {
          verdict: 'Excellent',
          score: 88,
          analysis: `This neighborhood scores highly on safety, school quality, and amenities. 
Walkability Score: 72. Nearby schools are rated 7-8/10. The area has seen consistent property value appreciation of 4.5% annually.`,
        },
      };

      setResult(responses[title] || responses['Price Analysis']);
    } catch (err) {
      setError('Failed to generate insights. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div>
      {!result && !error ? (
        <button
          onClick={handleClick}
          disabled={isLoading}
          className="w-full p-4 bg-white rounded-lg border hover:border-blue-300 hover:shadow-md transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
          aria-busy={isLoading}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                icon
              )}
            </div>
            <div>
              <p className="font-semibold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-500" aria-hidden="true" />
                {title}
              </p>
              <p className="text-sm text-gray-500 mt-1">{description}</p>
              {isLoading && (
                <p className="text-xs text-blue-600 mt-2">Analyzing...</p>
              )}
            </div>
          </div>
        </button>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 text-sm mb-3">{error}</p>
          <button
            onClick={reset}
            className="text-sm text-red-600 hover:underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="font-semibold text-gray-900">{result.verdict}</p>
              <p className="text-sm text-gray-500">AI Analysis</p>
            </div>
            <div className="relative w-14 h-14">
              <svg className="w-14 h-14 transform -rotate-90">
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  className="text-gray-200"
                />
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                  strokeDasharray={`${result.score * 1.5} 150`}
                  className={result.score >= 80 ? 'text-green-500' : result.score >= 60 ? 'text-yellow-500' : 'text-red-500'}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-bold">
                {result.score}
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-700 whitespace-pre-line mb-3">
            {result.analysis}
          </p>
          <button
            onClick={reset}
            className="text-sm text-blue-600 hover:underline"
          >
            Ask a different question
          </button>
        </div>
      )}
    </div>
  );
}
