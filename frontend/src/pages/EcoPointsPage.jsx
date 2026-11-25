import React from 'react';
import { Award, CheckCircle2, Lock } from 'lucide-react';
import { useBinWise } from '../context/BinWiseContext';

export default function EcoPointsPage() {
  const { ecoPoints, activities, stats } = useBinWise();

  const nextMilestone = ecoPoints < 100 ? 100 : ecoPoints < 250 ? 250 : 500;
  const progressPct = Math.min(100, Math.round((ecoPoints / nextMilestone) * 100));

  const badges = [
    {
      name: 'FIRST_STEP',
      desc: 'Completed your first waste scan',
      unlocked: stats.total >= 1,
    },
    {
      name: 'ARCHIVE_EXPLORER',
      desc: 'Visited the Waste Knowledge Library',
      unlocked: activities.some((a) => a.label.includes('Library')),
    },
    {
      name: 'SORTING_CHAMPION',
      desc: 'Reached 100 Eco Credits',
      unlocked: ecoPoints >= 100,
    },
    {
      name: 'CIVIC_ALLY',
      desc: 'Scanned 5 or more waste items',
      unlocked: stats.total >= 5,
    },
  ];

  return (
    <div className="bg-[#080808] text-[#F4F3EF] min-h-[calc(100vh-8rem)] bg-tech-grid py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border-b border-[#F4F3EF]/15 pb-5 mb-8">
          <span className="font-mono-tech text-xs tracking-widest text-[#D6FF42]">
            ENGAGEMENT_CREDITS // 05-ECO_POINTS
          </span>
          <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase mt-1">
            Eco Credits &amp; Badges
          </h1>
          <p className="font-mono-tech text-xs text-[#F4F3EF]/50 mt-2">
            CREDITS REFLECT APP ENGAGEMENT AND DO NOT VERIFY PHYSICAL HOUSEHOLD DISPOSAL.
          </p>
        </div>

        {/* Credits Banner */}
        <div className="border border-[#D6FF42] bg-[#080808] p-8 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div>
            <p className="font-mono-tech text-xs text-[#D6FF42] tracking-widest">
              TOTAL_ECO_CREDITS
            </p>
            <p className="font-display text-6xl font-bold text-[#D6FF42] mt-2">
              {ecoPoints}
            </p>
          </div>
          <div className="w-full sm:w-72">
            <div className="flex justify-between font-mono-tech text-xs text-[#F4F3EF]/70 mb-2">
              <span>TARGET: {nextMilestone}</span>
              <span>{progressPct}%</span>
            </div>
            <div className="w-full h-3 border border-[#F4F3EF]/30 bg-[#080808]">
              <div
                className="h-full bg-[#D6FF42] transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-[#F4F3EF]/20 p-6">
            <h2 className="font-display text-lg font-bold uppercase mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#D6FF42]" />
              Achievement Badges
            </h2>
            <div className="space-y-3">
              {badges.map((b) => (
                <div
                  key={b.name}
                  className={`p-4 border flex items-center justify-between ${
                    b.unlocked
                      ? 'border-[#D6FF42]/60 bg-[#D6FF42]/5'
                      : 'border-[#F4F3EF]/15 opacity-55'
                  }`}
                >
                  <div>
                    <p className="font-mono-tech text-xs font-bold">{b.name}</p>
                    <p className="text-xs text-[#F4F3EF]/70 mt-1">{b.desc}</p>
                  </div>
                  {b.unlocked ? (
                    <CheckCircle2 className="w-5 h-5 text-[#D6FF42] shrink-0" />
                  ) : (
                    <Lock className="w-4 h-4 text-[#F4F3EF]/40 shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border border-[#F4F3EF]/20 p-6">
            <h2 className="font-display text-lg font-bold uppercase mb-4">
              Activity Telemetry
            </h2>
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              {activities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-center justify-between p-3 border border-[#F4F3EF]/15"
                >
                  <div>
                    <p className="text-sm font-medium">{act.label}</p>
                    <p className="font-mono-tech text-[10px] text-[#F4F3EF]/45 mt-0.5">
                      {new Date(act.timestamp).toLocaleString()}
                    </p>
                  </div>
                  <span className="font-mono-tech text-xs font-bold text-[#D6FF42]">
                    +{act.points}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
