'use client';

import { useState, useEffect } from 'react';
import {
  School,
  Bike,
  Shield,
  Users,
  MapPin,
  Star,
  ChevronDown,
  ChevronUp,
  Loader2,
  Info,
} from 'lucide-react';

// School Rating Component
function SchoolCard({ school, type }) {
  const [expanded, setExpanded] = useState(false);
  
  const getRatingColor = (rating) => {
    if (rating >= 8) return 'bg-green-100 text-green-800';
    if (rating >= 5) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  return (
    <div className="bg-white border rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${type === 'elementary' ? 'bg-blue-100' : type === 'middle' ? 'bg-purple-100' : 'bg-green-100'}`}>
            <School className={`w-5 h-5 ${type === 'elementary' ? 'text-blue-600' : type === 'middle' ? 'text-purple-600' : 'text-green-600'}`} aria-hidden="true" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">{school.name}</p>
            <p className="text-sm text-gray-500">{school.type} • {school.gradeRange}</p>
            <p className="text-sm text-gray-500">{school.distance} away</p>
          </div>
        </div>
        {school.rating && (
          <span className={`px-2 py-1 rounded-full text-sm font-semibold ${getRatingColor(school.rating)}`}>
            {school.rating}/10
          </span>
        )}
      </div>
      
      {school.details && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 text-sm text-blue-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          aria-expanded={expanded}
        >
          {expanded ? 'Hide details' : 'Show details'}
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      )}
      
      {expanded && school.details && (
        <div className="mt-3 pt-3 border-t space-y-2">
          {school.details.students && <p className="text-sm"><span className="font-medium">Students:</span> {school.details.students}</p>}
          {school.details.type && <p className="text-sm"><span className="font-medium">Type:</span> {school.details.type}</p>}
          {school.details.mathProficiency && <p className="text-sm"><span className="font-medium">Math:</span> {school.details.mathProficiency}</p>}
          {school.details.readingProficiency && <p className="text-sm"><span className="font-medium">Reading:</span> {school.details.readingProficiency}</p>}
        </div>
      )}
    </div>
  );
}

