'use client';

import React from 'react';
import { Question } from '@/types';
import { PACKS, LEVEL_INFO } from '@/data/packs';
import { Sparkles, UserCheck, Flame, Heart } from 'lucide-react';
import { DareTimer } from './DareTimer';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalAnswered: number;
  remainingCount: number;
  isPinned: boolean;
  onTogglePin: () => void;
}

export function QuestionCard({
  question,
  currentIndex,
  totalAnswered,
  remainingCount,
  isPinned,
  onTogglePin,
}: QuestionCardProps) {
  const packInfo = PACKS.find((p) => p.id === question.pack) || PACKS[0];
  const levelInfo = LEVEL_INFO[question.level] || LEVEL_INFO[1];

  const levelIcons = {
    1: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
    2: <Flame className="w-3.5 h-3.5 text-amber-500" />,
    3: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />,
  };

  const isDare = question.type === 'dare';

  return (
    <div
      className={`relative w-full aspect-[4/5] max-h-[500px] min-h-[380px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xl transition-all duration-300 select-none ${
        isDare
          ? 'border-2 border-amber-500/60 dark:border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-white to-orange-50/60 dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-950 ring-2 ring-amber-500/20'
          : 'border border-zinc-200/90 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/80 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950'
      }`}
    >
      {/* Background ambient glow based on pack or dare */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${
          isDare ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20' : `bg-gradient-to-br ${packInfo.color.gradient}`
        } blur-3xl pointer-events-none opacity-60 dark:opacity-40`}
      />

      {/* Top Bar of Card */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dare or Truth badge */}
          {isDare ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 shadow-sm animate-pulse">
              ⚡ THỬ THÁCH (DARE)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              🗣️ NÓI THẬT
            </span>
          )}

          {/* Pack badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${packInfo.color.badge}`}
          >
            {packInfo.name}
          </span>

          {/* Level badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelInfo.bgBadge}`}
          >
            {levelIcons[question.level]}
            <span>Cấp {question.level}</span>
          </span>

          {/* Custom tag */}
          {question.isCustom && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <UserCheck className="w-3 h-3" />
              Tự tạo
            </span>
          )}
        </div>

        {/* Question Counter */}
        <div className="text-[12px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
          #{totalAnswered + 1}
        </div>
      </div>

      {/* Center Question Text & Dare Timer */}
      <div className="relative z-10 my-auto py-2 flex flex-col justify-center">
        <h2 className="text-lg sm:text-2xl font-bold leading-relaxed tracking-tight text-zinc-900 dark:text-zinc-50 text-balance text-left sm:text-center">
          &ldquo;{question.question}&rdquo;
        </h2>

        {/* Interactive Dare Countdown Timer */}
        {isDare && <DareTimer questionText={question.question} />}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className={`w-2 h-2 rounded-full ${isDare ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'}`} />
          {isDare ? 'Làm thử thách hoặc bấm Phạt Uống 🍺' : 'Đọc to & chuyền máy sau câu trả lời'}
        </span>

        <span className="text-[11px] font-medium text-zinc-400">
          Còn {remainingCount} câu
        </span>
      </div>
    </div>
  );
}
