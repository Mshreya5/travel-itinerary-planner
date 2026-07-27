import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, DollarSign, Trash2, Lock, RefreshCw, Plus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const SavedTripsPage = () => {
  const { isAuthenticated, token } = useAuth();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/plans', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch saved trips.');
      const data = await res.json();
      setPlans(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) fetchPlans();
  }, [isAuthenticated]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    setDeleting(id);
    try {
      await fetch(`/api/plans/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      setPlans(plans.filter((p) => p._id !== id));
    } catch {
      alert('Failed to delete trip.');
    } finally {
      setDeleting(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark text-white pt-20 flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 bg-gold/10 border border-gold/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Lock className="w-7 h-7 text-gold" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3">Login Required</h2>
          <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
            Create an account or log in to save and manage your travel itineraries.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-gold/20"
          >
            Login / Sign Up
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <div className="bg-dark-3 border-b border-dark-border pt-20 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-gold text-xs font-bold tracking-widest uppercase mb-2">My Library</p>
            <h1 className="text-3xl font-black text-white">Saved Trips</h1>
            <p className="text-zinc-500 text-sm mt-1">Your personal travel itinerary collection</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchPlans}
              className="p-2.5 rounded-xl bg-dark-5 border border-dark-border hover:border-zinc-600 text-zinc-500 hover:text-white transition-all"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              to="/planner"
              className="flex items-center gap-2 px-4 py-2.5 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl transition-all hover:scale-105 text-sm shadow-lg shadow-gold/20"
            >
              <Plus className="w-4 h-4" /> New Trip
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading && <LoadingSpinner message="Loading your trips..." />}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {!loading && !error && plans.length === 0 && (
          <div className="text-center py-24">
            <div className="text-5xl mb-4">🗺️</div>
            <h3 className="text-xl font-bold text-zinc-300 mb-2">No saved trips yet</h3>
            <p className="text-zinc-600 mb-8 text-sm">Start planning your next adventure!</p>
            <Link
              to="/planner"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-dark text-dark font-bold rounded-xl transition-all hover:scale-105 shadow-lg shadow-gold/20"
            >
              <MapPin className="w-4 h-4" /> Plan a Trip
            </Link>
          </div>
        )}

        {!loading && plans.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div
                key={plan._id}
                className="group bg-dark-3 rounded-2xl border border-dark-border hover:border-gold/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-black/50 transition-all duration-300 overflow-hidden"
              >
                <div className="h-0.5 bg-gradient-to-r from-gold-dark via-gold to-gold-light" />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-black text-white text-lg">{plan.destination}</h3>
                      <p className="text-zinc-500 text-xs capitalize mt-0.5">{plan.budget} budget</p>
                    </div>
                    <button
                      onClick={() => handleDelete(plan._id)}
                      disabled={deleting === plan._id}
                      className="p-2 rounded-lg text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <Calendar className="w-3.5 h-3.5 text-gold/60" />
                      <span>{plan.days} {plan.days === 1 ? 'day' : 'days'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-sm">
                      <DollarSign className="w-3.5 h-3.5 text-green-400/60" />
                      <span>{plan.itinerary?.totalCost || 'N/A'}</span>
                    </div>
                  </div>

                  {plan.interests && plan.interests.trim() && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {plan.interests.split(',').slice(0, 3).map((interest) => (
                        <span
                          key={interest.trim()}
                          className="px-2 py-0.5 bg-gold/10 border border-gold/20 text-gold text-xs font-medium rounded-full capitalize"
                        >
                          {interest.trim()}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="pt-3 border-t border-dark-border">
                    <span className="text-zinc-600 text-xs">
                      {new Date(plan.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedTripsPage;
