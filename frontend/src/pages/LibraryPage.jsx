import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { WASTE_LIBRARY } from '../data/wasteLibrary';
import CategoryBadge from '../components/CategoryBadge';
import { useBinWise } from '../context/BinWiseContext';

const FILTERS = [
  { id: 'all', label: 'ALL_ITEMS' },
  { id: 'wet', label: 'CAT-01 // WET' },
  { id: 'dry', label: 'CAT-02 // DRY' },
  { id: 'hazardous', label: 'CAT-03 // HAZARD' },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const { recordLibraryVisit } = useBinWise();

  useEffect(() => {
    recordLibraryVisit();
  }, [recordLibraryVisit]);

  const filtered = WASTE_LIBRARY.filter((item) => {
    const matchesCategory = activeFilter === 'all' || item.category === activeFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.name.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.disposal.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="bg-[#F4F3EF] text-[#080808] min-h-[calc(100vh-8rem)] bg-tech-grid-light py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#080808] pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono-tech text-xs tracking-widest text-[#1717FF] font-semibold">
              MATERIAL_ARCHIVE // 03-ENCYCLOPEDIA
            </span>
            <h1 className="font-display text-3xl sm:text-5xl font-bold uppercase mt-1">
              Waste Knowledge Library
            </h1>
          </div>
          <span className="font-mono-tech text-xs text-[#080808]/60">
            ENTRIES: {filtered.length} / {WASTE_LIBRARY.length}
          </span>
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#080808]/50 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="SEARCH MATERIAL (E.G. BANANA, BATTERY)..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-[#080808] font-mono-tech text-xs focus:outline-none focus:border-[#1717FF]"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-2.5 font-mono-tech text-xs border transition-colors cursor-pointer ${
                  activeFilter === f.id
                    ? 'bg-[#1717FF] text-[#F4F3EF] border-[#1717FF] font-semibold'
                    : 'bg-white text-[#080808] border-[#080808] hover:bg-[#080808] hover:text-[#F4F3EF]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Editorial Grid */}
        {filtered.length === 0 ? (
          <div className="border border-[#080808] bg-white p-12 text-center font-mono-tech text-xs text-[#080808]/60">
            NO_MATCHING_MATERIALS_FOUND
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#080808]">
            {filtered.map((item, idx) => (
              <div
                key={item.id}
                className="bg-white border-r border-b border-[#080808] p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="font-mono-tech text-[11px] text-[#080808]/45">
                      REF_{String(idx + 1).padStart(2, '0')}
                    </span>
                    <CategoryBadge category={item.category} size="sm" />
                  </div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{item.emoji}</span>
                    <h3 className="font-display text-xl font-bold leading-tight">
                      {item.name}
                    </h3>
                  </div>
                  <p className="text-sm text-[#080808]/75 leading-relaxed mt-2">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-[#080808]/15">
                  <p className="font-mono-tech text-[10px] tracking-widest text-[#1717FF] uppercase mb-1">
                    DISPOSAL_PROTOCOL
                  </p>
                  <p className="text-xs text-[#080808]/85 leading-relaxed">{item.disposal}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
