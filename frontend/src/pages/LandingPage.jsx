import React from 'react';
import { Camera } from 'lucide-react';
import { useBinWise } from '../context/BinWiseContext';

export default function LandingPage({ onNavigate }) {
  const { stats, ecoPoints } = useBinWise();

  const navGrid = [
    { key: 'F1 INDEX', sub: 'SYSTEM OVERVIEW', id: 'landing' },
    { key: 'F2 SCAN', sub: 'VISION CLASSIFIER', id: 'scanner' },
    { key: 'F3 CONTROL', sub: 'TELEMETRY DECK', id: 'dashboard' },
    { key: 'F4 ARCHIVE', sub: '22 WASTE SPECS', id: 'library' },
    { key: 'F5 LOGS', sub: 'SCAN HISTORY', id: 'history' },
    { key: 'F6 CREDITS', sub: 'ECO_PTS LEDGER', id: 'points' },
  ];

  const streamRows = [
    { code: 'WET-01', name: 'ORGANIC / PEELS', bin: 'GREEN', count: stats.wet },
    { code: 'DRY-02', name: 'PAPER / PET / GLASS', bin: 'BLUE', count: stats.dry },
    { code: 'HAZ-03', name: 'BATTERIES / CHEM', bin: 'SPECIAL', count: stats.hazardous },
    { code: 'REV-00', name: 'MANUAL REVIEW', bin: 'HOLD', count: stats.uncertain },
  ];

  return (
    <div className="bg-[#050505] text-[#FFB000] min-h-[calc(100vh-6rem)] bg-tech-grid">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-4 space-y-3">
        {/* Top Multi-Panel Grid */}
        <div className="grid lg:grid-cols-12 border border-[#262626]">
          {/* Panel 01: Command */}
          <div className="lg:col-span-6 p-5 border-b lg:border-b-0 lg:border-r border-[#262626] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-[11px] text-[#38BDF8] mb-3">
                <span>01 // COMMAND_BINWISE</span>
                <span className="text-[#737373]">SESSION: LIVE // ZERO_NOISE</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-bold tracking-tight leading-[1.02] text-[#FFB000] crt-glow uppercase">
                WASTE IS NOT THE END. IT&apos;S DATA.
              </h1>

              <p className="mt-4 text-xs sm:text-sm text-[#FFB000]/80 leading-relaxed max-w-lg">
                A hostile-free, high-precision waste data plane: every pixel, border, and amber
                readout is built to classify household waste before it contaminates the bin.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('scanner')}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#22C55E] text-[#050505] text-xs font-bold tracking-wider uppercase hover:opacity-90 cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                READY &gt; SCAN YOUR WASTE
              </button>
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-4 py-2.5 border border-[#FFB000]/50 text-[#FFB000] text-xs font-bold tracking-wider uppercase hover:bg-[#FFB000] hover:text-[#050505] transition-colors cursor-pointer"
              >
                OPEN CONTROL ROOM
              </button>
            </div>
          </div>

          {/* Panel 02: Live Telemetry Stack */}
          <div className="lg:col-span-2 border-b lg:border-b-0 lg:border-r border-[#262626] divide-y divide-[#262626]">
            <div className="p-4">
              <p className="text-[10px] text-[#737373]">TOTAL_SCANS</p>
              <p className="text-2xl font-bold mt-1">{String(stats.total).padStart(2, '0')}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-[#737373]">ECO_CREDITS</p>
              <p className="text-2xl font-bold mt-1 text-[#22C55E]">{ecoPoints}</p>
            </div>
            <div className="p-4">
              <p className="text-[10px] text-[#737373]">MODE</p>
              <p className="text-2xl font-bold mt-1">CRT</p>
            </div>
          </div>

          {/* Panel 03: Stream Ticker */}
          <div className="lg:col-span-4 p-4">
            <div className="flex items-center justify-between text-[11px] text-[#38BDF8] mb-3">
              <span>02 // STREAM_MATRIX</span>
              <span className="text-[#737373]">IND_HOUSEHOLD</span>
            </div>
            <div className="divide-y divide-[#262626] border-t border-[#262626]">
              {streamRows.map((row) => (
                <div key={row.code} className="py-2.5 flex items-center justify-between text-xs">
                  <span className="font-bold text-[#FFB000]">{row.code}</span>
                  <span className="text-[#737373]">{row.name}</span>
                  <span className="text-[#38BDF8]">{row.bin}</span>
                  <span className="font-bold">{String(row.count).padStart(2, '0')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Panel: Function Navigation + System Note */}
        <div className="grid lg:grid-cols-12 border border-[#262626]">
          <div className="lg:col-span-8 p-5 border-b lg:border-b-0 lg:border-r border-[#262626]">
            <div className="flex items-center justify-between text-[11px] text-[#38BDF8] mb-4">
              <span>03 // FUNCTION_NAVIGATION</span>
              <span className="text-[#737373]">KEYBOARD-FIRST DATA DENSITY (F1–F6)</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {navGrid.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className="p-3 border border-[#262626] hover:border-[#FFB000] text-left transition-colors cursor-pointer"
                >
                  <p className="text-xs font-bold text-[#FFB000]">{item.key}</p>
                  <p className="text-[10px] text-[#737373] mt-1">{item.sub}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 p-5 flex flex-col justify-between">
            <div className="text-[11px] text-[#38BDF8] mb-2">
              04 // SYSTEM_DIRECTIVE
            </div>
            <div className="border border-dashed border-[#FFB000]/40 p-3 text-[11px] text-[#FFB000]/85 leading-relaxed">
              | AMBER PHOSPHOR / BLACK GLASS / MONOSPACE EVERYWHERE
              <br />| 1PX DIVIDERS CREATE TRUST; COLOR ONLY MEANS ACTION.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
