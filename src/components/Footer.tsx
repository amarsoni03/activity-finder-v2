import React from 'react';
import {
  PlusCircle,
  ArrowUp,
  Clock,
  Search,
  Calendar,
  Shield,
  FileText,
  HelpCircle,
} from 'lucide-react';

interface FooterProps {
  activityCount: number;
  onGoHome: () => void;
  onNavTabChange: (tab: 'my-week' | 'explore' | 'free-time') => void;
  onOpenCreate: () => void;
  onOpenFreeTimePlanner: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 sm:mb-3">
      {children}
    </p>
  );
}

function FooterLink({
  icon: Icon,
  iconClass,
  children,
  onClick,
}: {
  icon: React.ElementType;
  iconClass?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={onClick}
        className="flex w-full items-center gap-2 py-2 sm:py-1.5 min-h-[40px] sm:min-h-0 text-xs sm:text-sm text-slate-300 hover:text-white transition-colors text-left"
      >
        <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${iconClass ?? 'text-slate-500'}`} />
        <span className="leading-tight">{children}</span>
      </button>
    </li>
  );
}

export const Footer: React.FC<FooterProps> = ({
  activityCount,
  onGoHome,
  onNavTabChange,
  onOpenCreate,
  onOpenFreeTimePlanner,
}) => {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const go = (fn: () => void) => {
    fn();
    scrollToTop();
  };

  const platformLinks = (
    <ul className="space-y-0.5 sm:space-y-1">
      <FooterLink icon={Search} onClick={() => go(() => onNavTabChange('explore'))}>
        Explore
      </FooterLink>
      <FooterLink icon={Calendar} onClick={() => go(() => onNavTabChange('my-week'))}>
        My Week
      </FooterLink>
      <FooterLink icon={Clock} iconClass="text-amber-400" onClick={() => go(onOpenFreeTimePlanner)}>
        Free Time
      </FooterLink>
    </ul>
  );

  const supportLinks = (
    <ul className="space-y-0.5 sm:space-y-1">
      <FooterLink icon={HelpCircle}>Help</FooterLink>
      <FooterLink icon={Shield}>Privacy</FooterLink>
      <FooterLink icon={FileText}>Terms</FooterLink>
    </ul>
  );

  const providerBlock = (
    <>
      <p className="text-xs sm:text-sm text-slate-400 leading-snug mb-3 hidden sm:block">
        List your class near a metro stop.
      </p>
      <button
        type="button"
        onClick={onOpenCreate}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] bg-[#A2FF00] hover:bg-[#91E600] text-[#074213] text-xs font-bold rounded-xl transition-colors"
      >
        <PlusCircle className="w-4 h-4 shrink-0" />
        List Your Activity
      </button>
    </>
  );

  return (
    <footer className="mt-auto shrink-0 w-full">
      <div className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-11">
          {/* ── Mobile & tablet: stacked compact layout ── */}
          <div className="lg:hidden">
            <button
              type="button"
              onClick={() => go(onGoHome)}
              className="inline-flex items-center gap-2 group mb-2"
              aria-label="Go to homepage"
            >
              <div className="w-8 h-8 bg-[#A2FF00] text-[#074213] rounded-lg flex items-center justify-center font-black text-base shrink-0">
                M
              </div>
              <span className="text-sm font-bold tracking-tight">
                ActivityFirst <span className="text-[#A2FF00]">Moscow</span>
              </span>
            </button>
            <p className="text-[10px] font-semibold text-slate-500 mb-4">
              {activityCount.toLocaleString()} activities · Course First. Studio Second.
            </p>

            <div className="grid grid-cols-2 gap-x-4 gap-y-5 pb-5 border-b border-white/10">
              <div>
                <SectionTitle>Platform</SectionTitle>
                {platformLinks}
              </div>
              <div>
                <SectionTitle>Support</SectionTitle>
                {supportLinks}
              </div>
            </div>

            <div className="pt-5">
              <SectionTitle>For Providers</SectionTitle>
              {providerBlock}
            </div>
          </div>

          {/* ── Desktop: 4-column row ── */}
          <div className="hidden lg:grid lg:grid-cols-4 gap-8">
            <div>
              <button
                type="button"
                onClick={() => go(onGoHome)}
                className="inline-flex items-center gap-2.5 group mb-3"
                aria-label="Go to homepage"
              >
                <div className="w-9 h-9 bg-[#A2FF00] text-[#074213] rounded-xl flex items-center justify-center font-black text-lg group-hover:scale-105 transition-transform shrink-0">
                  M
                </div>
                <span className="text-base font-bold tracking-tight">
                  ActivityFirst <span className="text-[#A2FF00]">Moscow</span>
                </span>
              </button>
              <p className="text-sm text-slate-400 leading-relaxed mb-2">
                Activities matched to your free time & metro.
              </p>
              <p className="text-xs font-semibold text-slate-500">
                {activityCount.toLocaleString()} activities
              </p>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600 mt-1">
                Course First. Studio Second.
              </p>
            </div>

            <div>
              <SectionTitle>Platform</SectionTitle>
              {platformLinks}
            </div>

            <div>
              <SectionTitle>Support</SectionTitle>
              {supportLinks}
            </div>

            <div>
              <SectionTitle>For Providers</SectionTitle>
              {providerBlock}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-slate-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-3">
          <p className="text-[10px] sm:text-xs text-slate-500 leading-tight min-w-0 truncate">
            <span className="sm:hidden">© {new Date().getFullYear()} ActivityFirst Moscow</span>
            <span className="hidden sm:inline">
              © {new Date().getFullYear()} ActivityFirst Moscow. All rights reserved.
            </span>
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1 px-2.5 py-1 min-h-[32px] text-[10px] sm:text-xs font-semibold text-slate-300 hover:text-white border border-white/10 rounded-full hover:bg-white/5 transition-colors shrink-0"
            aria-label="Back to top"
          >
            <ArrowUp className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            Top
          </button>
        </div>
      </div>
    </footer>
  );
};
