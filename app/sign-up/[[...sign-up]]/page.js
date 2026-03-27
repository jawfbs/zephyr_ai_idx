'use client';

import { useState } from 'react';
import { useSignUp } from '@clerk/nextjs';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Home, Eye, EyeOff, ArrowLeft, Mail, Lock, User, Phone, Check, AlertCircle } from 'lucide-react';

export default function SignUpPage() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return false;
    }
    if (!formData.agreeToTerms) {
      setError('Please agree to the terms of service');
      return false;
    }
    return true;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    
    if (!isLoaded || !validateForm()) return;
    
    setLoading(true);
    setError('');

    try {
      await signUp.create({
        firstName: formData.firstName,
        lastName: formData.lastName,
        emailAddress: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
      });

      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setStep(2);
    } catch (err) {
      console.error('Sign up error:', err);
      
      if (err.errors?.[0]?.code === 'form_identifier_exists') {
        setError('An account with this email already exists.');
      } else {
        setError('Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerification = async (e) => {
    e.preventDefault();
    
    if (!isLoaded) return;
    
    const code = e.target.code.value;
    setLoading(true);
    setError('');

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      
      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.push('/onboarding');
      }
    } catch (err) {
      setError('Invalid verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Verification Step
  if (step === 2) {
    return (
      <div className="min-h-screen flex flex-col lg:flex-row">
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-12 flex-col justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white">
              <Home className="w-8 h-8" />
              <span className="text-2xl font-bold">ZephyrAI IDX</span>
            </Link>
          </div>
          
          <div className="text-white">
            <h1 className="text-4xl font-bold mb-4">Verify Your Email</h1>
            <p className="text-xl text-blue-200">
              Enter the 6-digit code sent to <strong>{formData.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="w-full max-w-md">
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">Enter Verification Code</h2>
            <p className="text-gray-600 mb-6">Check your email for a 6-digit code</p>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <form onSubmit={handleVerification} className="space-y-6">
              <div>
                <input
                  type="text"
                  id="code"
                  name="code"
                  maxLength={6}
                  required
                  className="w-full px-4 py-4 text-center text-2xl tracking-widest border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="000000"
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Didn't receive it?{' '}
              <button onClick={async () => {
                if (isLoaded) await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
              }} className="text-blue-600 hover:underline">
                Resend code
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Default Sign Up Form
  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 p-12 flex-col justify-between">
        <div>
          <Link href="/" className="flex items-center gap-2 text-white">
            <Home className="w-8 h-8" />
            <span className="text-2xl font-bold">ZephyrAI IDX</span>
          </Link>
        </div>
        
        <div className="text-white">
          <h1 className="text-4xl font-bold mb-4">Find Your Dream Home</h1>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <span>Access to 2,500+ local listings</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <span>Save favorites and get price alerts</span>
            </div>
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5" />
              <span>AI-powered recommendations</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <Link href="/" className="lg:hidden flex items-center gap-2 text-gray-900 mb-8 justify-center">
            <Home className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold">ZephyrAI IDX</span>
          </Link>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600 mb-8">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-blue-600 hover:underline font-medium">Sign in</Link>
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="John"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Smith"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone <span className="text-gray-400">(optional)</span></label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="(701) 555-0123"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="At least 8 characters"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Re-enter password"
                />
              </div>
            </div>

            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="agreeToTerms"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                className="mt-1 w-4 h-4"
              />
              <label htmlFor="agreeToTerms" className="text-sm text-gray-600">
                I agree to the <Link href="/terms" className="text-blue-600">Terms</Link> and <Link href="/privacy" className="text-blue-600">Privacy Policy</Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
