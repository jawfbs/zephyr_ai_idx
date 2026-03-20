'use client'

import { useState, useEffect, useRef } from 'react'
import {
  Search, Heart, Bed, Bath, MapPin, SlidersHorizontal,
  List, Map, ChevronDown, X, User, Clock, Phone,
  Mail, MessageSquare, Sun, Sunset, Moon, ChevronRight,
  Home, Trees, PawPrint, Building2, Check, Sparkles,
  TrendingUp, Star, ArrowUpRight, Filter, LayoutGrid,
  Maximize2, Calendar, DollarSign, AlertCircle
} from 'lucide-react'

// ─────────────────────────────────────────────
// THEMES
// ─────────────────────────────────────────────
const THEMES = {
  nature: {
    label: 'Nature',
    icon: Trees,
    category: 'nature',
    variants: [
      {
        id: 'forest',
        name: 'Forest',
        image: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=300&h=180&fit=crop&q=80',
        accent: '#2d6a4f',
        accentLight: '#d8f3dc',
        accentGlow: 'rgba(45,106,79,0.25)',
        gradient: 'linear-gradient(135deg, #1b4332, #2d6a4f, #40916c)',
        cardGlow: '0 0 20px rgba(45,106,79,0.15)',
        tag: 'bg-emerald-500',
      },
      {
        id: 'ocean',
        name: 'Ocean',
        image: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=300&h=180&fit=crop&q=80',
        accent: '#0077b6',
        accentLight: '#caf0f8',
        accentGlow: 'rgba(0,119,182,0.25)',
        gradient: 'linear-gradient(135deg, #03045e, #0077b6, #00b4d8)',
        cardGlow: '0 0 20px rgba(0,119,182,0.15)',
        tag: 'bg-blue-500',
      },
      {
        id: 'desert',
        name: 'Desert',
        image: 'https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=300&h=180&fit=crop&q=80',
        accent: '#e76f51',
        accentLight: '#fde8d8',
        accentGlow: 'rgba(231,111,81,0.25)',
        gradient: 'linear-gradient(135deg, #6d3b2e, #e76f51, #f4a261)',
        cardGlow: '0 0 20px rgba(231,111,81,0.15)',
        tag: 'bg-orange-500',
      },
    ],
  },
  animal: {
    label: 'Animal',
    icon: PawPrint,
    category: 'animal',
    variants: [
      {
        id: 'panther',
        name: 'Panther',
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=180&fit=crop&q=80',
        accent: '#7b2d8b',
        accentLight: '#f3e8ff',
        accentGlow: 'rgba(123,45,139,0.25)',
        gradient: 'linear-gradient(135deg, #1a0533, #7b2d8b, #c77dff)',
        cardGlow: '0 0 20px rgba(123,45,139,0.15)',
        tag: 'bg-purple-600',
      },
      {
        id: 'arctic',
        name: 'Arctic Fox',
        image: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=300&h=180&fit=crop&q=80',
        accent: '#4cc9f0',
        accentLight: '#e0f7ff',
        accentGlow: 'rgba(76,201,240,0.25)',
        gradient: 'linear-gradient(135deg, #0d1b2a, #4cc9f0, #a8dadc)',
        cardGlow: '0 0 20px rgba(76,201,240,0.15)',
        tag: 'bg-cyan-400',
      },
      {
        id: 'tiger',
        name: 'Tiger',
        image: 'https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=300&h=180&fit=crop&q=80',
        accent: '#f59e0b',
        accentLight: '#fef3c7',
        accentGlow: 'rgba(245,158,11,0.25)',
        gradient: 'linear-gradient(135deg, #431407, #f59e0b, #fcd34d)',
        cardGlow: '0 0 20px rgba(245,158,11,0.15)',
        tag: 'bg-amber-500',
      },
    ],
  },
  realestate: {
    label: 'Real Estate',
    icon: Building2,
    category: 'realestate',
    variants: [
      {
        id: 'manhattan',
        name: 'Manhattan',
        image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=300&h=180&fit=crop&q=80',
        accent: '#1e3a5f',
        accentLight: '#dbeafe',
        accentGlow: 'rgba(30,58,95,0.25)',
        gradient: 'linear-gradient(135deg, #0a0f1e, #1e3a5f, #2563eb)',
        cardGlow: '0 0 20px rgba(30,58,95,0.15)',
        tag: 'bg-blue-700',
      },
      {
        id: 'luxury',
        name: 'Luxury',
        image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=300&h=180&fit=crop&q=80',
        accent: '#b8860b',
        accentLight: '#fef9c3',
        accentGlow: 'rgba(184,134,11,0.3)',
        gradient: 'linear-gradient(135deg, #1a1200, #b8860b, #ffd700)',
        cardGlow: '0 0 24px rgba(184,134,11,0.2)',
        tag: 'bg-yellow-600',
      },
      {
        id: 'modern',
        name: 'Modern',
        image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&h=180&fit=crop&q=80',
        accent: '#d92228',
        accentLight: '#fee2e2',
        accentGlow: 'rgba(217,34,40,0.25)',
        gradient: 'linear-gradient(135deg, #18181b, #d92228, #f87171)',
        cardGlow: '0 0 20px rgba(217,34,40,0.15)',
        tag: 'bg-red-500',
      },
    ],
  },
}