// Walk Score Component
function WalkabilityCard({ scores }) {
  const getScoreColor = (score, type) => {
    if (score >= 70) return type === 'walk' ? 'bg-green-500' : type === 'bike' ? 'bg-blue-500' : 'bg-green-500';
    if (score >= 50) return type === 'walk' ? 'bg-yellow-500' : type === 'bike' ? 'bg-yellow-500' : 'bg-yellow-500';
    return type === 'walk' ? 'bg-red-500' : type === 'bike' ? 'bg-orange-500' : 'bg-red-500';
  };

  const getScoreLabel = (score, type) => {
    if (type === 'walk') {
      if (score >= 90) return "Walker's Paradise";
      if (score >= 70) return 'Very Walkable';
      if (score >= 50) return 'Somewhat Walkable';
      if (score >= 25) return 'Car-Dependent';
      return 'Almost All Errands Require a Car';
    }
    if (type === 'bike') {
      if (score >= 90) return "Biker's Paradise";
      if (score >= 70) return 'Very Bikeable';
      if (score >= 50) return 'Bikeable';
      return 'Somewhat Bikeable';
    }
    return score >= 70 ? 'Excellent Transit' : score >= 50 ? 'Good Transit' : 'Minimal Transit';
  };

  const scoreData = [
    { type: 'walk', label: 'Walk Score', icon: <MapPin className="w-5 h-5" />, score: scores?.walk || 45 },
    { type: 'transit', label: 'Transit Score', icon: <MapPin className="w-5 h-5" />, score: scores?.transit || 35 },
    { type: 'bike', label: 'Bike Score', icon: <Bike className="w-5 h-5" />, score: scores?.bike || 52 },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Bike className="w-5 h-5 text-blue-600" aria-hidden="true" />
        Walkability & Transportation
      </h3>
      <div className="space-y-4">
        {scoreData.map(({ type, label, icon, score }) => (
          <div key={type} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{icon}</span>
                <span className="font-medium text-gray-900">{label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">{score}</span>
                <span className="text-sm text-gray-500">/ 100</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getScoreColor(score, type)} transition-all duration-500`}
                  style={{ width: `${score}%` }}
                />
              </div>
              <span className="text-sm text-gray-600 min-w-[140px] text-right">
                {getScoreLabel(score, type)}
              </span>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 text-xs text-gray-400 italic">
        Score estimates based on typical neighborhood characteristics
      </p>
    </div>
  );
}

// Crime Statistics Component
function CrimeStatsCard({ crimeData }) {
  const getCrimeLevel = (rate) => {
    if (rate < 0.5) return { label: 'Very Low', color: 'bg-green-500', textColor: 'text-green-700' };
    if (rate < 1.0) return { label: 'Low', color: 'bg-lime-500', textColor: 'text-lime-700' };
    if (rate < 1.5) return { label: 'Moderate', color: 'bg-yellow-500', textColor: 'text-yellow-700' };
    if (rate < 2.0) return { label: 'Above Average', color: 'bg-orange-500', textColor: 'text-orange-700' };
    return { label: 'High', color: 'bg-red-500', textColor: 'text-red-700' };
  };

  const level = getCrimeLevel(crimeData?.crimeIndex || 0.8);

  const crimeTypes = [
    { label: 'Property Crime', value: crimeData?.property || 45, color: 'bg-blue-400' },
    { label: 'Violent Crime', value: crimeData?.violent || 8, color: 'bg-red-400' },
    { label: 'Other', value: crimeData?.other || 27, color: 'bg-gray-400' },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-blue-600" aria-hidden="true" />
        Safety & Crime Statistics
      </h3>
      
      {/* Overall Crime Level */}
      <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-sm text-gray-500">Overall Crime Level</p>
          <p className={`text-lg font-semibold ${level.textColor}`}>{level.label}</p>
        </div>
        <div className={`px-3 py-1 rounded-full ${level.color} text-white text-sm font-semibold`}>
          Index: {(crimeData?.crimeIndex || 0.8).toFixed(1)}
        </div>
      </div>

      {/* Crime Breakdown */}
      <div className="space-y-3">
        <p className="text-sm font-medium text-gray-700">Crime Breakdown (per 1,000 residents)</p>
        {crimeTypes.map(({ label, value, color }) => (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">{label}</span>
              <span className="font-medium">{value}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className={`h-full ${color}`} style={{ width: `${Math.min(value, 100)}%` }} />
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-gray-400 italic">
        Estimates based on regional data. Contact local authorities for official statistics.
      </p>
    </div>
  );
}

// Demographics Component
function DemographicsCard({ demographics }) {
  const categories = [
    { label: 'Population', value: demographics?.population || '45,000', icon: '👥' },
    { label: 'Median Age', value: demographics?.medianAge || '35', icon: '📅' },
    { label: 'Median Income', value: demographics?.medianIncome || '$68,000', icon: '💰' },
    { label: 'Home Ownership', value: demographics?.homeOwnership || '72%', icon: '🏠' },
  ];

  return (
    <div className="bg-white border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Users className="w-5 h-5 text-blue-600" aria-hidden="true" />
        Neighborhood Demographics
      </h3>
      
      <div className="grid grid-cols-2 gap-4">
        {categories.map(({ label, value, icon }) => (
          <div key={label} className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl mb-1">{icon}</p>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-500">{label}</p>
          </div>
        ))}
      </div>

      {/* Age Distribution */}
      {demographics?.ageDistribution && (
        <div className="mt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Age Distribution</p>
          <div className="space-y-2">
            {Object.entries(demographics.ageDistribution).map(([age, percentage]) => (
              <div key={age} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 w-24">{age}</span>
                <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: `${percentage}%` }} />
                </div>
                <span className="text-sm font-medium w-12 text-right">{percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-400 italic">
        Demographic estimates based on regional census data
      </p>
    </div>
  );
}

// Main NeighborhoodData Component
export function NeighborhoodData({ address }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('schools');

  useEffect(() => {
    const fetchNeighborhoodData = async () => {
      if (!address) return;

      setLoading(true);
      try {
        // Simulate loading delay
        await new Promise(resolve => setTimeout(resolve, 800));

        // Static demo data - no external API calls
        setData({
          schools: [
            {
              name: 'Oak Creek Elementary',
              type: 'elementary',
              gradeRange: 'K-4',
              distance: '0.4 mi',
              rating: 8,
              details: {
                students: 420,
                type: 'Public',
                mathProficiency: '85%',
                readingProficiency: '88%',
              },
            },
            {
              name: 'Carl Ben Eielson Middle School',
              type: 'middle',
              gradeRange: '5-8',
              distance: '1.2 mi',
              rating: 7,
              details: {
                students: 680,
                type: 'Public',
                mathProficiency: '78%',
                readingProficiency: '82%',
              },
            },
            {
              name: 'North High School',
              type: 'high',
              gradeRange: '9-12',
              distance: '2.1 mi',
              rating: 7,
              details: {
                students: 1250,
                type: 'Public',
                mathProficiency: '72%',
                readingProficiency: '80%',
              },
            },
          ],
          walkScore: {
            walk: 45,
            transit: 35,
            bike: 52,
          },
          crime: {
            crimeIndex: 0.8,
            property: 45,
            violent: 8,
            other: 27,
          },
          demographics: {
            population: '45,000',
            medianAge: '35',
            medianIncome: '$68,000',
            homeOwnership: '72%',
            ageDistribution: {
              '0-19': 28,
              '20-34': 24,
              '35-54': 26,
              '55+': 22,
            },
          },
        });
      } catch (err) {
        console.error('Error loading neighborhood data:', err);
        setError('Unable to load neighborhood information');
      } finally {
        setLoading(false);
      }
    };

    fetchNeighborhoodData();
  }, [address]);

  if (loading) {
    return (
      <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="neighborhood-heading">
        <h2 id="neighborhood-heading" className="text-xl font-semibold text-gray-900 mb-6">
          Neighborhood Information
        </h2>
        <div className="flex items-center justify-center py-12" role="status" aria-label="Loading neighborhood data">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <span className="ml-3 text-gray-500">Loading neighborhood data...</span>
        </div>
      </section>
    );
  }

  if (error || !data) {
    return (
      <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="neighborhood-heading">
        <h2 id="neighborhood-heading" className="text-xl font-semibold text-gray-900 mb-4">
          Neighborhood Information
        </h2>
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg text-gray-600">
          <Info className="w-5 h-5" aria-hidden="true" />
          <p>Neighborhood data currently unavailable. Please check back later.</p>
        </div>
      </section>
    );
  }

  const tabs = [
    { id: 'schools', label: 'Schools', icon: School },
    { id: 'walkability', label: 'Walkability', icon: Bike },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'demographics', label: 'Demographics', icon: Users },
  ];

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="neighborhood-heading">
      <div className="flex items-center justify-between mb-6">
        <h2 id="neighborhood-heading" className="text-xl font-semibold text-gray-900">
          Neighborhood Information
        </h2>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapPin className="w-4 h-4" aria-hidden="true" />
          <span>{address?.City || 'Local Area'}</span>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <p className="text-sm text-amber-800 flex items-start gap-2">
          <Info className="w-4 h-4 mt-0.5 flex-shrink-0" aria-hidden="true" />
          <span>
            <strong>Demo Mode:</strong> This data is for demonstration purposes only. 
            In production, this would connect to real-time data sources for accurate neighborhood information.
          </span>
        </p>
      </div>

      {/* Tabs */}
      <div 
        className="flex gap-2 mb-6 overflow-x-auto border-b"
        role="tablist"
        aria-label="Neighborhood information categories"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-t-lg font-medium transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              activeTab === id
                ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
            role="tab"
            aria-selected={activeTab === id}
            aria-controls={`tabpanel-${id}`}
            id={`tab-${id}`}
          >
            <Icon className="w-4 h-4" aria-hidden="true" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div
        role="tabpanel"
        id={`tabpanel-${activeTab}`}
        aria-labelledby={`tab-${activeTab}`}
      >
        {activeTab === 'schools' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Nearby Schools</h3>
              <span className="text-xs text-gray-500">Based on typical school district boundaries</span>
            </div>
            {data.schools.map((school, index) => (
              <SchoolCard key={index} school={school} type={school.type} />
            ))}
          </div>
        )}

        {activeTab === 'walkability' && (
          <WalkabilityCard scores={data.walkScore} />
        )}

        {activeTab === 'safety' && (
          <CrimeStatsCard crimeData={data.crime} />
        )}

        {activeTab === 'demographics' && (
          <DemographicsCard demographics={data.demographics} />
        )}
      </div>
    </section>
  );
}
