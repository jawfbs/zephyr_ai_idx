'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Heart,
  Share2,
  MapPin,
  Bed,
  Bath,
  Square,
  Calendar,
  Car,
  Home,
  Phone,
  Mail,
  ChevronLeft,
  ChevronRight,
  X,
  Calculator,
  Building,
  User,
  Star,
  TrendingUp,
  Clock,
} from 'lucide-react';
import { PhotoLightbox } from '@/components/PhotoLightbox';
import { MortgageCalculator } from '@/components/MortgageCalculator';
import { NeighborhoodData } from '@/components/NeighborhoodData';
import { AIFeatureButton } from '@/components/AIFeatureButton';
import { useAuth } from '@clerk/nextjs';

export default function PropertyPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const { isSignedIn, user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showMortgageCalculator, setShowMortgageCalculator] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in this property at ${listing?.Address?.Full || 'this address'}. Please contact me with more information.`,
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  useEffect(() => {
    // Load listing data
    const loadListing = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/listings?id=${id}`);
        const data = await response.json();
        
        if (data.listings && data.listings.length > 0) {
          setListing(data.listings[0]);
        } else {
          setError('Property not found');
        }
      } catch (err) {
        setError('Failed to load property');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadListing();
    }
  }, [id]);

  useEffect(() => {
    // Check if favorited
    if (typeof window !== 'undefined' && listing) {
      const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      setIsFavorite(favorites.some((f) => f.ListingId === listing.ListingId));
    }
  }, [listing]);

  const toggleFavorite = () => {
    if (!isSignedIn) {
      alert('Please sign in to save favorites');
      return;
    }

    const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
    let newFavorites;

    if (isFavorite) {
      newFavorites = favorites.filter((f) => f.ListingId !== listing.ListingId);
    } else {
      newFavorites = [...favorites, listing];
    }

    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${listing.Address?.Full} - ${listing.ListingId}`,
          text: `Check out this property: ${listing.Address?.Full}`,
          url: url,
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send to your backend/API
    console.log('Contact form submitted:', contactForm);
    setContactSubmitted(true);
    
    // Reset after 5 seconds
    setTimeout(() => {
      setContactSubmitted(false);
      setContactForm({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
    }, 5000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" role="status" aria-label="Loading property details"></div>
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Property Not Found</h1>
        <Link href="/" className="text-blue-600 hover:underline">
          Return to search
        </Link>
      </div>
    );
  }

  const photos = listing.Media || [
    { MediaURL: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200' },
  ];
  const address = listing.Address || {};
  const details = listing.Details || {};
  const price = listing.ListingPrice || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label="Go back to search results"
          >
            <ArrowLeft className="w-5 h-5" aria-hidden="true" />
            <span>Back to results</span>
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
              aria-label="Share this property"
            >
              <Share2 className="w-4 h-4" aria-hidden="true" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={toggleFavorite}
              className={`flex items-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
                isFavorite
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'hover:bg-gray-50'
              }`}
              aria-label={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
              aria-pressed={isFavorite}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} aria-hidden="true" />
              <span className="hidden sm:inline">{isFavorite ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Photo Gallery */}
        <section aria-label="Property photos">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            {/* Main Photo */}
            <div
              className="relative aspect-[4/3] lg:aspect-[16/10] rounded-xl overflow-hidden cursor-pointer group"
              onClick={() => {
                setCurrentPhotoIndex(0);
                setLightboxOpen(true);
              }}
              role="button"
              tabIndex={0}
              aria-label={`View photo 1 of ${photos.length}`}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setCurrentPhotoIndex(0);
                  setLightboxOpen(true);
                }
              }}
            >
              <img
                src={photos[0]?.MediaURL || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'}
                alt={`${address.Full || 'Property'} - Photo 1`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute bottom-4 left-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                View all {photos.length} photos
              </div>
            </div>

            {/* Thumbnail Grid */}
            {photos.length > 1 && (
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                {photos.slice(1, 7).map((photo, index) => (
                  <div
                    key={index}
                    className="relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => {
                      setCurrentPhotoIndex(index + 1);
                      setLightboxOpen(true);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`View photo ${index + 2} of ${photos.length}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        setCurrentPhotoIndex(index + 1);
                        setLightboxOpen(true);
                      }
                    }}
                  >
                    <img
                      src={photo.MediaURL}
                      alt={`${address.Full || 'Property'} - Photo ${index + 2}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {index === 5 && photos.length > 7 && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-semibold">
                        +{photos.length - 7} more
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Property Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price & Address */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-4xl font-bold text-blue-900 mb-2">
                    ${price.toLocaleString()}
                  </p>
                  <h1 className="text-2xl font-semibold text-gray-900 flex items-start gap-2">
                    <MapPin className="w-6 h-6 text-red-500 mt-1 flex-shrink-0" aria-hidden="true" />
                    <span>{address.Full || 'Address not available'}</span>
                  </h1>
                  <p className="text-gray-600 mt-1">
                    {address.City}, {address.StateOrProvince} {address.PostalCode}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">MLS® #{listing.ListingId}</p>
                  <p className="text-sm text-gray-500">
                    Listed {listing.ListingDate || 'recently'}
                  </p>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Bed className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-2xl font-semibold">{details.Bedrooms || details.Beds || '—'}</p>
                    <p className="text-sm text-gray-500">Beds</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-2xl font-semibold">{details.Bathrooms || details.Baths || '—'}</p>
                    <p className="text-sm text-gray-500">Baths</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Square className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-2xl font-semibold">
                      {details.BuildingAreaTotal?.toLocaleString() || details.Sqft?.toLocaleString() || '—'}
                    </p>
                    <p className="text-sm text-gray-500">Sq Ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" aria-hidden="true" />
                  <div>
                    <p className="text-2xl font-semibold">{details.YearBuilt || '—'}</p>
                    <p className="text-sm text-gray-500">Year Built</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Description */}
            <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="description-heading">
              <h2 id="description-heading" className="text-xl font-semibold text-gray-900 mb-4">
                About This Property
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {listing.PublicRemarks || 
                  'No description available. Contact the listing agent for more information about this beautiful property.'}
              </p>
            </section>

            {/* Property Features */}
            <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="features-heading">
              <h2 id="features-heading" className="text-xl font-semibold text-gray-900 mb-4">
                Property Features
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {details.GarageSpaces && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Car className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{details.GarageSpaces}</p>
                      <p className="text-sm text-gray-500">Garage Spaces</p>
                    </div>
                  </div>
                )}
                {details.LotSizeAcres && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Square className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{details.LotSizeAcres} acres</p>
                      <p className="text-sm text-gray-500">Lot Size</p>
                    </div>
                  </div>
                )}
                {details.PropertyType && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Home className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{details.PropertyType}</p>
                      <p className="text-sm text-gray-500">Property Type</p>
                    </div>
                  </div>
                )}
                {details.ExteriorFeatures && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Building className="w-6 h-6 text-gray-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium">{details.ExteriorFeatures}</p>
                      <p className="text-sm text-gray-500">Exterior</p>
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* AI Features */}
            <section className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 shadow-sm" aria-labelledby="ai-heading">
              <h2 id="ai-heading" className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">🤖</span> AI-Powered Insights
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AIFeatureButton
                  title="Price Analysis"
                  description="Is this a good deal?"
                  icon={<TrendingUp className="w-5 h-5" />}
                  propertyData={{ price, beds: details.Bedrooms, sqft: details.BuildingAreaTotal }}
                />
                <AIFeatureButton
                  title="Investment Potential"
                  description="Rental income estimate"
                  icon={<Calculator className="w-5 h-5" />}
                  propertyData={{ price, beds: details.Bedrooms, sqft: details.BuildingAreaTotal, location: address }}
                />
                <AIFeatureButton
                  title="Market Comparison"
                  description="Compare to similar homes"
                  icon={<Clock className="w-5 h-5" />}
                  propertyData={{ price, beds: details.Bedrooms, sqft: details.BuildingAreaTotal }}
                />
                <AIFeatureButton
                  title="Neighborhood Score"
                  description="Schools, walkability & more"
                  icon={<Star className="w-5 h-5" />}
                  propertyData={{ address }}
                />
              </div>
            </section>

            {/* Neighborhood Data */}
            <NeighborhoodData address={address} />

            {/* Mortgage Calculator Preview */}
            <section className="bg-white rounded-xl p-6 shadow-sm" aria-labelledby="mortgage-preview-heading">
              <div className="flex items-center justify-between mb-4">
                <h2 id="mortgage-preview-heading" className="text-xl font-semibold text-gray-900">
                  Mortgage Calculator
                </h2>
                <button
                  onClick={() => setShowMortgageCalculator(!showMortgageCalculator)}
                  className="text-blue-600 hover:underline text-sm"
                  aria-expanded={showMortgageCalculator}
                >
                  {showMortgageCalculator ? 'Hide' : 'Show'} Calculator
                </button>
              </div>
              {showMortgageCalculator && (
                <MortgageCalculator homePrice={price} />
              )}
              {!showMortgageCalculator && (
                <button
                  onClick={() => setShowMortgageCalculator(true)}
                  className="w-full py-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
                >
                  Click to calculate monthly payments
                </button>
              )}
            </section>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Agent Card */}
            <section className="bg-white rounded-xl p-6 shadow-sm sticky top-24" aria-labelledby="contact-heading">
              <h2 id="contact-heading" className="text-xl font-semibold text-gray-900 mb-4">
                Contact Agent
              </h2>
              
              {/* Agent Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-8 h-8 text-blue-600" aria-hidden="true" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Your Agent Name</p>
                  <p className="text-sm text-gray-500">Licensed Real Estate Agent</p>
                  <div className="flex items-center gap-1 mt-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" aria-hidden="true" />
                    ))}
                    <span className="text-sm text-gray-500 ml-1">(42 reviews)</span>
                  </div>
                </div>
              </div>

              {contactSubmitted ? (
                <div className="text-center py-8" role="alert">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✅</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h3>
                  <p className="text-gray-600">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="contact-name" className="block text-sm font-medium text-gray-700 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      id="contact-name"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="contact-email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      id="contact-phone"
                      value={contactForm.phone}
                      onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="(701) 555-0123"
                    />
                  </div>
                  <div>
                    <label htmlFor="contact-message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="contact-message"
                      rows={4}
                      value={contactForm.message}
                      onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Mail className="w-5 h-5" aria-hidden="true" />
                    Send Message
                  </button>
                </form>
              )}

              <div className="mt-4 flex items-center gap-2 justify-center">
                <Phone className="w-4 h-4 text-gray-500" aria-hidden="true" />
                <a href="tel:+17015550123" className="text-blue-600 hover:underline">
                  (701) 555-0123
                </a>
              </div>
            </section>

            {/* Schedule Tour Card */}
            <section className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white" aria-labelledby="tour-heading">
              <h2 id="tour-heading" className="text-xl font-semibold mb-4">
                Schedule a Tour
              </h2>
              <p className="text-blue-100 mb-4">
                See this property in person. Book a private showing today.
              </p>
              <button className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
                Book Showing
              </button>
            </section>

            {/* Mortgage Pre-approval */}
            <section className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200" aria-labelledby="preapproval-heading">
              <h2 id="preapproval-heading" className="text-lg font-semibold text-gray-900 mb-2">
                Get Pre-Approved
              </h2>
              <p className="text-gray-600 text-sm mb-4">
                Know your budget before you shop. Get pre-approved in minutes.
              </p>
              <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                Start Pre-Approval
              </button>
            </section>
          </div>
        </div>

        {/* Similar Listings - Placeholder */}
        <section className="mt-12" aria-labelledby="similar-heading">
          <h2 id="similar-heading" className="text-2xl font-bold text-gray-900 mb-6">
            Similar Homes You May Like
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* This would be populated with similar listings */}
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-gray-200 border-2 border-dashed rounded-xl h-64" />
            ))}
          </div>
        </section>
      </main>

      {/* Photo Lightbox */}
      <PhotoLightbox
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        photos={photos.map((p) => p.MediaURL)}
        currentIndex={currentPhotoIndex}
        onIndexChange={setCurrentPhotoIndex}
        propertyAddress={address.Full}
      />
    </div>
  );
}
