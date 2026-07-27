import React, { useState } from 'react';
import { Clock, DollarSign, MapPin, Coffee, ChevronDown, ChevronUp } from 'lucide-react';

const ACCENTS = [
  { border: 'border-gold/40',      badge: 'bg-gold text-dark' },
  { border: 'border-blue-500/40',  badge: 'bg-blue-500 text-white' },
  { border: 'border-purple-500/40',badge: 'bg-purple-500 text-white' },
  { border: 'border-green-500/40', badge: 'bg-green-500 text-white' },
  { border: 'border-pink-500/40',  badge: 'bg-pink-500 text-white' },
];

const DayCard = ({ day, index }) => {
  const [expanded, setExpanded] = useState(true);
  const accent = ACCENTS[index % ACCENTS.length];

  return (
    <div
      className={`rounded-xl border-l-2 ${accent.border} bg-dark-4 border border-dark-border hover:border-dark-7 hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5 transition-all duration-300 animate-fade-in`}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 cursor-pointer select-none group"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className={`w-9 h-9 rounded-lg ${accent.badge} flex items-center justify-center font-black text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            {day.day}
          </div>
          <div>
            <h3 className="font-bold text-white text-base leading-tight">Day {day.day}</h3>
            <p className="text-zinc-500 text-xs">{day.theme}</p>
          </div>
        </div>
        <span className="p-1.5 rounded-lg hover:bg-dark-6 text-zinc-600 transition-colors">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </span>
      </div>

      {/* Body */}
      {expanded && (
        <div className="px-5 pb-5 space-y-2.5">
          {day.activities && day.activities.length > 0 ? (
            day.activities.map((activity, i) => (
              <div
                key={i}
                className="bg-dark-5 rounded-xl p-4 border border-dark-border hover:border-dark-7 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-md ${accent.badge} flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-white text-sm">{activity.name}</h4>
                    <p className="text-zinc-500 text-xs mt-1 leading-relaxed">{activity.description}</p>
                    <div className="flex flex-wrap gap-3 mt-2.5">
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <Clock className="w-3 h-3 text-gold/60" /> {activity.time}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <DollarSign className="w-3 h-3 text-green-500/60" /> {activity.cost}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-zinc-600">
                        <MapPin className="w-3 h-3 text-blue-500/60" /> {activity.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-zinc-600 text-sm italic">No activities planned.</p>
          )}

          {day.meals && (
            <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-4">
              <div className="flex items-start gap-2">
                <Coffee className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-green-400 text-xs uppercase tracking-wider mb-1">Meals & Tips</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">{day.meals}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DayCard;
