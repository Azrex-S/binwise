import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useBinWise } from '../context/BinWiseContext';

const NAV_ITEMS = [
  { id: 'landing', key: 'F1', label: 'INDEX', bg: 'bg-[#FFB000] text-[#050505]' },
  { id: 'scanner', key: 'F2', label: 'SCAN', bg: 'bg-[#22C55E] text-[#050505]' },
  { id: 'dashboard', key: 'F3', label: 'CONTROL', bg: 'bg-[#38BDF8] text-[#050505]' },
  { id: 'library', key: 'F4', label: 'ARCHIVE', bg: 'bg-[#F97316] text-[#050505]' },
  { id: 'history', key: 'F5', label: 'LOGS', bg: 'bg-[#EF4444] text-[#050505]' },
  { id: 'points', key: 'F6', label: 'CREDITS', bg: 'bg-[#D6FF42] text-[#050505]' },
];

export default function Navbar({ currentPage, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { ecoPoints } = useBinWise();

  useEffect(() => {
    const onKeyDown = (e) => {
      const idx = ['F1', 'F2', 'F3', 'F4', 'F5', 'F6'].indexOf(e.key);
      if (idx !== -1) {
        e.preventDefault();
        onNavigate(NAV_ITEMS[idx].id);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onNavigate]);

  const handleNav = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#050505] border-b border-[#262626]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-12">
          {/* Terminal Brand */}
          <button
            onClick={() => handleNav('landing')}
            className="flex items-center gap-2.5 cursor-pointer text-left"
          >
            <span className="text-[#FFB000] font-bold tracking-wider text-sm crt-glow">
              BINWISE/0 TERMINAL
            </span>
            <span className="hidden lg:inline text-[10px] text-[#737373] tracking-widest">
              AMBER CRT DEFAULT // WASTE_DATA_PLANE
            </span>
          </button>

          {/* Top-right action blocks */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`px-2.5 py-1 text-[11px] font-bold tracking-wider cursor-pointer border transition-opacity ${
                    isActive
                      ? `${item.bg} border-transparent`
                      : 'bg-[#050505] text-[#FFB000] border-[#262626] hover:border-[#FFB000]'
                  }`}
                >
                  {item.key} {item.label}
                </button>
              );
            })}
            <button
              onClick={() => handleNav('points')}
              className="ml-2 px-2.5 py-1 border border-[#FFB000]/40 text-[#FFB000] text-[11px] font-bold cursor-pointer"
            >
              PTS:{ecoPoints}
            </button>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-1.5 border border-[#262626] text-[#FFB000] cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#262626] bg-[#050505] px-3 py-2 grid grid-cols-2 gap-1.5">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`px-2.5 py-2 text-xs font-bold text-left border cursor-pointer ${
                currentPage === item.id
                  ? `${item.bg} border-transparent`
                  : 'border-[#262626] text-[#FFB000]'
              }`}
            >
              {item.key} {item.label}
            </button>
          ))}
        </div>
      )}
    </header>
  );
}
