import React, { useState } from 'react';
import { Sparkles, X, ArrowRight, Loader2, CheckCircle, Zap, MapPin, Calendar, Compass } from 'lucide-react';
import { Activity, AiMatchResult } from '../types';
import { findAiMatches } from '../services/aiService';

interface AiConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
  activities: Activity[];
  onSelectActivity: (act: Activity) => void;
}

export const AiConciergeModal: React.FC<AiConciergeModalProps> = ({
  isOpen,
  onClose,
  activities,
  onSelectActivity,
}) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{ activity: Activity; match: AiMatchResult }[] | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    'Tuesday evening Russian language or Music near Arbatskaya under 2,500 ₽',
    'Moscow City rooftop yoga or workout on Monday or Wednesday',
    'Weekend morning ceramics or oil painting near Tretyakov or Gorky Park',
    'Bolshoi Classical Ballet or Contemporary dance near Teatralnaya',
  ];

  const handleSearch = async (userQuery: string) => {
    if (!userQuery.trim()) return;
    setQuery(userQuery);
    setLoading(true);

    try {
      const matchResults = await findAiMatches(userQuery, activities);
      const combined = matchResults
        .map((m) => {
          const found = activities.find((a) => a.id === m.activityId);
          return found ? { activity: found, match: m } : null;
        })
        .filter(Boolean) as { activity: Activity; match: AiMatchResult }[];

      setResults(combined);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-800 to-green-950 text-white flex items-center justify-between relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 w-32 h-32 bg-green-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center space-x-3 z-10">
            <div className="w-10 h-10 rounded-2xl bg-green-500/20 border border-green-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-green-400 animate-pulse" />
            </div>
            <div>
              <h3 className="text-lg font-bold">AI Class Matchmaker</h3>
              <p className="text-xs text-slate-300">
                Describe your ideal schedule & interest in plain language
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-full bg-white/5 hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Query Input Section */}
        <div className="p-6 space-y-4 border-b border-slate-100 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSearch(query);
            }}
            className="flex items-center space-x-2"
          >
            <div className="relative flex-1">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask e.g. 'Looking for a weekday evening dance class near Red Line...'"
                className="w-full pl-4 pr-10 py-3 text-xs sm:text-sm bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-400/50 shadow-xs text-slate-800 placeholder-slate-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-5 py-3 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-2xl transition-all shadow-sm flex items-center space-x-2 shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <span>Match</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Prompts */}
          <div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mb-2 block">
              Try asking:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {samplePrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSearch(prompt)}
                  className="text-left px-3 py-1.5 bg-white border border-slate-200/80 hover:border-green-300 hover:bg-green-50/50 rounded-xl text-xs text-slate-700 transition-all font-medium"
                >
                  ✨ {prompt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results Body */}
        <div className="p-6 flex-1 overflow-y-auto max-h-[50vh] space-y-4">
          {loading ? (
            <div className="py-12 text-center space-y-3">
              <Loader2 className="w-8 h-8 text-green-500 animate-spin mx-auto" />
              <p className="text-xs font-semibold text-slate-600">Analyzing activities catalog with AI...</p>
            </div>
          ) : results ? (
            results.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                No matching activities found for that specific query. Try broadening your request!
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                  <span>Top AI Recommendations</span>
                  <span className="text-green-600 font-semibold">{results.length} Matches Found</span>
                </div>

                {results.map(({ activity, match }) => (
                  <div
                    key={activity.id}
                    className="p-4 rounded-2xl border border-slate-100 hover:border-green-200 bg-white hover:shadow-md transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="px-2 py-0.5 bg-green-50 text-green-700 font-bold text-[10px] rounded-full border border-green-200 flex items-center space-x-1">
                            <Zap className="w-3 h-3" />
                            <span>{match.matchPercentage}% Match</span>
                          </span>
                          <span className="text-xs font-semibold text-slate-500">{activity.category}</span>
                        </div>
                        <h4 className="font-bold text-slate-900 text-sm hover:text-green-600 transition-colors">
                          {activity.title}
                        </h4>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        ${activity.price} <span className="text-[10px] font-normal text-slate-400">/{activity.priceUnit}</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100 italic">
                      "{match.reason}"
                    </p>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex flex-wrap gap-1 text-[10px]">
                        {match.highlights.map((h, idx) => (
                          <span
                            key={idx}
                            className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                          >
                            ✓ {h}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() => {
                          onSelectActivity(activity);
                          onClose();
                        }}
                        className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all flex items-center space-x-1 shrink-0 ml-2"
                      >
                        <span>View Class</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Compass className="w-10 h-10 mx-auto text-slate-300" />
              <p className="text-xs font-medium text-slate-500">
                Type your free days, preferred metro station, or interest above to find tailored activities.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
