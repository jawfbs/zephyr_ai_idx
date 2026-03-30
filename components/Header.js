'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { 
  Home, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown,
  Home as HomeIcon,
  DollarSign,
  FileText,
  Calculator,
} from 'lucide-react';

export function Header({ favorites = [], onToggleFavorite }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showBuyDropdown, setShowBuyDropdown] = useState(false);
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const buyLinks = [
    { href: '/buy', label: 'Buy a Home', icon: HomeIcon },
    { href: '/buy/new-construction', label: 'New Construction', icon: HomeIcon },
    { href: '/buy/foreclosures', label: 'Foreclosures', icon: DollarSign },
    { href: '/buy/first-time-buyer', label: 'First-Time Buyer', icon: FileText },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
      role="banner"
    >
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:bg-blue-600 focus:text-white focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <a 
            href="tel:+17015550123" 
            className="flex items-center gap-2 hover:underline focus:outline-none focus:ring-2 focus:ring-white rounded"
            aria-label="Call us at (701) 555-0123"
          >
            <span aria-hidden="true">📞</span>
            <span>(701) 555-0123</span>
          </a>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="hidden md:inline" aria-label={`Welcome, ${user.firstName}`}>
                  Welcome, {user.firstName}
                </span>
                <UserButton 
                  afterSignOutUrl="/"
                  userProfileUrl="/profile"
                  userProfileMode="navigation"
                />
              </>
            ) : (
              <SignInButton mode="modal">
                <button 
                  className="hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-white rounded px-2 py-1" 
                  aria-label="Sign in to your account"
                >
                  <User size={16} aria-hidden="true" />
                  <span>Sign In</span>
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav 
        className="max-w-7xl mx-auto px-4 py-4" 
        role="navigation" 
        aria-label="Main navigation"
      >
        <div className="flex items-center justify-between">


{/* Logo - This is what you need */}
      <Link
        href="/"                    // ← Best practice: use "/" for homepage
        className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        aria-label="ZephyrAI IDX - Go to homepage"
      >
        <Home className="w-8 h-8 text-blue-600" aria-hidden="true" />
        <span className="text-2xl font-bold text-blue-900">ZephyrAI</span>
        <span className="text-2xl font-light text-blue-600">IDX</span>
      </Link>



          
//          {/* Logo */}
//          <Link 
//            href="/" 
//            className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
//            aria-label="ZephyrAI IDX - Go to homepage"
//          >
//            <Home className="w-8 h-8 text-blue-600" aria-hidden="true" />
//            <span className="text-2xl font-bold text-blue-900">ZephyrAI</span>
//            <span className="text-2xl font-light text-blue-600">IDX</span>
//          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Buy Dropdown */}
            <div className="relative">
              <button
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
                onClick={() => setShowBuyDropdown(!showBuyDropdown)}
                aria-expanded={showBuyDropdown}
                aria-haspopup="true"
                aria-label="Buy menu"
              >
                Buy
                <ChevronDown className={`w-4 h-4 transition-transform ${showBuyDropdown ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              
              {showBuyDropdown && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border py-2"
                  role="menu"
                  aria-label="Buy menu"
                >
                  {buyLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                      role="menuitem"
                      onClick={() => setShowBuyDropdown(false)}
                    >
                      <link.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                      <span className="text-gray-700">{link.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

//            <Link 
//              href="/sell" 
//              className="text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded // px-2 py-1"
//            >
//              Sell
//            </Link>
            <Link 
              href="/rentals" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              Rent
            </Link>
//            <Link 
//              href="/mortgage" 
//              className="text-gray-700 hover:text-blue-600 font-medium transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 // focus:ring-blue-500 rounded px-2 py-1"
//            >
//              <Calculator className="w-4 h-4" aria-hidden="true" />
//              Mortgage Calculator
//            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Favorites */}
            <Link
              href="/favorites"
              className={`relative p-2 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                favorites.length > 0 
                  ? 'text-red-500 hover:bg-red-50' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              aria-label={`Saved homes${favorites.length > 0 ? `, ${favorites.length} saved` : ''}`}
            >
              <Heart
                className={`w-6 h-6 ${favorites.length > 0 ? 'fill-current' : ''}`}
                aria-hidden="true"
              />
              {favorites.length > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-semibold"
                  aria-hidden="true"
                >
                  {favorites.length > 9 ? '9+' : favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" aria-hidden="true" />
              ) : (
                <Menu className="w-6 h-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            id="mobile-menu"
            className="lg:hidden mt-4 pb-4 border-t pt-4"
            role="menu"
          >
            <div className="flex flex-col gap-1">
              <div>
                <p className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Buy
                </p>
                {buyLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg transition-colors"
                    role="menuitem"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <link.icon className="w-5 h-5 text-gray-400" aria-hidden="true" />
                    <span className="text-gray-700">{link.label}</span>
                  </Link>
                ))}
              </div>
              
              <div className="border-t my-2" />
              
//              <Link 
//                href="/sell" 
//                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg"
//                role="menuitem"
//                onClick={() => setMobileMenuOpen(false)}
//              >
//                <span className="text-xl" aria-hidden="true">🏷️</span>
//                <span>Sell</span>
//              </Link>
              <Link
                href="/rentals" 
                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg"
                role="menuitem"
                onClick={() => setMobileMenuOpen(false)}
              >
//                <span className="text-xl" aria-hidden="true">🏠</span>
//                <span>Rent</span>
//              </Link>
//              <Link 
//                href="/mortgage" 
//                className="flex items-center gap-3 px-4 py-3 hover:bg-blue-50 rounded-lg"
//                role="menuitem"
//                onClick={() => setMobileMenuOpen(false)}
//              >
//                <Calculator className="w-5 h-5 text-gray-400" aria-hidden="true" />
//                <span>Mortgage Calculator</span>
//              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
