import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, Camera, Trash2, AlertCircle, Crosshair } from 'lucide-react';
import { useBinWise } from '../context/BinWiseContext';

const ANALYSIS_STEPS = [
  'ANALYSING MATERIAL...',
  'IDENTIFYING COMPOSITION...',
  'CLASSIFICATION IN PROGRESS...',
];

export default function ScannerPage({ onResultReady }) {
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const [error, setError] = useState('');
  const { setLatestResult, saveScanToHistory } = useBinWise();

  useEffect(() => {
    if (!isAnalyzing) return;
    const interval = setInterval(() => {
      setStepIdx((prev) => (prev + 1) % ANALYSIS_STEPS.length);
    }, 900);
    return () => clearInterval(interval);
  }, [isAnalyzing]);

  const handleFileSelect = (file) => {
    setError('');
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setError('ERR_FORMAT: Upload JPEG, PNG, WEBP, or GIF.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('ERR_SIZE: Maximum file size is 10 MB.');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      setError('ERR_INPUT: No specimen image loaded.');
      return;
    }

    setIsAnalyzing(true);
    setStepIdx(0);
    setError('');

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      const response = await fetch('/api/classify-waste', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Classification request failed.');
      }

      const fullResult = {
        ...data,
        id: `scan-${Date.now()}`,
        timestamp: new Date().toISOString(),
        thumbnail: previewUrl,
        isDemo: data.mode === 'demo',
      };

      setLatestResult(fullResult);
      saveScanToHistory(fullResult);
      onResultReady(fullResult);
    } catch (err) {
      setError(
        err.message || 'ERR_NETWORK: Could not reach classification backend.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#080808] text-[#F4F3EF] min-h-[calc(100vh-8rem)] bg-tech-grid py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6 border-b border-[#F4F3EF]/15 pb-4">
          <div>
            <span className="font-mono-tech text-xs tracking-widest text-[#FF5B2E]">
              OPTICAL_LAB // 01-SCANNER
            </span>
            <h1 className="font-display text-3xl sm:text-4xl font-bold uppercase mt-1">
              Material Vision Scanner
            </h1>
          </div>
          <span className="font-mono-tech text-xs text-[#F4F3EF]/50">
            MAX_PAYLOAD: 10MB
          </span>
        </div>

        <div className="border border-[#F4F3EF]/25 bg-[#080808] p-6 sm:p-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            capture="environment"
            onChange={(e) => handleFileSelect(e.target.files?.[0])}
            className="hidden"
          />

          {!previewUrl ? (
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="relative border border-dashed border-[#F4F3EF]/35 hover:border-[#FF5B2E] p-12 sm:p-16 text-center cursor-pointer transition-colors bg-[#080808]"
            >
              <Crosshair className="w-10 h-10 text-[#FF5B2E] mx-auto mb-4" />
              <p className="font-display text-lg font-semibold uppercase">
                Drop Specimen Image or Click to Capture
              </p>
              <p className="font-mono-tech text-xs text-[#F4F3EF]/50 mt-2">
                SUPPORTED: JPEG / PNG / WEBP / GIF
              </p>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 border border-[#F4F3EF] text-xs font-mono-tech uppercase tracking-wider hover:bg-[#F4F3EF] hover:text-[#080808] transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                SELECT FILE / CAMERA
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Viewport with scanning grid & animated laser line */}
              <div className="relative border border-[#F4F3EF]/30 bg-[#080808] overflow-hidden">
                <img
                  src={previewUrl}
                  alt="Specimen preview"
                  className="w-full max-h-96 object-contain mx-auto"
                />

                {/* Corner reticles */}
                <div className="absolute top-2 left-2 font-mono-tech text-[10px] text-[#D6FF42] bg-[#080808]/80 px-2 py-0.5 border border-[#D6FF42]/40">
                  SPECIMEN_LOADED
                </div>

                {isAnalyzing && (
                  <>
                    <motion.div
                      initial={{ top: '0%' }}
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ duration: 2.2, repeat: Infinity, ease: 'linear' }}
                      className="absolute left-0 right-0 h-0.5 bg-[#FF5B2E] shadow-[0_0_12px_#FF5B2E]"
                    />
                    <div className="absolute inset-0 bg-[#080808]/55 flex items-center justify-center">
                      <div className="px-5 py-3 border border-[#FF5B2E] bg-[#080808] font-mono-tech text-xs tracking-widest text-[#FF5B2E]">
                        {ANALYSIS_STEPS[stepIdx]}
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzing}
                    className="px-4 py-2.5 border border-[#F4F3EF]/30 font-mono-tech text-xs uppercase hover:border-[#F4F3EF] disabled:opacity-50 cursor-pointer"
                  >
                    REPLACE
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isAnalyzing}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-[#FF5B2E]/50 text-[#FF5B2E] font-mono-tech text-xs uppercase hover:bg-[#FF5B2E] hover:text-[#080808] disabled:opacity-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    CLEAR
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="inline-flex items-center gap-2.5 px-6 py-3 bg-[#FF5B2E] text-[#080808] font-mono-tech text-xs font-bold uppercase tracking-wider hover:bg-[#ff734d] disabled:opacity-60 cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  {isAnalyzing ? 'PROCESSING...' : 'ANALYZE WASTE'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mt-6 flex items-start gap-2.5 p-4 border border-[#FF5B2E] bg-[#FF5B2E]/10 text-[#FF5B2E] font-mono-tech text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
