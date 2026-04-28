import React, { useState } from 'react';
import {
  BookmarkPlus, DollarSign, Calendar, Clock,
  CheckCircle2, Download, CalendarDays, Car, Route, MapPin,
  Building2, Utensils, Camera, Backpack, CheckSquare
} from 'lucide-react';
import DayCard from './DayCard';
import WeatherWidget from './WeatherWidget';
import EventsSection from './EventsSection';
import TransportSection from './TransportSection';
import { useAuth } from '../context/AuthContext';

const TABS = [
  { id: 'itinerary', label: 'Itinerary',  icon: Route       },
  { id: 'places',    label: 'Places',     icon: MapPin      },
  { id: 'events',    label: 'Events',     icon: CalendarDays },
  { id: 'transport', label: 'Transport',  icon: Car          },
  { id: 'packing',   label: 'Pack List',  icon: Backpack     },
];

const PackingList = ({ packingList }) => {
  const [checked, setChecked] = useState({});
  if (!packingList?.length) return <p className="text-zinc-500 text-sm">No packing data available.</p>;
  const toggle = (cat, item) => setChecked((p) => ({ ...p, [`${cat}|${item}`]: !p[`${cat}|${item}`] }));
  const total   = packingList.reduce((s, c) => s + c.items.length, 0);
  const done    = Object.values(checked).filter(Boolean).length;
  return (
    <div className="space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3 p-4 bg-dark-5 rounded-xl border border-dark-border">
        <Backpack className="w-5 h-5 text-gold flex-shrink-0" />
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-zinc-400 font-semibold">Packing Progress</span>
            <span className="text-gold font-bold">{done}/{total} items</span>
          </div>
          <div className="h-1.5 bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-gold-dark to-gold rounded-full transition-all duration-500"
              style={{ width: total ? `${(done / total) * 100}%` : '0%' }}
            />
          </div>
        </div>
      </div>
      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {packingList.map((cat) => (
          <div key={cat.category} className="bg-dark-5 rounded-xl border border-dark-border p-4">
            <h4 className="text-sm font-bold text-gold mb-3 flex items-center gap-2">
              <CheckSquare className="w-4 h-4" /> {cat.category}
            </h4>
            <ul className="space-y-2">
              {cat.items.map((item) => {
                const key = `${cat.category}|${item}`;
                return (
                  <li
                    key={item}
                    onClick={() => toggle(cat.category, item)}
                    className="flex items-center gap-2.5 cursor-pointer group"
                  >
                    <div className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-all ${
                      checked[key] ? 'bg-gold border-gold' : 'border-zinc-600 group-hover:border-gold/50'
                    }`}>
                      {checked[key] && <CheckCircle2 className="w-3 h-3 text-dark" />}
                    </div>
                    <span className={`text-sm transition-colors ${
                      checked[key] ? 'line-through text-zinc-600' : 'text-zinc-300 group-hover:text-white'
                    }`}>{item}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

const downloadItinerary = (itinerary) => {
  const lines = [
    `TRAVEL ITINERARY — ${itinerary.destination.toUpperCase()}${itinerary.country ? `, ${itinerary.country}` : ''}`,
    '='.repeat(52),
    `${itinerary.description || ''}`,
    '',
    `Duration  : ${itinerary.days.length} Days`,
    `Est. Cost : ${itinerary.totalCost}`,
    `Best Time : ${itinerary.bestTime}`,
    `Weather   : ${itinerary.weather}`,
    '', 'RECOMMENDED HOTELS', '-'.repeat(52),
  ];
  if (itinerary.hotels) {
    itinerary.hotels.forEach((h) => lines.push(`• ${h.name} (${h.location}) - ${h.price} - ★${h.rating}`));
  }
  lines.push('', 'TOP ATTRACTIONS', '-'.repeat(52));
  if (itinerary.attractions) {
    itinerary.attractions.forEach((a) => lines.push(`• ${a.name} - ${a.cost} - ${a.time}`));
  }
  lines.push('', 'DAY-BY-DAY PLAN', '-'.repeat(52));
  itinerary.days.forEach((day) => {
    lines.push(`\nDay ${day.day} — ${day.theme}`);
    day.activities.forEach((a, i) => {
      lines.push(`  ${i + 1}. ${a.name}`);
      lines.push(`     ${a.description}`);
      lines.push(`     Time: ${a.time} | Cost: ${a.cost} | Location: ${a.location}`);
    });
    if (day.meals) lines.push(`\n  Meals: ${day.meals}`);
  });
  if (itinerary.events?.length) {
    lines.push('\n' + '='.repeat(52), 'LOCAL EVENTS', '-'.repeat(52));
    itinerary.events.forEach((e) => lines.push(`• ${e.name} (${e.date}) — ${e.description}`));
  }
  const blob = new Blob([lines.join('\n')], { type: 'text/plain' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `${itinerary.destination.replace(/\s+/g, '_')}_itinerary.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const ItineraryDisplay = ({ itinerary, onSave, saved }) => {
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('itinerary');
  if (!itinerary?.days) return null;

  return (
    <div className="space-y-5 animate-fade-in">

      {/* ── Summary card ── */}
      <div className="rounded-2xl bg-dark-3 border border-dark-border overflow-hidden">
        {/* Gold top bar */}
        <div className="h-1 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
        <div className="p-6">
          <div className="flex items-start justify-between flex-wrap gap-4 mb-5">
            <div>
              <h2 className="text-2xl font-black text-white">📍 {itinerary.destination}{itinerary.country && <span className="text-zinc-500">, {itinerary.country}</span>}</h2>
              <p className="text-zinc-500 text-sm mt-1">{itinerary.description || `Your personalised ${itinerary.days.length}-day journey`}</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => downloadItinerary(itinerary)}
                className="flex items-center gap-2 px-4 py-2 bg-dark-5 hover:bg-dark-6 border border-dark-7 hover:border-zinc-600 rounded-xl text-sm font-medium text-zinc-300 hover:text-white transition-all"
              >
                <Download className="w-4 h-4" /> Download
              </button>
              {isAuthenticated ? (
                <button
                  onClick={onSave}
                  disabled={saved}
                  className="flex items-center gap-2 px-4 py-2 bg-gold/10 hover:bg-gold/20 border border-gold/30 hover:border-gold/50 rounded-xl text-sm font-medium text-gold transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {saved ? <CheckCircle2 className="w-4 h-4" /> : <BookmarkPlus className="w-4 h-4" />}
                  {saved ? 'Saved!' : 'Save Trip'}
                </button>
              ) : (
                <p className="text-zinc-600 text-xs self-center">Login to save</p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Calendar,    label: 'Duration',  val: `${itinerary.days.length} Days` },
              { icon: DollarSign,  label: 'Est. Cost', val: itinerary.totalCost             },
              { icon: Clock,       label: 'Best Time', val: itinerary.bestTime              },
            ].map(({ icon: Icon, label, val }) => (
              <div key={label} className="bg-dark-5 rounded-xl p-3 border border-dark-border">
                <div className="flex items-center gap-1.5 text-zinc-600 text-xs mb-1.5">
                  <Icon className="w-3.5 h-3.5" /> {label}
                </div>
                <p className="font-bold text-white text-sm truncate">{val}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Weather */}
      <WeatherWidget weather={itinerary.weather} />

      {/* ── Tabs ── */}
      <div className="bg-dark-3 rounded-2xl border border-dark-border overflow-hidden">
        {/* Tab bar */}
        <div className="flex border-b border-dark-border">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-semibold transition-all duration-200 ${
                activeTab === id
                  ? 'text-gold border-b-2 border-gold bg-gold/5'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/3'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{label}</span>
              {id === 'events' && itinerary.events?.length > 0 && (
                <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-bold">
                  {itinerary.events.length}
                </span>
              )}
              {id === 'transport' && itinerary.transport?.length > 0 && (
                <span className="px-1.5 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full font-bold">
                  {itinerary.transport.length}
                </span>
              )}
              {id === 'packing' && itinerary.packingList?.length > 0 && (
                <span className="px-1.5 py-0.5 bg-gold/20 text-gold text-xs rounded-full font-bold">
                  {itinerary.packingList.reduce((s, c) => s + c.items.length, 0)}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'itinerary' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-4 h-4 text-gold" />
                <h3 className="font-bold text-white">Day-by-Day Itinerary</h3>
              </div>
              {itinerary.days.map((day, i) => (
                <DayCard key={day.day} day={day} index={i} />
              ))}
            </div>
          )}
          {activeTab === 'places' && (
            <div className="space-y-6">
              {/* Hotels Section */}
              {itinerary.hotels && itinerary.hotels.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Building2 className="w-4 h-4 text-gold" />
                    <h3 className="font-bold text-white">Recommended Hotels</h3>
                  </div>
                  <div className="grid gap-3">
                    {itinerary.hotels.map((hotel, i) => (
                      <div key={i} className="bg-dark-5 rounded-xl p-4 border border-dark-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">{hotel.name}</h4>
                            <p className="text-zinc-500 text-sm">{hotel.location}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold font-bold">{hotel.price}</p>
                            <p className="text-zinc-500 text-xs">★ {hotel.rating}</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {hotel.amenities?.map((amenity, j) => (
                            <span key={j} className="px-2 py-1 bg-dark-6 text-zinc-400 text-xs rounded-lg">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Restaurants Section */}
              {itinerary.restaurants && itinerary.restaurants.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Utensils className="w-4 h-4 text-gold" />
                    <h3 className="font-bold text-white">Dining Recommendations</h3>
                  </div>
                  <div className="grid gap-3">
                    {itinerary.restaurants.map((restaurant, i) => (
                      <div key={i} className="bg-dark-5 rounded-xl p-4 border border-dark-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">{restaurant.name}</h4>
                            <p className="text-zinc-500 text-sm">{restaurant.cuisine}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold font-bold">{restaurant.price}</p>
                            <p className="text-zinc-500 text-xs">★ {restaurant.rating}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attractions Section */}
              {itinerary.attractions && itinerary.attractions.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Camera className="w-4 h-4 text-gold" />
                    <h3 className="font-bold text-white">Top Attractions</h3>
                  </div>
                  <div className="grid gap-3">
                    {itinerary.attractions.map((attraction, i) => (
                      <div key={i} className="bg-dark-5 rounded-xl p-4 border border-dark-border">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-white">{attraction.name}</h4>
                            <p className="text-zinc-400 text-sm">{attraction.description}</p>
                            <p className="text-zinc-500 text-xs mt-1">⏱ {attraction.time} • 📍 {attraction.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gold font-bold">{attraction.cost}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          {activeTab === 'events' && (
            <EventsSection events={itinerary.events || []} destination={itinerary.destination} />
          )}
          {activeTab === 'transport' && (
            <TransportSection transport={itinerary.transport || []} destination={itinerary.destination} />
          )}
          {activeTab === 'packing' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <Backpack className="w-4 h-4 text-gold" />
                <h3 className="font-bold text-white">Things to Carry</h3>
                <span className="text-zinc-500 text-xs">— tap items to check them off</span>
              </div>
              <PackingList packingList={itinerary.packingList} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItineraryDisplay;
