import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, ArrowRight, Zap, Globe, Shield,
  Calendar, Users, Award, Star, Play, CheckCircle,
} from 'lucide-react';

const DESTINATIONS = [
  { name: 'Paris',    tag: 'City of Light',      img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&q=80', days: '5–7 days' },
  { name: 'Tokyo',    tag: 'Future & Tradition',  img: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=600&q=80', days: '7–10 days' },
  { name: 'Bali',     tag: 'Island Paradise',     img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&q=80', days: '5–8 days' },
  { name: 'New York', tag: 'The Big Apple',       img: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=600&q=80', days: '4–6 days' },
  { name: 'Maldives', tag: 'Ocean Dreams',        img: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=600&q=80', days: '5–7 days' },
  { name: 'London',   tag: 'Royal Heritage',      img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&q=80', days: '4–6 days' },
];

const FEATURES = [
  { icon: Zap,      title: 'Instant Plans',      desc: 'Day-by-day itinerary generated in seconds.' },
  { icon: Globe,    title: 'Any Destination',    desc: 'Worldwide coverage with local insights.'    },
  { icon: Calendar, title: 'Local Events',       desc: 'Festivals, Yakshagana, cultural shows.'     },
  { icon: Users,    title: 'Transport Info',     desc: 'Bus, train, taxi & rental options.'         },
  { icon: Shield,   title: 'Save & Revisit',     desc: 'Store trips and access anytime.'            },
  { icon: Award,    title: 'Smart Budget',       desc: 'Cost estimates per day and total trip.'     },
];

const STATS = [
  { value: '10K+', label: 'Trips Planned'  },
  { value: '150+', label: 'Destinations'   },
  { value: '4.9',  label: 'Avg Rating'     },
  { value: '3min', label: 'Avg Plan Time'  },
];

const TESTIMONIALS = [
  { name: 'Priya S.',  loc: 'Bangalore', text: 'Planned my Goa trip in minutes. The Yakshagana event suggestion was a wonderful surprise!', rating: 5 },
  { name: 'James K.',  loc: 'London',    text: 'Tokyo itinerary was spot-on. Transport options saved me hours of research.',                 rating: 5 },
  { name: 'Aisha M.',  loc: 'Dubai',     text: 'Beautiful dark UI and incredibly useful. Saved my Paris plan and revisited it many times.',  rating: 5 },
];

const StarRow = ({ n }) => (
  <div className="flex gap-0.5">
    {Array.from({ length: n }).map((_, i) => (
      <Star key={i} className="w-3.5 h-3.5 text-gold fill-gold" />
    ))}
  </div>
);

export default function HomePage() {
  return (
    <div className="min-h-screen bg-dark text-white">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        {/* Beautiful full-page travel background */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=95"
            alt="Travel background"
            className="w-full h-full object-cover"
            style={{ objectPosition: 'center 55%' }}
          />
          {/* Left-side dark fade so text is crisp */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />
          {/* Bottom fade into page */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/40" />
          {/* Gold shimmer layer */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.08) 0%, transparent 60%)' }} />
        </div>

        {/* Glow blobs */}
        <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-gold/8 blur-3xl pointer-events-none animate-float" />
        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full bg-gold/5 blur-3xl pointer-events-none animate-float-delayed" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 w-full">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gold/30 bg-gold/10 text-gold text-xs font-semibold tracking-wider uppercase mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              AI-Powered Travel Planning
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight mb-6">
              Your Next<br />
              <span className="text-gold">Adventure</span><br />
              Starts Here.
            </h1>

            <p className="text-zinc-400 text-lg leading-relaxed mb-10 max-w-lg">
              Generate personalised day-by-day travel itineraries in seconds.
              Events, transport, budget — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 mb-16">
              <Link
                to="/planner"
                className="group inline-flex items-center gap-2 px-7 py-3.5 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl shadow-xl shadow-gold/25 hover:shadow-gold/40 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <span className="relative z-10">Start Planning</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/events"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-transparent border border-dark-7 hover:border-zinc-500 text-zinc-300 hover:text-white font-semibold rounded-xl transition-all duration-200 hover:bg-white/5"
              >
                <Calendar className="w-4 h-4" /> Explore Events
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-white">{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-zinc-600 pointer-events-none">
          <div className="w-5 h-8 border border-zinc-700 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-zinc-500 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ── FEATURES STRIP ── */}
      <section className="bg-dark-3 border-y border-dark-border py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="group text-center">
                <div className="w-10 h-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 group-hover:border-gold/40 group-hover:scale-110 transition-all duration-300">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <p className="text-sm font-semibold text-white mb-1">{title}</p>
                <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6 bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            {/* Left text */}
            <div className="lg:w-2/5">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-4">How It Works</p>
              <h2 className="text-4xl md:text-5xl font-black leading-tight mb-6">
                Plan your trip<br />in <span className="text-gold">3 steps</span>
              </h2>
              <p className="text-zinc-400 leading-relaxed mb-8">
                No complicated forms. No endless research. Just enter your details and get a complete travel plan instantly.
              </p>
              <Link
                to="/planner"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl transition-all duration-200 hover:scale-105 shadow-lg shadow-gold/20"
              >
                Try It Now <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right steps */}
            <div className="lg:w-3/5 space-y-4">
              {[
                { n: '01', title: 'Enter Your Details',   desc: 'Destination, number of days, budget range, and your interests.',                  icon: '📝' },
                { n: '02', title: 'Generate Your Plan',   desc: 'We instantly create a day-by-day itinerary with activities, meals, and costs.',   icon: '⚡' },
                { n: '03', title: 'Explore & Book',       desc: 'Browse local events, transport options, and download or save your itinerary.',    icon: '🗺️' },
              ].map((s, i) => (
                <div
                  key={s.n}
                  className="group flex items-start gap-5 p-5 rounded-2xl bg-dark-3 border border-dark-border hover:border-gold/30 hover:bg-dark-4 transition-all duration-300"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform duration-300">
                    {s.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="text-xs font-bold text-gold/60 tracking-widest">{s.n}</span>
                      <h3 className="font-bold text-white">{s.title}</h3>
                    </div>
                    <p className="text-zinc-500 text-sm leading-relaxed">{s.desc}</p>
                  </div>
                  <CheckCircle className="w-5 h-5 text-gold/30 group-hover:text-gold/60 transition-colors flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ── */}
      <section className="py-24 px-6 bg-dark-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">Destinations</p>
              <h2 className="text-4xl md:text-5xl font-black">Popular Places</h2>
            </div>
            <Link to="/planner" className="hidden md:flex items-center gap-2 text-sm text-zinc-400 hover:text-gold transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Asymmetric grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {DESTINATIONS.map((d, i) => (
              <Link
                key={d.name}
                to={`/planner?destination=${encodeURIComponent(d.name)}`}
                className={`group relative rounded-2xl overflow-hidden ${
                  i === 0 ? 'md:col-span-2 md:row-span-2' : ''
                }`}
                style={{ aspectRatio: i === 0 ? '1/1' : '4/3' }}
              >
                <img
                  src={d.img}
                  alt={d.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-xs text-gold font-semibold mb-1">{d.days}</p>
                  <h3 className={`font-black text-white ${i === 0 ? 'text-2xl' : 'text-lg'}`}>{d.name}</h3>
                  <p className="text-zinc-400 text-xs">{d.tag}</p>
                </div>
                <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight className="w-3.5 h-3.5 text-white" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 px-6 bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-3">Testimonials</p>
            <h2 className="text-4xl md:text-5xl font-black">Loved by Travellers</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="group p-6 rounded-2xl bg-dark-3 border border-dark-border hover:border-gold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-gold/5 transition-all duration-300"
              >
                <StarRow n={t.rating} />
                <p className="text-zinc-300 text-sm leading-relaxed my-4 italic">"{t.text}"</p>
                <div className="flex items-center gap-3 pt-4 border-t border-dark-border">
                  <div className="w-9 h-9 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center text-sm font-bold text-gold">
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.loc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-dark-3 border-t border-dark-border">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-dark-5 to-dark-4 border border-gold/20 p-12 md:p-16 text-center">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, #C9A84C 1px, transparent 0)', backgroundSize: '28px 28px' }} />
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-gold/8 blur-3xl" />
            <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-gold/5 blur-3xl" />
            <div className="relative z-10">
              <p className="text-gold text-xs font-bold tracking-widest uppercase mb-4">Get Started Free</p>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                Ready to Explore<br />the World?
              </h2>
              <p className="text-zinc-400 mb-10 max-w-md mx-auto">
                Create your first itinerary in under 3 minutes. No credit card required.
              </p>
              <Link
                to="/planner"
                className="group inline-flex items-center gap-3 px-8 py-4 bg-gold hover:bg-gold-dark text-dark font-black text-lg rounded-2xl shadow-2xl shadow-gold/30 hover:shadow-gold/50 transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                <MapPin className="w-5 h-5 relative z-10" />
                <span className="relative z-10">Plan My Trip Now</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-dark border-t border-dark-border py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-10">
            <div className="max-w-xs">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gold flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-dark" />
                </div>
                <span className="font-bold text-lg text-white">Travel<span className="text-gold">Plan</span></span>
              </div>
              <p className="text-zinc-500 text-sm leading-relaxed">
                AI-powered travel planning for modern explorers. Plan smarter, travel better.
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-sm">
              <div>
                <p className="text-white font-semibold mb-3">Product</p>
                <div className="space-y-2">
                  <Link to="/planner" className="block text-zinc-500 hover:text-gold transition-colors">Plan a Trip</Link>
                  <Link to="/events"  className="block text-zinc-500 hover:text-gold transition-colors">Events</Link>
                  <Link to="/saved"   className="block text-zinc-500 hover:text-gold transition-colors">Saved Trips</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Account</p>
                <div className="space-y-2">
                  <Link to="/auth"           className="block text-zinc-500 hover:text-gold transition-colors">Login</Link>
                  <Link to="/auth?tab=signup" className="block text-zinc-500 hover:text-gold transition-colors">Sign Up</Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Destinations</p>
                <div className="space-y-2">
                  {['Paris', 'Tokyo', 'Bali', 'London'].map((d) => (
                    <Link key={d} to={`/planner?destination=${d}`} className="block text-zinc-500 hover:text-gold transition-colors">{d}</Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-dark-border pt-6 flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-zinc-600 text-sm">© 2025 TravelPlan. All rights reserved.</p>
            <p className="text-zinc-700 text-xs">Built with ❤️ for travellers worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
