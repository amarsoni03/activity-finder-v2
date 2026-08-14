import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  User,
  Globe,
  Bell,
  Lock,
  CreditCard,
  Calendar,
  Save,
  CheckCircle2,
  Shield,
  Smartphone,
  ExternalLink,
  ChevronRight,
  Tag
} from 'lucide-react';

export interface UserPreferencesData {
  preferredMetro: string;
  favoriteCategories: string[];
  preferredTime: string;
  audience: string;
  language: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  publicProfile: boolean;
  savedCardMask: string;
  calendarAutoSync: boolean;
}

interface ProfileSettingsSectionProps {
  initialPreferences?: UserPreferencesData;
  onSavePreferences?: (prefs: UserPreferencesData) => void;
}

const DEFAULT_PREFS: UserPreferencesData = {
  preferredMetro: 'Taganskaya',
  favoriteCategories: ['Ceramics & Art', 'Yoga & Wellness', 'Culinary & Beverage'],
  preferredTime: 'Weekday Evenings (18:00 - 21:00)',
  audience: 'Adult (Beginner Friendly)',
  language: 'English',
  emailNotifications: true,
  smsNotifications: true,
  pushNotifications: false,
  publicProfile: false,
  savedCardMask: '•••• •••• •••• 4242',
  calendarAutoSync: true
};

const METRO_OPTIONS = ['Taganskaya', 'Chistye Prudy', 'Arbatskaya', 'Mayakovskaya', 'Tverskaya', 'Kurskaya'];
const CATEGORY_OPTIONS = [
  'Ceramics & Art',
  'Yoga & Wellness',
  'Culinary & Beverage',
  'Dance & Movement',
  'Music & Audio',
  'Photography',
  'Languages & Culture'
];
const TIME_OPTIONS = [
  'Weekday Evenings (18:00 - 21:00)',
  'Weekend Mornings (09:00 - 12:00)',
  'Weekend Afternoons (12:00 - 17:00)',
  'Flexible / Any Available Spot'
];
const AUDIENCE_OPTIONS = ['Adult (Beginner Friendly)', 'Adult (Intermediate / Advanced)', 'Family & Kids', 'Couples'];
const LANGUAGE_OPTIONS = ['English', 'Russian', 'Bilingual (EN / RU)'];

export const ProfileSettingsSection: React.FC<ProfileSettingsSectionProps> = ({
  initialPreferences = DEFAULT_PREFS,
  onSavePreferences
}) => {
  const [prefs, setPrefs] = useState<UserPreferencesData>(initialPreferences);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleCategoryToggle = (cat: string) => {
    setPrefs((prev) => {
      const exists = prev.favoriteCategories.includes(cat);
      return {
        ...prev,
        favoriteCategories: exists
          ? prev.favoriteCategories.filter((c) => c !== cat)
          : [...prev.favoriteCategories, cat]
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSavePreferences) onSavePreferences(prefs);
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Save Toast Notice */}
      {isSavedNotice && (
        <div className="bg-emerald-500 text-slate-950 px-5 py-3 rounded-2xl shadow-lg flex items-center justify-between font-bold text-xs animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Profile preferences & account settings updated successfully!</span>
          </div>
        </div>
      )}

      {/* SECTION 1: PROFILE & ACTIVITY MATCHING PREFERENCES */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
              <User className="w-5 h-5 text-indigo-600 shrink-0" />
              <span>Activity & Schedule Preferences</span>
            </h3>
            <p className="text-xs text-slate-500">
              Customize these parameters to get automated activity matches near your routine.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Preferred Metro */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>Preferred Metro Line / Station</span>
            </label>
            <select
              value={prefs.preferredMetro}
              onChange={(e) => setPrefs({ ...prefs, preferredMetro: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {METRO_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m} Station
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 block">Used for calculating walk distance & recommendations.</span>
          </div>

          {/* Preferred Time Slot */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-500" />
              <span>Preferred Time Window</span>
            </label>
            <select
              value={prefs.preferredTime}
              onChange={(e) => setPrefs({ ...prefs, preferredTime: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {TIME_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-slate-400 block">Highlights matching sessions in search results.</span>
          </div>

          {/* Audience / Skill Level */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Shield className="w-3.5 h-3.5 text-indigo-500" />
              <span>Audience & Experience Level</span>
            </label>
            <select
              value={prefs.audience}
              onChange={(e) => setPrefs({ ...prefs, audience: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {AUDIENCE_OPTIONS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          {/* Preferred Language */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-500" />
              <span>Instruction Language</span>
            </label>
            <select
              value={prefs.language}
              onChange={(e) => setPrefs({ ...prefs, language: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-slate-900"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Favorite Categories Multi-Select */}
        <div className="space-y-3 pt-2">
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
            Favorite Activity Categories
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((cat) => {
              const isSelected = prefs.favoriteCategories.includes(cat);
              return (
                <button
                  type="button"
                  key={cat}
                  onClick={() => handleCategoryToggle(cat)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xs'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {isSelected ? '✓ ' : '+ '}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* SECTION 2: ACCOUNT SETTINGS & SYNC */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-6 lg:p-8 space-y-6 shadow-xs">
        <div className="border-b border-slate-100 pb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <Bell className="w-5 h-5 text-indigo-600" />
            <span>Account Settings & Integrations</span>
          </h3>
          <p className="text-xs text-slate-500">Notifications, payment defaults, calendar sync, and privacy.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Notification Preferences */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Bell className="w-3.5 h-3.5 text-indigo-500" />
              <span>Notification Preferences</span>
            </h4>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-1">
              <span>Email Booking Reminders & Pass Receipts</span>
              <input
                type="checkbox"
                checked={prefs.emailNotifications}
                onChange={(e) => setPrefs({ ...prefs, emailNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>SMS 1-Hour Class Reminders</span>
              <input
                type="checkbox"
                checked={prefs.smsNotifications}
                onChange={(e) => setPrefs({ ...prefs, smsNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>App Push Alerts for Price Drops</span>
              <input
                type="checkbox"
                checked={prefs.pushNotifications}
                onChange={(e) => setPrefs({ ...prefs, pushNotifications: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>
          </div>

          {/* Calendar Sync & Privacy */}
          <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Calendar Sync & Privacy</span>
            </h4>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-1">
              <span>Auto Sync Bookings to Google / iCal</span>
              <input
                type="checkbox"
                checked={prefs.calendarAutoSync}
                onChange={(e) => setPrefs({ ...prefs, calendarAutoSync: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>Show Activity History on Public Profile</span>
              <input
                type="checkbox"
                checked={prefs.publicProfile}
                onChange={(e) => setPrefs({ ...prefs, publicProfile: e.target.checked })}
                className="w-4 h-4 rounded text-slate-900 focus:ring-slate-900"
              />
            </label>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Payment Method Saved:</span>
              <span className="font-mono text-slate-900 font-bold bg-white px-2 py-0.5 rounded border border-slate-200">
                {prefs.savedCardMask}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="pt-2 flex justify-stretch sm:justify-end">
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow-md transition-all cursor-pointer min-h-[44px]"
          >
            <Save className="w-4 h-4" />
            <span>Save Preferences</span>
          </button>
        </div>
      </div>
    </form>
  );
};
