import React from 'react';
import { Trash2, Eye, Camera, Clock } from 'lucide-react';
import { useBinWise } from '../context/BinWiseContext';
import CategoryBadge from '../components/CategoryBadge';

export default function HistoryPage({ onNavigate, onViewScan }) {
  const { scans, deleteScan, clearDemoScans } = useBinWise();
  const hasDemo = scans.some((s) => s.isDemo);

  return (
    <div className="bg-[#080808] text-[#F4F3EF] min-h-[calc(100vh-8rem)] bg-tech-grid py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#F4F3EF]/15 pb-5">
          <div>
            <span className="font-mono-tech text-xs tracking-widest text-[#F4F3EF]/50">
              SESSION_LOGS // 04-HISTORY
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase mt-1">
              Scan History
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {hasDemo && (
              <button
                onClick={clearDemoScans}
                className="px-4 py-2.5 border border-[#F4F3EF]/30 font-mono-tech text-xs uppercase hover:border-[#F4F3EF] cursor-pointer"
              >
                CLEAR SAMPLES
              </button>
            )}
            <button
              onClick={() => onNavigate('scanner')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase cursor-pointer"
            >
              <Camera className="w-4 h-4" />
              NEW SCAN
            </button>
          </div>
        </div>

        {scans.length === 0 ? (
          <div className="border border-[#F4F3EF]/20 p-14 text-center">
            <p className="font-mono-tech text-xs text-[#F4F3EF]/50 mb-4">
              NO_SCAN_LOGS_RECORDED
            </p>
            <button
              onClick={() => onNavigate('scanner')}
              className="px-5 py-2.5 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase cursor-pointer"
            >
              SCAN FIRST ITEM
            </button>
          </div>
        ) : (
          <div className="border border-[#F4F3EF]/20 overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F4F3EF]/20 bg-[#F4F3EF]/5 font-mono-tech text-[11px] uppercase tracking-wider text-[#F4F3EF]/60">
                  <th className="py-3.5 px-5">SPECIMEN</th>
                  <th className="py-3.5 px-5">CLASSIFICATION</th>
                  <th className="py-3.5 px-5">CONFIDENCE</th>
                  <th className="py-3.5 px-5">TIMESTAMP</th>
                  <th className="py-3.5 px-5 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F4F3EF]/10 text-sm">
                {scans.map((scan) => (
                  <tr key={scan.id} className="hover:bg-[#F4F3EF]/5 transition-colors">
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        {scan.thumbnail && (
                          <img
                            src={scan.thumbnail}
                            alt={scan.item_name}
                            className="w-10 h-10 object-cover border border-[#F4F3EF]/20 shrink-0"
                          />
                        )}
                        <div>
                          <p className="font-display font-semibold">{scan.item_name}</p>
                          {scan.isDemo && (
                            <span className="font-mono-tech text-[10px] text-[#D6FF42]">
                              [SAMPLE]
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <CategoryBadge category={scan.category} size="sm" />
                    </td>
                    <td className="py-4 px-5 font-mono-tech text-xs">
                      {Math.round((scan.confidence || 0) * 100)}%
                    </td>
                    <td className="py-4 px-5 font-mono-tech text-xs text-[#F4F3EF]/55">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(scan.timestamp).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-right">
                      <div className="inline-flex items-center gap-2">
                        <button
                          onClick={() => onViewScan(scan)}
                          className="p-2 border border-[#F4F3EF]/20 hover:border-[#D6FF42] hover:text-[#D6FF42] cursor-pointer"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteScan(scan.id)}
                          className="p-2 border border-[#F4F3EF]/20 hover:border-[#FF5B2E] hover:text-[#FF5B2E] cursor-pointer"
                          title="Delete Entry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
