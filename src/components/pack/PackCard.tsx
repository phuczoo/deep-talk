'use client';

import React from 'react';
import { PackInfo } from '@/types';
import { HeartHandshake, Users, Flame, Wine, Scale, CheckCircle2 } from 'lucide-react';

interface PackCardProps {
  pack: PackInfo;
  isSelected: boolean;
  questionCount: number;
  onSelect: () => void;
}

export function PackCard({
  pack,
  isSelected,
  questionCount,
  onSelect,
}: PackCardProps) {
  const icons: Record<string, React.ReactNode> = {
    HeartHandshake: <HeartHandshake className="w-5 h-5 text-rose-500" />,
    Flame: <Flame className="w-5 h-5 text-red-500" />,
    Users: <Users className="w-5 h-5 text-amber-500" />,
    Wine: <Wine className="w-5 h-5 text-purple-500" />,
    Scale: <Scale className="w-5 h-5 text-cyan-500" />,
  };

  return (
    <button
      onClick={onSelect}
      type="button"
      className={`relative w-full text-left p-4 sm:p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer active:scale-[0.98] ${
        isSelected
          ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-900 shadow-md ring-1 ring-zinc-900/10 dark:ring-white/10'
          : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
      }`}
    >
      {/* Selection Checkmark / Checkbox */}
      <div className="absolute top-3.5 right-3.5">
        {isSelected ? (
          <CheckCircle2 className="w-5 h-5 fill-zinc-900 text-white dark:fill-white dark:text-zinc-900 transition-transform scale-110" />
        ) : (
          <div className="w-5 h-5 rounded-full border-2 border-zinc-300 dark:border-zinc-700 bg-transparent" />
        )}
      </div>

      <div className="flex items-start gap-3.5">
        <div className={`p-2.5 rounded-xl ${pack.color.bg} border ${pack.color.border} shrink-0`}>
          {icons[pack.iconName] || <HeartHandshake className="w-5 h-5" />}
        </div>

        <div className="flex-1 min-w-0 pr-6">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm sm:text-base text-zinc-900 dark:text-zinc-100">
              {pack.name}
            </h3>
            <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
              ({questionCount} câu)
            </span>
          </div>

          <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-1 mt-0.5 font-medium">
            {pack.subtitle}
          </p>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 line-clamp-2 mt-1 leading-snug">
            {pack.description}
          </p>
        </div>
      </div>
    </button>
  );
}
