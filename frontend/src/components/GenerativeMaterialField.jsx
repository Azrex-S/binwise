import React, { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

const PALETTE = ['#1717FF', '#FF5B2E', '#D6FF42', '#F4F3EF', '#262626'];

export default function GenerativeMaterialField() {
  const canvasRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resize();
    window.addEventListener('resize', resize);

    const cellSize = 18;

    const draw = () => {
      const { width, height } = canvas;
      ctx.fillStyle = '#080808';
      ctx.fillRect(0, 0, width, height);

      const cols = Math.ceil(width / cellSize);
      const rows = Math.ceil(height / cellSize);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const wave =
            Math.sin(c * 0.25 + tick * 0.03) +
            Math.cos(r * 0.28 - tick * 0.025);

          if (wave > 0.85) {
            const colorIdx = (c * 3 + r * 7 + Math.floor(tick * 0.05)) % PALETTE.length;
            ctx.fillStyle = PALETTE[colorIdx];
            ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
          } else if (wave > 0.2) {
            ctx.strokeStyle = 'rgba(244, 243, 239, 0.12)';
            ctx.strokeRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);
          }
        }
      }

      if (!shouldReduceMotion) {
        tick += 1;
        animId = requestAnimationFrame(draw);
      }
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [shouldReduceMotion]);

  return (
    <div className="relative w-full h-full min-h-[340px] border border-[#F4F3EF]/20 bg-[#080808] overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-3 left-3 px-2 py-1 bg-[#080808]/90 border border-[#F4F3EF]/20 font-mono-tech text-[10px] tracking-widest text-[#D6FF42]">
        VIS-FIELD // 01-A
      </div>
      <div className="absolute bottom-3 right-3 px-2 py-1 bg-[#080808]/90 border border-[#F4F3EF]/20 font-mono-tech text-[10px] tracking-widest text-[#F4F3EF]/70">
        PARTICLE_MATRIX: ACTIVE
      </div>
    </div>
  );
}