// ─────────────────────────────────────────────
// DEMO LISTINGS
// ─────────────────────────────────────────────
const DEMO_LISTINGS = [
  { id: '1', address: '4821 Maple Grove Dr', city: 'Austin', state: 'TX', zip: '78745', price: 485000, beds: 4, baths: 3, sqft: 2400, status: 'Active', daysOnMarket: 2, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '2', address: '2210 Lakeview Blvd', city: 'Denver', state: 'CO', zip: '80203', price: 725000, beds: 3, baths: 2, sqft: 1980, status: 'Active', daysOnMarket: 7, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Condo' },
  { id: '3', address: '8834 Sunset Ridge Ct', city: 'Scottsdale', state: 'AZ', zip: '85251', price: 1250000, beds: 5, baths: 4, sqft: 4100, status: 'Active', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '4', address: '320 Harbor Point Ln', city: 'Miami', state: 'FL', zip: '33101', price: 890000, beds: 3, baths: 3, sqft: 2100, status: 'Pending', daysOnMarket: 14, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Townhouse' },
  { id: '5', address: '112 Elmwood Circle', city: 'Nashville', state: 'TN', zip: '37201', price: 375000, beds: 3, baths: 2, sqft: 1650, status: 'Active', daysOnMarket: 5, photo: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80', type: 'Single Family' },
  { id: '6', address: '9001 Hillcrest Ave', city: 'Los Angeles', state: 'CA', zip: '90210', price: 2750000, beds: 6, baths: 5, sqft: 5800, status: 'Coming Soon', daysOnMarket: 0, photo: 'https://images.unsplash.com/photo-1494526585095-c41746248156?w=600&q=80', type: 'Single Family' },
  { id: '7', address: '455 River Run Pkwy', city: 'Portland', state: 'OR', zip: '97201', price: 540000, beds: 4, baths: 2, sqft: 2200, status: 'Active', daysOnMarket: 10, photo: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=600&q=80', type: 'Single Family' },
  { id: '8', address: '23 Beacon Hill Rd', city: 'Boston', state: 'MA', zip: '02101', price: 995000, beds: 4, baths: 3, sqft: 2900, status: 'Active', daysOnMarket: 21, photo: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&q=80', type: 'Townhouse' },
  { id: '9', address: '5678 Grand Oak Blvd', city: 'Atlanta', state: 'GA', zip: '30301', price: 425000, beds: 4, baths: 3, sqft: 2600, status: 'Active', daysOnMarket: 3, photo: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80', type: 'Single Family' },
  { id: '10', address: '101 Westside Terrace', city: 'Seattle', state: 'WA', zip: '98101', price: 875000, beds: 3, baths: 2, sqft: 1800, status: 'Active', daysOnMarket: 6, photo: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&q=80', type: 'Condo' },
  { id: '11', address: '7821 Crestwood Dr',
