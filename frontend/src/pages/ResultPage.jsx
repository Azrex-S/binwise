import React from 'react';
import { motion } from 'framer-motion';
import { Camera, LayoutDashboard, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import CategoryBadge from '../components/CategoryBadge';
import { useBinWise } from '../context/BinWiseContext';

export default function ResultPage({ result, onNavigate }) {
  const { saveScanToHistory } = useBinWise();

  if (!result) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="font-mono-tech text-sm text-[#F4F3EF]/60 mb-4">
          NO_SPECIMEN_SELECTED
        </p>
        <button
          onClick={() => onNavigate('scanner')}
          className="px-6 py-3 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase cursor-pointer"
        >
          OPEN SCANNER
        </button>
      </div>
    );
  }

  const confidencePct = Math.round((result.confidence || 0) * 100);
  const isUncertain = result.category === 'uncertain';

  return (
    <div className="bg-[#080808] text-[#F4F3EF] min-h-[calc(100vh-8rem)] bg-tech-grid py-10">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {result.isDemo && (
          <div className="mb-6 flex items-center gap-2.5 px-4 py-3 border border-[#D6FF42]/40 bg-[#D6FF42]/10 text-[#D6FF42] font-mono-tech text-xs">
            <Info className="w-4 h-4 shrink-0" />
            <span>
              DEMO_MODE: SIMULATED CLASSIFICATION (GEMINI_API_KEY NOT CONFIGURED).
            </span>
          </div>
        )}

        <div className="border border-[#F4F3EF]/25 bg-[#080808]">
          {/* Telemetry Header */}
          <div className="px-6 py-4 border-b border-[#F4F3EF]/20 flex flex-wrap items-center justify-between gap-4">
            <CategoryBadge category={result.category} />
            <div className="font-mono-tech text-xs tracking-wider">
              CONFIDENCE: <span className="text-[#D6FF42] font-bold">{confidencePct}%</span>
            </div>
          </div>

          <div className="grid md:grid-cols-12">
            {/* Image */}
            <div className="md:col-span-5 border-b md:border-b-0 md:border-r border-[#F4F3EF]/20 p-6 flex items-center justify-center bg-[#080808]">
              {result.thumbnail ? (
                <img
                  src={result.thumbnail}
                  alt={result.item_name}
                  className="w-full max-h-72 object-contain border border-[#F4F3EF]/15"
                />
              ) : (
                <div className="w-full h-64 border border-dashed border-[#F4F3EF]/20 flex items-center justify-center font-mono-tech text-xs text-[#F4F3EF]/40">
                  NO_IMAGE_PREVIEW
                </div>
              )}
            </div>

            {/* Report */}
            <div className="md:col-span-7 p-6 sm:p-8 space-y-6">
              <div>
                <p className="font-mono-tech text-[11px] tracking-widest text-[#F4F3EF]/50">
                  MATERIAL_DETECTED
                </p>
                <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase mt-1">
                  {result.item_name}
                </h1>
              </div>

              {isUncertain && (
                <div className="p-4 border border-[#F4F3EF]/40 bg-[#F4F3EF]/5 font-mono-tech text-xs text-[#F4F3EF]">
                  UNCERTAIN_CLASSIFICATION: PLEASE INSPECT MANUALLY OR CHECK LOCAL MUNICIPAL RULES.
                </div>
              )}

              <div className="space-y-4 text-sm">
                <div className="border-t border-[#F4F3EF]/15 pt-4">
                  <p className="font-mono-tech text-[11px] text-[#F4F3EF]/50 uppercase mb-1">
                    01 // ANALYSIS_REASON
                  </p>
                  <p className="text-[#F4F3EF]/85 leading-relaxed">{result.reason}</p>
                </div>

                <div className="border-t border-[#F4F3EF]/15 pt-4">
                  <p className="font-mono-tech text-[11px] text-[#D6FF42] uppercase mb-1 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    02 // DISPOSAL_METHOD
                  </p>
                  <p className="text-[#F4F3EF]/85 leading-relaxed">{result.disposal_method}</p>
                </div>

                <div className="border-t border-[#F4F3EF]/15 pt-4">
                  <p className="font-mono-tech text-[11px] text-[#F4F3EF]/50 uppercase mb-1">
                    03 // PREPARATION
                  </p>
                  <p className="text-[#F4F3EF]/85 leading-relaxed">{result.preparation}</p>
                </div>

                {result.safety_warning && (
                  <div className="p-4 border border-[#FF5B2E] bg-[#FF5B2E]/10 text-[#FF5B2E] text-xs font-mono-tech flex items-start gap-2.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block uppercase">SAFETY_WARNING</strong>
                      <span className="text-[#F4F3EF]/90 font-sans text-sm mt-1 block">
                        {result.safety_warning}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-[#F4F3EF]/20 flex flex-wrap items-center justify-between gap-3 bg-[#080808]">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => onNavigate('scanner')}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase cursor-pointer"
              >
                <Camera className="w-4 h-4" />
                SCAN ANOTHER
              </button>
              <button
                onClick={() => saveScanToHistory(result)}
                className="px-5 py-2.5 border border-[#F4F3EF]/30 font-mono-tech text-xs uppercase hover:border-[#D6FF42] hover:text-[#D6FF42] cursor-pointer"
              >
                SAVE TO LOGS
              </button>
            </div>

            <button
              onClick={() => onNavigate('dashboard')}
              className="inline-flex items-center gap-2 px-4 py-2.5 font-mono-tech text-xs uppercase text-[#F4F3EF]/70 hover:text-[#F4F3EF] cursor-pointer"
            >
              <LayoutDashboard className="w-4 h-4" />
              CONTROL ROOM
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
