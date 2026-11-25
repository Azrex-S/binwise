import React from 'react';

const F_BAR = [
  { id: 'landing', label: 'F1 INDEX', cls: 'bg-[#FFB000] text-[#050505]' },
  { id: 'scanner', label: 'F2 SCAN', cls: 'bg-[#22C55E] text-[#050505]' },
  { id: 'dashboard', label: 'F3 CONTROL', cls: 'bg-[#38BDF8] text-[#050505]' },
  { id: 'library', label: 'F4 ARCHIVE', cls: 'bg-[#F97316] text-[#050505]' },
  { id: 'history', label: 'F5 LOGS', cls: 'bg-[#EF4444] text-[#050505]' },
  { id: 'points', label: 'F6 CREDITS', cls: 'bg-[#D6FF42] text-[#050505]' },
];

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#050505] border-t border-[#262626] text-[#FFB000] mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2">
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 mb-2">
          {F_BAR.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`${item.cls} py-1.5 px-2 text-[11px] font-bold tracking-wider text-left hover:opacity-90 cursor-pointer`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row justify-between gap-1 text-[10px] text-[#737373] tracking-wider">
          <span>
            <span className="text-[#22C55E] font-bold">READY &gt;</span> AMBER DEFAULT ACTIVE // 1PX DIVIDERS // NO RADIUS // DATA DENSITY
          </span>
          <span>BINWISE_SYS_001 // {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  );
}
