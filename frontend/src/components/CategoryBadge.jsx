import React from 'react';
import { Leaf, Recycle, AlertTriangle, HelpCircle } from 'lucide-react';

const CATEGORY_CONFIG = {
  wet: {
    code: 'CAT-01',
    label: 'WET WASTE',
    bg: 'bg-[#D6FF42]',
    text: 'text-[#080808]',
    border: 'border-[#D6FF42]',
    Icon: Leaf,
  },
  dry: {
    code: 'CAT-02',
    label: 'DRY WASTE',
    bg: 'bg-[#1717FF]',
    text: 'text-[#F4F3EF]',
    border: 'border-[#1717FF]',
    Icon: Recycle,
  },
  hazardous: {
    code: 'CAT-03',
    label: 'HAZARDOUS',
    bg: 'bg-[#FF5B2E]',
    text: 'text-[#080808]',
    border: 'border-[#FF5B2E]',
    Icon: AlertTriangle,
  },
  uncertain: {
    code: 'CAT-00',
    label: 'MANUAL REVIEW',
    bg: 'bg-[#F4F3EF]',
    text: 'text-[#080808]',
    border: 'border-[#080808]',
    Icon: HelpCircle,
  },
};

export function getCategoryConfig(category) {
  return CATEGORY_CONFIG[category] || CATEGORY_CONFIG.uncertain;
}

export default function CategoryBadge({ category, size = 'md' }) {
  const cfg = getCategoryConfig(category);
  const Icon = cfg.Icon;

  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-[11px] gap-1.5'
      : 'px-3 py-1 text-xs gap-2';

  return (
    <span
      className={`inline-flex items-center font-mono-tech font-semibold uppercase tracking-wider border ${cfg.bg} ${cfg.text} ${cfg.border} ${sizeClasses}`}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{cfg.code} // {cfg.label}</span>
    </span>
  );
}
