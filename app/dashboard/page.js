'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { 
  Home, 
  Plus, 
  TrendingUp, 
  Users, 
  Building2,
  Eye,
  Heart,
  Bell,
  BarChart3,
  Calendar,
  DollarSign,
} from 'lucide-react';

// Dashboard Components for each role
function HomebuyerDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Saved Homes</h3>
            <Heart className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">12</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Price Drops</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-500 text-sm">Saved Searches</h3>
            <Bell className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">5</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-semibold mb-2">Ready to find your dream home?</h3>
        <p className="text-blue-100 mb-4">Browse new listings that match your preferences.</p>
        <Link href="/" className="inline-flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50">
          <Eye className="w-4 h-4" />
          Browse Listings
        </Link>
      </div>
    </div>
  );
}

function AgentDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Your Listings</h2>
        <Link href="/dashboard/listings/new" className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          <Plus className="w-4 h-4" />
          Add Listing
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Active Listings</h3>
          <p className="text-3xl font-bold text-gray-900">8</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Pending Sales</h3>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Total Leads</h3>
          <p className="text-3xl font-bold text-gray-900">24</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">This Month</h3>
          <p className="text-3xl font-bold text-green-600">$1.2M</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New lead from listing #1234', time: '2 hours ago' },
            { action: 'Showing scheduled for Oak Street', time: '5 hours ago' },
            { action: 'Offer received on 456 Main St', time: 'Yesterday' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
              <p className="text-gray-700">{item.action}</p>
              <span className="text-sm text-gray-500">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function TeamDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Team Performance</h3>
            <Users className="w-5 h-5 text-purple-500" />
          </div>
          <div className="space-y-4">
            {['Alice Johnson', 'Bob Smith', 'Carol Williams'].map((name, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-gray-700">{name}</span>
                <span className="font-semibold text-gray-900">${[45, 32, 28][i]}K</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Team Listings</h3>
            <Building2 className="w-5 h-5 text-blue-500" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-sm text-gray-500">Active</p>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-2xl font-bold text-gray-900">5</p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BrokerageDashboard() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl text-white">
          <DollarSign className="w-8 h-8 mb-2" />
          <p className="text-3xl font-bold">$4.8M</p>
          <p className="text-blue-200 text-sm">Total Sales Volume</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Active Agents</h3>
          <p className="text-3xl font-bold text-gray-900">32</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Office Locations</h3>
          <p className="text-3xl font-bold text-gray-900">3</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="text-gray-500 text-sm mb-2">Transactions</h3>
          <p className="text-3xl font-bold text-gray-900">28</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Performance by Office
          </h3>
          <div className="space-y-4">
            {['Downtown Fargo', 'West Fargo', 'Moorhead'].map((office, i) => (
              <div key={i}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{office}</span>
                  <span className="font-medium">${[2.1, 1.5, 1.2][i]}M</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${[70, 50, 40][i]}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-500" />
            Upcoming Closings
          </h3>
          <div className="space-y-3">
            {[
              { address: '123 Oak St, Fargo', date: 'Dec 15', amount: '$425K' },
              { address: '456 Elm Ave, Moorhead', date: 'Dec 18', amount: '$385K' },
              { address: '789 Pine Rd, West Fargo', date: 'Dec 22', amount: '$512K' },
            ].map((closing, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{closing.address}</p>
                  <p className="text-sm text-gray-500">{closing.date}</p>
                </div>
                <span className="font-semibold text-green-600">{closing.amount}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Page
export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      setRedirecting(true);
      window.location.href = '/sign-in';
    }
  }, [isLoaded, user]);

  if (redirecting || !isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  const role = user?.publicMetadata?.role || 'homebuyer';
  const onboardingComplete = user?.publicMetadata?.onboardingComplete;

  // Show onboarding if role not selected
  if (!onboardingComplete && role === 'homebuyer') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Complete Your Profile</h1>
          <Link href="/onboarding" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
            Set Up Your Account
          </Link>
        </div>
      </div>
    );
  }

  const dashboards = {
    homebuyer: HomebuyerDashboard,
    agent: AgentDashboard,
    team: TeamDashboard,
    brokerage: BrokerageDashboard,
  };

  const DashboardComponent = dashboards[role] || HomebuyerDashboard;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ZephyrAI IDX</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {role === 'homebuyer' && '🏠 Homebuyer'}
              {role === 'agent' && '🏡 Agent'}
              {role === 'team' && '👥 Team'}
              {role === 'brokerage' && '🏢 Brokerage'}
            </span>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-500">
            Here's what's happening with your account.
          </p>
        </div>

        <DashboardComponent />
      </main>
    </div>
  );
}
