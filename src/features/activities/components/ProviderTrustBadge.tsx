import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Award,
  Crown,
  GraduationCap,
  Calendar,
  Info,
  X,
  FileCheck2
} from 'lucide-react';
import { ProviderTrustInfo } from '../types';

export interface ProviderTrustBadgeProps {
  trust?: ProviderTrustInfo;
  variant?: 'micro' | 'inline' | 'detailed';
  showModalTrigger?: boolean;
  className?: string;
}

export const DEFAULT_TRUST: ProviderTrustInfo = {
  isVerified: true,
  isPremium: true,
  isTopRated: true,
  isCertified: true,
  isBackgroundChecked: true,
  yearsActive: 6,
  verificationDate: 'Verified Jan 2026',
  licenseNumber: 'LIC-8921-MOS'
};

export const ProviderTrustBadge: React.FC<ProviderTrustBadgeProps> = ({
  trust = DEFAULT_TRUST,
  variant = 'micro',
  showModalTrigger = false,
  className = '',
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const activeTrust = {
    ...DEFAULT_TRUST,
    ...trust,
  };

  // Badges list
  const badges = [
    {
      key: 'verified',
      active: activeTrust.isVerified,
      label: 'Verified',
      icon: CheckCircle2,
      color: 'text-emerald-700 bg-emerald-50 border-emerald-200/80',
      iconColor: 'text-emerald-600',
      description: 'Business identity & facility location independently verified.'
    },
    {
      key: 'premium',
      active: activeTrust.isPremium,
      label: 'Premium',
      icon: Crown,
      color: 'text-amber-800 bg-amber-50 border-amber-200/80',
      iconColor: 'text-amber-600',
      description: 'Partner studio meeting elevated quality & amenity standards.'
    },
    {
      key: 'topRated',
      active: activeTrust.isTopRated,
      label: 'Top Rated',
      icon: Award,
      color: 'text-purple-800 bg-purple-50 border-purple-200/80',
      iconColor: 'text-purple-600',
      description: 'Consistently maintains 4.8+ rating with 20+ verified reviews.'
    },
    {
      key: 'certified',
      active: activeTrust.isCertified,
      label: 'Certified',
      icon: GraduationCap,
      color: 'text-blue-800 bg-blue-50 border-blue-200/80',
      iconColor: 'text-blue-600',
      description: 'Degree credentials & professional diplomas validated.'
    },
    {
      key: 'bgChecked',
      active: activeTrust.isBackgroundChecked,
      label: 'Background Checked',
      icon: ShieldCheck,
      color: 'text-teal-800 bg-teal-50 border-teal-200/80',
      iconColor: 'text-teal-600',
      description: 'Safety check & clean criminal record clearance confirmed.'
    },
    {
      key: 'yearsActive',
      active: Boolean(activeTrust.yearsActive && activeTrust.yearsActive > 0),
      label: `${activeTrust.yearsActive || 5}+ Yrs Active`,
      icon: Calendar,
      color: 'text-slate-700 bg-slate-100 border-slate-200',
      iconColor: 'text-slate-600',
      description: `Active operating history of ${activeTrust.yearsActive || 5}+ years on platform.`
    }
  ].filter(b => b.active);

  // Micro variant for ActivityCard (subtle, non-dominant)
  if (variant === 'micro') {
    return (
      <div className={`relative inline-flex items-center ${className}`}>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setShowTooltip(!showTooltip);
          }}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="inline-flex items-center space-x-1 px-2.5 py-1 min-h-[24px] rounded-full text-[10px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/70 transition-colors cursor-pointer"
          title="Click to view provider trust credentials"
          aria-label="Provider trust credentials: Verified"
        >
          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
          <span>Verified</span>
        </button>

        {/* Hover Popover */}
        {showTooltip && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-slate-900 text-white rounded-2xl shadow-xl z-50 text-xs space-y-2 border border-slate-800 animate-in fade-in zoom-in-95 duration-150 pointer-events-auto"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
              <span className="font-extrabold text-[11px] text-emerald-400 flex items-center space-x-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Provider Trust Credentials</span>
              </span>
              {activeTrust.licenseNumber && (
                <span className="text-[9px] text-slate-400">{activeTrust.licenseNumber}</span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              {badges.map((b) => {
                const IconComp = b.icon;
                return (
                  <div key={b.key} className="flex items-center space-x-1 text-slate-200">
                    <IconComp className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span className="truncate font-medium">{b.label}</span>
                  </div>
                );
              })}
            </div>

            <div className="pt-1 text-[9px] text-slate-400 border-t border-slate-800/80 flex items-center justify-between">
              <span>{activeTrust.verificationDate || 'Verified 2026'}</span>
              <span className="text-emerald-400 font-semibold">100% Platform Guarantee</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Inline variant for instructor headers
  if (variant === 'inline') {
    return (
      <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
        {badges.slice(0, 4).map((b) => {
          const IconComp = b.icon;
          return (
            <span
              key={b.key}
              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${b.color}`}
            >
              <IconComp className={`w-3 h-3 ${b.iconColor}`} />
              <span>{b.label}</span>
            </span>
          );
        })}
      </div>
    );
  }

  // Detailed variant for Activity Detail Page
  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Provider Verification & Trust Badges</span>
        </h4>

        {showModalTrigger && (
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className="text-[11px] font-semibold text-emerald-700 hover:text-emerald-800 flex items-center space-x-1 hover:underline cursor-pointer"
          >
            <Info className="w-3.5 h-3.5" />
            <span>Verification Standards</span>
          </button>
        )}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        {badges.map((b) => {
          const IconComp = b.icon;
          return (
            <div
              key={b.key}
              className={`p-3 rounded-2xl border ${b.color} space-y-1 transition-all hover:shadow-xs`}
            >
              <div className="flex items-center space-x-1.5 font-bold text-xs">
                <IconComp className={`w-4 h-4 ${b.iconColor} shrink-0`} />
                <span>{b.label}</span>
              </div>
              <p className="text-[10px] opacity-80 leading-snug line-clamp-2">
                {b.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
        <div className="flex items-center space-x-2">
          <FileCheck2 className="w-4 h-4 text-emerald-600" />
          <span>License / Registration: <strong className="text-slate-800 font-mono">{activeTrust.licenseNumber || 'LIC-8921-MOS'}</strong></span>
        </div>
        <span className="text-slate-400 font-medium">{activeTrust.verificationDate || 'Verified Jan 2026'}</span>
      </div>

      {/* Explanatory Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2 text-slate-900 font-black text-base">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <span>Platform Trust & Safety Standards</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Activity Finder rigorously verifies instructors and partner studios to ensure safe, high-quality, authentic learning environments.
            </p>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {[
                {
                  title: '1. Verified Identity & Venue',
                  desc: 'State identification, tax status, and physical metro studio address are verified in person or via official registry.',
                  icon: CheckCircle2,
                  color: 'text-emerald-600'
                },
                {
                  title: '2. Premium Partner Status',
                  desc: 'Awarded to top studios that maintain high safety scores, pristine equipment, and high student satisfaction.',
                  icon: Crown,
                  color: 'text-amber-600'
                },
                {
                  title: '3. Top Rated Provider',
                  desc: 'Requires an average rating of 4.8 or higher with a minimum of 20 verified student bookings.',
                  icon: Award,
                  color: 'text-purple-600'
                },
                {
                  title: '4. Certified Qualifications',
                  desc: 'University degrees, teaching certifications, and sports coaching credentials undergo manual verification.',
                  icon: GraduationCap,
                  color: 'text-blue-600'
                },
                {
                  title: '5. Background Checked',
                  desc: 'Instructors teaching minors or open adult cohorts pass comprehensive criminal background checks.',
                  icon: ShieldCheck,
                  color: 'text-teal-600'
                },
                {
                  title: '6. Years Active',
                  desc: 'Tracks continuous operating experience on platform and in the metro area.',
                  icon: Calendar,
                  color: 'text-slate-600'
                }
              ].map((item, idx) => {
                const ItemIcon = item.icon;
                return (
                  <div key={idx} className="flex items-start space-x-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                    <ItemIcon className={`w-4 h-4 ${item.color} mt-0.5 shrink-0`} />
                    <div>
                      <div className="font-bold text-slate-900">{item.title}</div>
                      <div className="text-slate-500 text-[11px] leading-relaxed">{item.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2.5 bg-slate-900 text-white font-bold text-xs rounded-xl hover:bg-slate-800 transition-colors"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
