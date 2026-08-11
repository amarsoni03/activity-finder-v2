import React from 'react';

interface HomeLayoutProps {
  children: React.ReactNode;
}

export const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50/60 text-slate-900 font-sans antialiased selection:bg-[#074213]/20 selection:text-[#074213]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-12">
        {children}
      </div>
    </div>
  );
};
