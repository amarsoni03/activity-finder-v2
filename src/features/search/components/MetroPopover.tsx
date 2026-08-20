import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, ChevronDown, Check, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { METRO_LINES, METRO_STATIONS } from '../../metro/data/metroData';

interface MetroPopoverProps {
  type: 'line' | 'station' | 'combined';
  selectedLineId: string;
  selectedStationIds: string[];
  onSelectLine: (lineId: string) => void;
  onSelectStation: (stationId: string | string[]) => void;
  onCommit?: (lineId: string, stationIds: string[]) => void;
  onClearStations?: () => void;
  label?: string;
  isMobileModal?: boolean;
  onCloseMobileModal?: () => void;
}

export const MetroPopover: React.FC<MetroPopoverProps> = ({
  type,
  selectedLineId,
  selectedStationIds,
  onSelectLine,
  onSelectStation,
  onCommit,
  onClearStations,
  label,
  isMobileModal = false,
  onCloseMobileModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'line' | 'station'>(
    selectedLineId && selectedLineId !== 'all' ? 'station' : 'line'
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Draft/In-progress state for uncommitted selection
  const [draftLineId, setDraftLineId] = useState<string>(selectedLineId || 'all');
  const [draftStationIds, setDraftStationIds] = useState<string[]>(selectedStationIds || []);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const wasOpenRef = useRef(false);

  // Sync draft state only when popover/modal transitions from closed to open
  useEffect(() => {
    const isCurrentlyOpen = isOpen || isMobileModal;
    if (isCurrentlyOpen && !wasOpenRef.current) {
      setDraftLineId(selectedLineId || 'all');
      setDraftStationIds(selectedStationIds || []);
      if (selectedLineId && selectedLineId !== 'all') {
        setActiveTab('station');
      } else {
        setActiveTab('line');
      }
    }
    wasOpenRef.current = isCurrentlyOpen;
  }, [isOpen, isMobileModal, selectedLineId, selectedStationIds]);

  // Click outside to close (desktop) without committing draft
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if ((isOpen || isMobileModal) && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, activeTab, isMobileModal]);

  // Draft calculation helpers
  const draftLineObj = useMemo(() => {
    return METRO_LINES.find((l) => l.id === draftLineId) || null;
  }, [draftLineId]);

  const availableStations = useMemo(() => {
    let stations = METRO_STATIONS;
    if (draftLineId && draftLineId !== 'all') {
      stations = stations.filter((s) => s.lineId === draftLineId);
    }
    const query = searchQuery.trim().toLowerCase();
    if (!query) return stations;
    return stations.filter(
      (s) =>
        s.name.toLowerCase().includes(query) ||
        s.lineName.toLowerCase().includes(query)
    );
  }, [draftLineId, searchQuery]);

  const availableLines = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return METRO_LINES;
    return METRO_LINES.filter((l) => l.name.toLowerCase().includes(query));
  }, [searchQuery]);

  const draftStationSummary = useMemo(() => {
    if (draftStationIds.length === 0) {
      if (draftLineId === 'all') return 'All Metro Lines';
      return draftLineObj
        ? `All stations on ${draftLineObj.name.split(':')[1]?.trim() || draftLineObj.name}`
        : 'All stations on line';
    }
    if (draftStationIds.length === 1) {
      const st = METRO_STATIONS.find((s) => s.id === draftStationIds[0]);
      return st ? st.name : '1 Station';
    }
    return `${draftStationIds.length} Stations selected`;
  }, [draftStationIds, draftLineId, draftLineObj]);

  // Committed Display Info for HeroSearch trigger button
  const currentCommittedLine = useMemo(() => {
    return METRO_LINES.find((l) => l.id === selectedLineId) || null;
  }, [selectedLineId]);

  const currentCommittedLineShortName = useMemo(() => {
    if (!currentCommittedLine) return '';
    const name = currentCommittedLine.name;
    return name.includes(':') ? name.split(':')[1].trim() : name;
  }, [currentCommittedLine]);

  const selectedStationName = useMemo(() => {
    if (selectedStationIds.length === 0) return '';
    if (selectedStationIds.length === 1) {
      const st = METRO_STATIONS.find((s) => s.id === selectedStationIds[0]);
      return st ? st.name : '1 Station';
    }
    return `${selectedStationIds.length} Stations`;
  }, [selectedStationIds]);

  const hasLine = selectedLineId && selectedLineId !== 'all';
  const hasStation = selectedStationIds.length > 0;

  const metroDisplayInfo = useMemo(() => {
    if (!hasLine && !hasStation) {
      return {
        text: 'Metro Line → Station',
        hasColorDot: false,
        color: '#A2FF00',
        isDefault: true,
      };
    }
    if (hasLine && !hasStation) {
      return {
        text: `${currentCommittedLineShortName} · All Stations`,
        hasColorDot: true,
        color: currentCommittedLine?.color || '#EF4444',
        isDefault: false,
      };
    }
    return {
      text: `${currentCommittedLineShortName ? currentCommittedLineShortName + ' · ' : ''}${selectedStationName}`,
      hasColorDot: true,
      color: currentCommittedLine?.color || '#EF4444',
      isDefault: false,
    };
  }, [hasLine, hasStation, currentCommittedLineShortName, selectedStationName, currentCommittedLine]);

  const defaultLabel =
    type === 'line' ? 'Metro Line' : type === 'station' ? 'Metro Station' : 'Metro Line → Station';
  const displayLabel = label || defaultLabel;

  const commitSelection = (lineId: string, stationIds: string[]) => {
    if (onCommit) {
      onCommit(lineId, stationIds);
    } else {
      onSelectLine(lineId);
      onSelectStation(stationIds);
    }
  };

  // Handle Commit & Close
  const handleDone = () => {
    commitSelection(draftLineId, draftStationIds);
    setIsOpen(false);
    if (onCloseMobileModal) {
      onCloseMobileModal();
    }
  };

  const handleClearAllCommitted = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onClearStations) onClearStations();
    onSelectLine('all');
    onSelectStation([]);
    setDraftLineId('all');
    setDraftStationIds([]);
  };

  const handleSelectLineDraft = (lineId: string) => {
    setDraftLineId(lineId);
    setDraftStationIds([]);
    setSearchQuery('');
    if (type === 'combined' && lineId !== 'all') {
      setActiveTab('station');
    }
    if (!isMobileModal) {
      commitSelection(lineId, []);
      if (lineId === 'all') {
        setIsOpen(false);
      }
    }
  };

  const handleSelectAllStationsOnLine = () => {
    setDraftStationIds([]);
    if (!isMobileModal) {
      commitSelection(draftLineId, []);
      setIsOpen(false);
    }
  };

  const handleToggleStationDraft = (stationId: string) => {
    const nextStationIds = draftStationIds.includes(stationId)
      ? draftStationIds.filter((id) => id !== stationId)
      : [stationId];

    setDraftStationIds(nextStationIds);

    if (!isMobileModal) {
      commitSelection(draftLineId, nextStationIds);
      setIsOpen(false);
    }
  };

  const handleClearStationDraft = () => {
    setDraftStationIds([]);
    if (!isMobileModal) {
      commitSelection(draftLineId, []);
    }
  };

  // Render options list content helper
  const renderOptionsList = () => (
    <div className={`flex flex-col ${isMobileModal ? 'w-full flex-1 min-h-0 justify-between' : 'space-y-3'}`}>
      {/* Scrollable Upper Area (Tabs, Search, List) */}
      <div className={`flex flex-col space-y-3 ${isMobileModal ? 'flex-1 min-h-0 overflow-y-auto pr-1 pb-2' : ''}`}>
        {/* Step Tabs for Combined Mode */}
        {type === 'combined' && (
          <div className="flex items-center p-1 rounded-2xl border border-slate-800 bg-slate-950 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('line')}
              className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'line'
                  ? 'bg-[#A2FF00] text-slate-950 font-black shadow-xs border border-[#8ee600]/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>1. Select Line</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('station')}
              className={`flex-1 py-2 text-xs sm:text-sm font-extrabold rounded-xl transition-all cursor-pointer flex items-center justify-center space-x-1.5 ${
                activeTab === 'station'
                  ? 'bg-[#A2FF00] text-slate-950 font-black shadow-xs border border-[#8ee600]/50'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>2. Station</span>
              {draftStationIds.length > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[11px] font-black bg-slate-950 text-[#A2FF00] shadow-xs">
                  {draftStationIds.length}
                </span>
              )}
            </button>
          </div>
        )}

        {/* Search Input Box */}
        <div className="relative shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={activeTab === 'line' ? 'Search metro line...' : 'Search station...'}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#A2FF00]/40 focus:border-[#A2FF00] bg-slate-950 border border-slate-700 text-white placeholder-slate-400 transition-colors"
          />
        </div>

        {/* Options Items List */}
        <div className={`space-y-2 ${isMobileModal ? '' : 'overflow-y-auto max-h-[380px] sm:max-h-[440px] pr-1 scrollbar-thin scrollbar-thumb-slate-700'}`}>
          {activeTab === 'line' ? (
            <>
              <button
                type="button"
                onClick={() => handleSelectLineDraft('all')}
                className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[46px] ${
                  draftLineId === 'all'
                    ? 'bg-[#A2FF00]/20 border-[#A2FF00]/40 text-white font-bold shadow-xs'
                    : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-400 shrink-0 border border-slate-900/20 shadow-2xs" />
                  <span className={`truncate ${draftLineId === 'all' ? 'text-white font-black' : 'text-slate-200 font-bold'}`}>
                    All Metro Lines
                  </span>
                </div>
                {draftLineId === 'all' && <Check className="w-4.5 h-4.5 shrink-0 ml-2 text-[#A2FF00] stroke-[3]" />}
              </button>

              {availableLines.map((line) => {
                const isSelected = draftLineId === line.id;
                return (
                  <button
                    key={line.id}
                    type="button"
                    onClick={() => handleSelectLineDraft(line.id)}
                    className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[46px] ${
                      isSelected
                        ? 'bg-[#A2FF00]/20 border-[#A2FF00]/40 text-white font-bold shadow-xs'
                        : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900/20 shadow-2xs"
                        style={{ backgroundColor: line.color }}
                      />
                      <span className={`truncate ${isSelected ? 'text-white font-black' : 'text-slate-200 font-bold'}`}>
                        {line.name}
                      </span>
                    </div>
                    {isSelected && <Check className="w-4.5 h-4.5 shrink-0 ml-2 text-[#A2FF00] stroke-[3]" />}
                  </button>
                );
              })}
            </>
          ) : (
            <>
              <div className="flex items-center justify-between px-2 py-1 text-xs font-extrabold uppercase tracking-wider text-slate-400 shrink-0">
                <span className="truncate">
                  {draftLineObj
                    ? `Stations on ${draftLineObj.name.split(':')[1]?.trim() || draftLineObj.name}`
                    : 'Select Stations'}
                </span>
                {draftStationIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleClearStationDraft}
                    className="hover:underline cursor-pointer lowercase shrink-0 ml-2 text-xs font-extrabold text-[#A2FF00] bg-[#A2FF00]/10 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    clear ({draftStationIds.length})
                  </button>
                )}
              </div>

              {/* "All stations on line" Option at the top of station list */}
              {draftLineId && draftLineId !== 'all' && (
                <button
                  type="button"
                  onClick={handleSelectAllStationsOnLine}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[46px] ${
                    draftStationIds.length === 0
                      ? 'bg-[#A2FF00]/20 border-[#A2FF00]/40 text-white font-bold shadow-xs'
                      : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3 min-w-0">
                    <div
                      className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900/20 shadow-2xs"
                      style={{ backgroundColor: draftLineObj ? draftLineObj.color : '#94A3B8' }}
                    />
                    <span className={`truncate ${draftStationIds.length === 0 ? 'text-white font-black' : 'text-slate-200 font-bold'}`}>
                      {draftLineObj
                        ? `All stations on ${draftLineObj.name.split(':')[1]?.trim() || draftLineObj.name}`
                        : 'All stations on line'}
                    </span>
                  </div>
                  {draftStationIds.length === 0 && <Check className="w-4.5 h-4.5 shrink-0 ml-2 text-[#A2FF00] stroke-[3]" />}
                </button>
              )}

              {availableStations.length > 0 ? (
                availableStations.map((station) => {
                  const isSelected = draftStationIds.includes(station.id);
                  const parentLine = METRO_LINES.find((l) => l.id === station.lineId);

                  return (
                    <button
                      key={station.id}
                      type="button"
                      onClick={() => handleToggleStationDraft(station.id)}
                      className={`w-full text-left px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all cursor-pointer border min-h-[46px] ${
                        isSelected
                          ? 'bg-[#A2FF00]/20 border-[#A2FF00]/40 text-white font-bold shadow-xs'
                          : 'bg-slate-900/90 border-slate-700/80 text-slate-100 hover:bg-slate-800 hover:border-slate-600 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <div
                          className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900/20 shadow-2xs"
                          style={{ backgroundColor: parentLine ? parentLine.color : '#94A3B8' }}
                        />
                        <span className={`truncate ${isSelected ? 'text-white font-black' : 'text-slate-200 font-bold'}`}>
                          {station.name}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4.5 h-4.5 shrink-0 ml-2 text-[#A2FF00] stroke-[3]" />}
                    </button>
                  );
                })
              ) : (
                <div className="p-6 text-center text-sm font-medium text-slate-400">
                  No matching stations found
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Sticky Footer with Clear Done Action - Mobile Only */}
      {isMobileModal && (
        <div className="pt-3 border-t border-slate-800 shrink-0 flex flex-col space-y-2.5 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] bg-slate-900 z-20">
          <div className="flex items-center justify-between text-xs sm:text-sm text-slate-300 min-w-0 px-1">
            <span className="font-bold text-slate-400">Selected:</span>
            <span className="font-extrabold text-white truncate max-w-[240px]">
              {draftStationSummary}
            </span>
          </div>

          <button
            type="button"
            onClick={handleDone}
            className="w-full h-12 rounded-xl bg-[#A2FF00] hover:bg-[#8ee600] text-slate-950 text-base font-black tracking-wide shadow-md active:scale-[0.98] transition-all flex items-center justify-center shrink-0 border border-[#85db00] cursor-pointer"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );

  // When rendered inside a mobile bottom sheet modal, render inline directly
  if (isMobileModal) {
    return renderOptionsList();
  }

  // DESKTOP POPOVER MODE
  return (
    <div ref={containerRef} className="relative w-full">
      <label className="text-[11px] font-bold tracking-wider uppercase text-slate-300 block mb-1">
        {displayLabel}
      </label>

      {/* Button trigger */}
      <button
        type="button"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-slate-950/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-left flex items-center justify-between transition-all cursor-pointer shadow-xs group min-h-[44px]"
      >
        <div className="flex items-center space-x-2.5 min-w-0">
          {metroDisplayInfo.hasColorDot ? (
            <div
              className="w-3.5 h-3.5 rounded-full shrink-0 border border-slate-900/20 shadow-xs"
              style={{ backgroundColor: metroDisplayInfo.color }}
            />
          ) : (
            <MapPin className="w-4 h-4 text-[#A2FF00] shrink-0" />
          )}
          <span className="text-sm font-bold text-white truncate">
            {metroDisplayInfo.text}
          </span>
        </div>

        {!metroDisplayInfo.isDefault ? (
          <span
            onClick={handleClearAllCommitted}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700 rounded-full transition-colors shrink-0 ml-1"
            title="Clear Metro Filter"
          >
            <span className="text-sm font-extrabold text-slate-400 hover:text-white">×</span>
          </span>
        ) : (
          <ChevronDown
            className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-white' : 'group-hover:text-slate-200'
            }`}
          />
        )}
      </button>

      {/* Desktop Popover Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -2 }}
            transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
            className="absolute left-0 top-full mt-1.5 w-full sm:w-[420px] max-w-[calc(100vw-32px)] max-h-[min(520px,calc(100vh-220px))] bg-slate-900 rounded-2xl shadow-2xl border border-slate-700/90 z-[100] p-3.5 overflow-hidden text-white flex flex-col"
          >
            {renderOptionsList()}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
