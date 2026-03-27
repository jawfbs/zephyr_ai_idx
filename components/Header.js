'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchBar } from './SearchBar';
import { SignInButton, UserButton, useAuth } from '@clerk/nextjs';
import { Home, Heart, User, Menu, X } from 'lucide-react';

export function Header({ favorites = [], onToggleFavorite }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn, user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-white'
      }`}
      role="banner"
    >
      {/* Top Bar */}
      <div className="bg-blue-900 text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <span>📞 (701) 555-0123</span>
          <div className="flex items-center gap-4">
            {isSignedIn ? (
              <>
                <span className="hidden md:inline">Welcome, {user.firstName}</span>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <SignInButton mode="modal">
                <button className="hover:underline flex items-center gap-1" aria-label="Sign in">
                  <User size={16} aria-hidden="true" />
                  Sign In
                </button>
              </SignInButton>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="max-w-7xl mx-auto px-4 py-4" role="navigation" aria-label="Main navigation">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2" aria-label="ZephyrAI IDX Home">
            <Home className="w-8 h-8 text-blue-600" aria-hidden="true" />
            <span className="text-2xl font-bold text-blue-900">ZephyrAI</span>
            <span className="text-2xl font-light text-blue-600">IDX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors" aria-current="page">
              Buy
            </Link>
            <Link href="/sell" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Sell
            </Link>
            <Link href="/rentals" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Rent
            </Link>
            <Link href="/mortgage" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
              Mortgage Calculator
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {/* Favorites */}
            <Link
              href="/favorites"
              className="relative p-2 hover:bg-blue-50 rounded-full transition-colors"
              aria-label={`Saved homes ${favorites.length > 0 ? `(${favorites.length})` : ''}`}
            >
              <Heart
                className={`w-6 h-6 ${favorites.length > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
                aria-hidden="true"
              />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
            <div className="flex flex-col gap-3">
              <Link href="/" className="px-4 py-2 hover:bg-blue-50 rounded-lg" role="menuitem">
                Buy
              </Link>
              <Link href="/sell" className="px-4 py-2 hover:bg-blue-50 rounded-lg" role="menuitem">
                Sell
              </Link>
              <Link href="/rentals" className="px-4 py-2 hover:bg-blue-50 rounded-lg" role="menuitem">
                Rent
              </Link>
              <Link href="/mortgage" className="px-4 py-2 hover:bg-blue-50 rounded-lg" role="menuitem">
                Mortgage Calculator
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
