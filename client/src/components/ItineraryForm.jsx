import React, { useState } from 'react';
import { MapPin, Calendar, Wallet, Heart, Sparkles } from 'lucide-react';

const BUDGET_OPTIONS = [
  { value: '',          label: 'Select budget range' },
  { value: 'budget',    label: '💼  Budget  ($500 – $2,000)' },
  { value: 'mid-range', label: '✈️   Mid-range ($2,000 – $5,000)' },
  { value: 'luxury',    label: '👑  Luxury  ($5,000+)' },
];

const INTEREST_CHIPS = ['culture', 'food', 'adventure', 'relaxation', 'shopping', 'nature'];

const ItineraryForm = ({ onSubmit, loading, preFilledDestination = '' }) => {
  const [formData, setFormData] = useState({
    destination: preFilledDestination,
    days: '',
    budget: '',
    interests: '',
  });
  const [errors, setErrors] = useState({});
  const [chips, setChips] = useState([]);

  const toggleChip = (chip) => {
    let next;
    if (chips.includes(chip)) {
      next = chips.filter((c) => c !== chip);
    } else {
      next = [...chips, chip];
    }
    setChips(next);
    setFormData((prev) => ({ ...prev, interests: next.join(', ') }));
    if (errors.interests) {
      setErrors((prev) => ({ ...prev, interests: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const e = {};
    if (!formData.destination.trim()) e.destination = 'Enter a destination.';
    const d = parseInt(formData.days);
    if (!formData.days || isNaN(d) || d < 1 || d > 30) e.days = 'Enter 1–30 days.';
    if (!formData.budget) e.budget = 'Select a budget.';
    if (!formData.interests.trim()) e.interests = 'Add at least one interest.';
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    onSubmit(formData);
  };

  const inputCls = (name) => {
    const base = 'w-full px-4 py-3 bg-dark-5 border rounded-xl text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50 focus:border-gold/50 transition-all duration-200';
    const err = 'border-red-500/50 bg-red-500/5';
    const normal = 'border-dark-7 hover:border-zinc-600';
    return `${base} ${errors[name] ? err : normal}`;
  };

  return (
    <div className="bg-dark-3 rounded-2xl border border-dark-border overflow-hidden">
      <div className="px-6 py-5 border-b border-dark-border">
        <h2 className="font-bold text-white text-lg">Trip Details</h2>
        <p className="text-zinc-500 text-sm mt-0.5">Fill in the details below</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-5">
        {/* Destination */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-gold" /> Destination
          </label>
          <input
            type="text"
            name="destination"
            value={formData.destination}
            onChange={handleChange}
            placeholder="e.g., Paris, Tokyo, Bali"
            className={inputCls('destination')}
          />
          {errors.destination && <p className="text-red-400 text-xs mt-1">{errors.destination}</p>}
        </div>

        {/* Days */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            <Calendar className="w-3.5 h-3.5 text-gold" /> Number of Days
          </label>
          <input
            type="number"
            name="days"
            value={formData.days}
            onChange={handleChange}
            placeholder="e.g., 7"
            min="1"
            max="30"
            className={inputCls('days')}
          />
          {errors.days && <p className="text-red-400 text-xs mt-1">{errors.days}</p>}
        </div>

        {/* Budget */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            <Wallet className="w-3.5 h-3.5 text-gold" /> Budget
          </label>
          <select
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            className={`${inputCls('budget')} cursor-pointer`}
          >
            {BUDGET_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-dark-5">
                {o.label}
              </option>
            ))}
          </select>
          {errors.budget && <p className="text-red-400 text-xs mt-1">{errors.budget}</p>}
        </div>

        {/* Interests */}
        <div>
          <label className="flex items-center gap-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            <Heart className="w-3.5 h-3.5 text-gold" /> Interests
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {INTEREST_CHIPS.map((chip) => {
              const active = chips.includes(chip);
              return (
                <button
                  key={chip}
                  type="button"
                  onClick={() => toggleChip(chip)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-200 capitalize ${
                    active
                      ? 'bg-gold/20 border-gold/50 text-gold'
                      : 'bg-dark-5 border-dark-7 text-zinc-500 hover:border-zinc-500 hover:text-zinc-300'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
          <input
            type="text"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            placeholder="or type: culture, food, adventure..."
            className={inputCls('interests')}
          />
          {errors.interests && <p className="text-red-400 text-xs mt-1">{errors.interests}</p>}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="group w-full flex items-center justify-center gap-2 py-3.5 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl shadow-lg shadow-gold/20 hover:shadow-gold/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
          <Sparkles className="w-4 h-4 relative z-10 group-hover:rotate-12 transition-transform duration-300" />
          <span className="relative z-10">{loading ? 'Generating...' : 'Generate Itinerary'}</span>
        </button>
      </form>
    </div>
  );
};

export default ItineraryForm;
