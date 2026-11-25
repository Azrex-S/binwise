import React from 'react';
import { Camera, ArrowUpRight, Clock } from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
} from 'recharts';
import { useBinWise } from '../context/BinWiseContext';
import CategoryBadge from '../components/CategoryBadge';

export default function DashboardPage({ onNavigate, onViewScan }) {
  const { scans, ecoPoints, stats } = useBinWise();

  const chartData = [
    { name: 'WET', count: stats.wet, color: '#D6FF42' },
    { name: 'DRY', count: stats.dry, color: '#1717FF' },
    { name: 'HAZARD', count: stats.hazardous, color: '#FF5B2E' },
    { name: 'REVIEW', count: stats.uncertain, color: '#9CA3AF' },
  ];

  const metrics = [
    { label: 'TOTAL_SCANS', value: stats.total, accent: 'text-[#F4F3EF]' },
    { label: 'WET_STREAM', value: stats.wet, accent: 'text-[#D6FF42]' },
    { label: 'DRY_STREAM', value: stats.dry, accent: 'text-[#1717FF]' },
    { label: 'HAZARDOUS', value: stats.hazardous, accent: 'text-[#FF5B2E]' },
    { label: 'ECO_CREDITS', value: ecoPoints, accent: 'text-[#D6FF42]' },
  ];

  return (
    <div className="bg-[#080808] text-[#F4F3EF] min-h-[calc(100vh-8rem)] bg-tech-grid py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 border-b border-[#F4F3EF]/15 pb-5">
          <div>
            <span className="font-mono-tech text-xs tracking-widest text-[#1717FF]">
              CONTROL_ROOM // 02-TELEMETRY
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase mt-1">
              Environmental Intelligence
            </h1>
          </div>

          <button
            onClick={() => onNavigate('scanner')}
            className="inline-flex items-center gap-2 px-5 py-3 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-[#ff734d] cursor-pointer"
          >
            <Camera className="w-4 h-4" />
            NEW SCAN
          </button>
        </div>

        {/* Typography-led Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 border border-[#F4F3EF]/20 mb-8">
          {metrics.map((m, idx) => (
            <div
              key={m.label}
              className={`p-5 bg-[#080808] ${
                idx < 4 ? 'border-b lg:border-b-0 lg:border-r border-[#F4F3EF]/20' : ''
              }`}
            >
              <p className="font-mono-tech text-[10px] tracking-widest text-[#F4F3EF]/50">
                {m.label}
              </p>
              <p className={`font-display text-4xl font-bold mt-2 ${m.accent}`}>
                {String(m.value).padStart(2, '0')}
              </p>
            </div>
          ))}
        </div>

        {/* Chart + Recent Logs */}
        <div className="grid lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 border border-[#F4F3EF]/20 bg-[#080808] p-6">
            <p className="font-mono-tech text-xs tracking-widest text-[#F4F3EF]/50 mb-1">
              DISTRIBUTION_MATRIX
            </p>
            <h2 className="font-display text-xl font-bold uppercase mb-6">
              Stream Breakdown
            </h2>

            {stats.total === 0 ? (
              <div className="h-56 flex items-center justify-center font-mono-tech text-xs text-[#F4F3EF]/40">
                NO_DATA_RECORDED
              </div>
            ) : (
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'IBM Plex Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      allowDecimals={false}
                      tick={{ fontSize: 11, fill: '#9CA3AF', fontFamily: 'IBM Plex Mono' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: 'rgba(244,243,239,0.05)' }}
                      contentStyle={{
                        backgroundColor: '#080808',
                        border: '1px solid rgba(244,243,239,0.2)',
                        fontFamily: 'IBM Plex Mono',
                        fontSize: '12px',
                        color: '#F4F3EF',
                      }}
                    />
                    <Bar dataKey="count">
                      {chartData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 border border-[#F4F3EF]/20 bg-[#080808] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="font-mono-tech text-xs tracking-widest text-[#F4F3EF]/50">
                  RECENT_LOGS
                </p>
                <h2 className="font-display text-xl font-bold uppercase mt-0.5">
                  Latest Classifications
                </h2>
              </div>
              <button
                onClick={() => onNavigate('history')}
                className="inline-flex items-center gap-1 font-mono-tech text-xs text-[#D6FF42] hover:underline cursor-pointer"
              >
                ALL LOGS <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {scans.length === 0 ? (
              <div className="py-12 text-center font-mono-tech text-xs text-[#F4F3EF]/40">
                NO_SCANS_IN_SESSION
              </div>
            ) : (
              <div className="divide-y divide-[#F4F3EF]/15 border-t border-[#F4F3EF]/15">
                {scans.slice(0, 5).map((scan) => (
                  <div
                    key={scan.id}
                    onClick={() => onViewScan(scan)}
                    className="py-3.5 flex items-center justify-between gap-4 hover:bg-[#F4F3EF]/5 px-2 cursor-pointer transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="font-display font-semibold text-sm truncate">
                        {scan.item_name}
                      </p>
                      <p className="font-mono-tech text-[11px] text-[#F4F3EF]/45 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {new Date(scan.timestamp).toLocaleString()}
                      </p>
                    </div>
                    <CategoryBadge category={scan.category} size="sm" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
