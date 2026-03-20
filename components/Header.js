'use client'

import { useState } from 'react'
import { Search, Heart, Bell, User, ChevronDown, Menu, X } from 'lucide-react'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('Buy')

  const navItems = ['Buy', 'Rent', 'Sell', 'Agents', 'Mortgage', 'News']

  return (
    <header className="bg-white border-b border-gray-200 z-40 relative">
      <div className="flex items-center justify-between px-4 h-14">
        {/* Logo */}
        <div className="flex items-center gap-6">
          <a href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5">
              <div className="w-8 h-8 bg-realtor-red rounded-md flex items-center justify-center">
                <span className="text-white font-black text-sm">Z</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-bold text-gray-900 text-sm leading-tight">ZephyrAI</span>
                <span className="text-realtor-red text-xs font-semibold leading-tight">IDX</span>
              </div>
            </div>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setActiveNav(item)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeNav === item
                    ? 'text-realtor-red border-b-2 border-realtor-red rounded-none'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <button className="hidden md:flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
            <Bell size={16} />
            <span className="hidden lg:inline">Alerts</span>
          </button>

          <button className="hidden md:flex items-center gap-1 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition-colors">
            <Heart size={16} />
            <span className="hidden lg:inline">Saved</span>
          </button>

          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-realtor-red text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
            <User size={15} />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-gray-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          {navItems.map((item) => (
            <button
              key={item}
              onClick={() => {
                setActiveNav(item)
                setMobileMenuOpen(false)
              }}
              className={`w-full text-left px-4 py-3 text-sm font-medium border-b border-gray-50 ${
                activeNav === item
                  ? 'text-realtor-red bg-red-50'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </header>
  )
}
