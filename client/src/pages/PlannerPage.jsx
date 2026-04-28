import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ItineraryForm from '../components/ItineraryForm';
import ItineraryDisplay from '../components/ItineraryDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { MapPin, Sparkles, Backpack, Map } from 'lucide-react';

// Destination coordinates for the map
const DEST_COORDS = {
  paris: [48.8566, 2.3522], tokyo: [35.6762, 139.6503], bali: [-8.3405, 115.0920],
  'new york': [40.7128, -74.0060], london: [51.5074, -0.1278], dubai: [25.2048, 55.2708],
  rome: [41.9028, 12.4964], barcelona: [41.3851, 2.1734], sydney: [-33.8688, 151.2093],
  bangkok: [13.7563, 100.5018], singapore: [1.3521, 103.8198], maldives: [3.2028, 73.2207],
  goa: [15.2993, 74.1240], kerala: [10.8505, 76.2711], bangalore: [12.9716, 77.5946],
  mangalore: [12.9141, 74.8560], udupi: [13.3409, 74.7421], mysore: [12.2958, 76.6394],
  switzerland: [46.8182, 8.2275], greece: [37.9838, 23.7275],
};

const getMapUrl = (destination) => {
  const key = destination?.toLowerCase().trim();
  const coords = DEST_COORDS[key];
  if (coords) {
    const [lat, lon] = coords;
    return `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.3},${lat - 0.2},${lon + 0.3},${lat + 0.2}&layer=mapnik&marker=${lat},${lon}`;
  }
  // fallback: search by name
  return `https://www.openstreetmap.org/export/embed.html?bbox=-180,-85,180,85&layer=mapnik`;
};

const PlannerPage = () => {
  const [itinerary, setItinerary] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [saved, setSaved]         = useState(false);
  const [searchParams]            = useSearchParams();
  const { token }                 = useAuth();

  const preFilledDestination = searchParams.get('destination') || '';

  const handlePlanTrip = async (formData) => {
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const dest = encodeURIComponent(formData.destination);
      const [planRes, eventsRes, transportRes] = await Promise.all([
        fetch('/api/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        }),
        fetch(`/api/events?destination=${dest}`),
        fetch(`/api/transport?destination=${dest}`),
      ]);

      if (!planRes.ok) {
        const err = await planRes.json();
        throw new Error(err.error || 'Failed to generate itinerary.');
      }

      const [planData, eventsData, transportData] = await Promise.all([
        planRes.json(), eventsRes.json(), transportRes.json(),
      ]);

      setItinerary({ ...planData, events: eventsData.events || [], transport: transportData.transport || [] });
    } catch (err) {
      setError(err.message || 'Failed to generate itinerary. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!itinerary || !token) return;
    try {
      const res = await fetch('/api/plans/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(itinerary),
      });
      if (res.ok) setSaved(true);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Page header */}
      <div className="bg-dark-3 border-b border-dark-border pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-gold text-xs font-bold tracking-widest uppercase mb-3">
            <MapPin className="w-3.5 h-3.5" /> Trip Planner
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-white mb-2">Plan Your Adventure</h1>
          <p className="text-zinc-500">Fill in your details and get a complete itinerary with events & transport</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Two-column layout on large screens */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* LEFT — Form (sticky) */}
          <div className="w-full lg:w-[400px] lg:sticky lg:top-24 flex-shrink-0">
            <ItineraryForm
              onSubmit={handlePlanTrip}
              loading={loading}
              preFilledDestination={preFilledDestination}
            />

            {error && (
              <div className="mt-4 flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                <span className="text-base flex-shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* RIGHT — Results */}
          <div className="flex-1 min-w-0">
            {loading && (
              <div className="flex items-center justify-center min-h-[400px]">
                <LoadingSpinner message="Crafting your perfect itinerary..." />
              </div>
            )}

            {!loading && !itinerary && (
              <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
                <div className="w-20 h-20 rounded-2xl bg-dark-3 border border-dark-border flex items-center justify-center mb-5">
                  <Sparkles className="w-8 h-8 text-gold/40" />
                </div>
                <h3 className="text-lg font-bold text-zinc-400 mb-2">Your itinerary will appear here</h3>
                <p className="text-zinc-600 text-sm max-w-xs">Fill in the form and click Generate to create your personalised travel plan</p>
              </div>
            )}

            {!loading && itinerary && (
              <>
                <ItineraryDisplay itinerary={itinerary} onSave={handleSave} saved={saved} />

                {/* ── MAP ── */}
                <div className="mt-6 rounded-2xl overflow-hidden border border-dark-border bg-dark-3">
                  {/* Map header */}
                  <div className="flex items-center justify-between px-5 py-4 border-b border-dark-border">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center">
                        <Map className="w-4 h-4 text-gold" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">Destination Map</h3>
                        <p className="text-zinc-500 text-xs">{itinerary.destination}{itinerary.country ? `, ${itinerary.country}` : ''}</p>
                      </div>
                    </div>
                    <a
                      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(itinerary.destination)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gold border border-gold/30 rounded-lg hover:bg-gold/10 transition-colors"
                    >
                      <MapPin className="w-3 h-3" /> Open Full Map
                    </a>
                  </div>
                  {/* Map iframe */}
                  <div className="relative" style={{ height: '380px' }}>
                    <iframe
                      key={itinerary.destination}
                      title={`Map of ${itinerary.destination}`}
                      src={getMapUrl(itinerary.destination)}
                      width="100%"
                      height="100%"
                      style={{ border: 'none', filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(1.1) saturate(0.8)' }}
                      loading="lazy"
                      allowFullScreen
                    />
                    {/* Gold pin overlay */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 bg-dark-3/90 backdrop-blur-sm border border-gold/20 rounded-lg pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
                      <span className="text-gold text-xs font-semibold">{itinerary.destination}</span>
                    </div>
                  </div>
                </div>

                {/* Things to Carry hint */}
                {itinerary.packingList?.length > 0 && (
                  <div className="mt-4 flex items-center gap-3 p-4 rounded-xl bg-gold/5 border border-gold/20">
                    <Backpack className="w-5 h-5 text-gold flex-shrink-0" />
                    <p className="text-sm text-zinc-300">
                      <span className="text-gold font-semibold">Things to Carry</span> — open the{' '}
                      <span className="text-gold font-semibold">Pack List</span> tab above to see your personalised packing checklist for {itinerary.destination}.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlannerPage;
