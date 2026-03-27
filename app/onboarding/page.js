'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Home, ArrowRight, Check, Home as HomeIcon, Briefcase, Users, Building2, Sparkles } from 'lucide-react';

const roles = [
  {
    id: 'homebuyer',
    title: 'Homebuyer',
    description: 'Search listings, save favorites, and get price alerts',
    icon: HomeIcon,
    color: 'blue',
  },
  {
    id: 'agent',
    title: 'Real Estate Agent',
    description: 'Full IDX access and client management tools',
    icon: Briefcase,
    color: 'purple',
    badge: 'Popular',
  },
  {
    id: 'team',
    title: 'Team',
    description: 'Collaborate with multiple agents',
    icon: Users,
    color: 'green',
  },
  {
    id: 'brokerage',
    title: 'Brokerage',
    description: 'Full platform with custom branding',
    icon: Building2,
    color: 'amber',
  },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/sign-in');
    }
  }, [isLoaded, user, router]);

  const handleContinue = async () => {
    if (!selectedRole || !user) return;
    
    setLoading(true);
    
    try {
      await user.update({
        publicMetadata: {
          role: selectedRole,
          onboardingComplete: true,
        },
      });
      
      router.push('/');
    } catch (error) {
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ZephyrAI IDX</span>
          </Link>
          <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">Skip for now</Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-medium mb-4">
            <Sparkles className="w-4 h-4" />
            Personalize Your Experience
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">How will you use ZephyrAI IDX?</h1>
          <p className="text-gray-600">Select the option that best describes you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;
            const colorClasses = {
              blue: isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300',
              purple: isSelected ? 'border-purple-500 bg-purple-50' : 'border-gray-200 hover:border-purple-300',
              green: isSelected ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-300',
              amber: isSelected ? 'border-amber-500 bg-amber-50' : 'border-gray-200 hover:border-amber-300',
            };
            const iconBgClasses = {
              blue: 'bg-blue-100 text-blue-600',
              purple: 'bg-purple-100 text-purple-600',
              green: 'bg-green-100 text-green-600',
              amber: 'bg-amber-100 text-amber-600',
            };

            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`relative p-6 rounded-xl border-2 text-left transition-all ${colorClasses[role.color]} ${isSelected ? 'shadow-md' : ''}`}
              >
                {role.badge && (
                  <span className="absolute top-3 right-3 bg-purple-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
                    {role.badge}
                  </span>
                )}
                
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${iconBgClasses[role.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900">{role.title}</h3>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{role.description}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!selectedRole || loading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? 'Setting up...' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
}
