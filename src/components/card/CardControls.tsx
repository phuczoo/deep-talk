'use client';

import React from 'react';
import { ArrowRight, RotateCcw, Bookmark, FastForward, Share2, Beer } from 'lucide-react';

interface CardControlsProps {
  onNext: () => void;
  onSkip: () => void;
  onPrev: () => void;
  onTogglePin: () => void;
  onShare?: () => void;
  onDrinkPenalty?: () => void;
  canGoBack: boolean;
  isPinned: boolean;
}

export function CardControls({
  onNext,
  onSkip,
  onPrev,
  onTogglePin,
  onShare,
  onDrinkPenalty,
  canGoBack,
  isPinned,
}: CardControlsProps) {
  return (
    <div className="w-full flex flex-col gap-3">
      {/* Primary Action Button: Next Card & Drink Penalty */}
      <div className="flex gap-2">
        {onDrinkPenalty && (
          <button
            onClick={onDrinkPenalty}
            className="py-4 px-4 rounded-2xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-700 dark:text-amber-300 font-bold text-sm flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer shrink-0 shadow-sm"
            title="Không dám nói hoặc không dám làm? Bấm để nhận hình phạt uống!"
          >
            <Beer className="w-5 h-5 text-amber-500 animate-bounce" />
            <span>Phạt Uống</span>
          </button>
        )}

        <button
          onClick={onNext}
          className="flex-1 py-4 px-5 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-base flex items-center justify-center gap-2 shadow-lg shadow-zinc-900/10 dark:shadow-white/10 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Câu tiếp theo</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* Secondary Actions Row */}
      <div className="grid grid-cols-4 gap-2">
        {/* Back / Prev Button */}
        <button
          onClick={onPrev}
          disabled={!canGoBack}
          className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all ${
            canGoBack
              ? 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 cursor-pointer'
              : 'border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/50 dark:bg-zinc-900/40 text-zinc-400 dark:text-zinc-600 cursor-not-allowed'
          }`}
          title="Xem lại câu trước"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Câu trước</span>
        </button>

        {/* Skip Button */}
        <button
          onClick={onSkip}
          className="py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all cursor-pointer"
          title="Bỏ qua (để dành cuối ván)"
        >
          <FastForward className="w-4 h-4 text-zinc-500" />
          <span>Bỏ qua</span>
        </button>

        {/* Pin / Bookmark Button */}
        <button
          onClick={onTogglePin}
          className={`py-3 rounded-xl border flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all active:scale-95 cursor-pointer ${
            isPinned
              ? 'border-rose-300 dark:border-rose-800 bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'
              : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
          }`}
          title={isPinned ? 'Đã ghim (Bấm để hủy)' : 'Ghim câu hỏi này'}
        >
          <Bookmark
            className={`w-4 h-4 ${
              isPinned ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
            }`}
          />
          <span>{isPinned ? 'Đã ghim' : 'Ghim'}</span>
        </button>

        {/* Share / Copy Button */}
        <button
          onClick={onShare}
          className="py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 flex flex-col items-center justify-center gap-1 text-xs font-medium transition-all cursor-pointer"
          title="Chia sẻ câu hỏi này"
        >
          <Share2 className="w-4 h-4 text-zinc-500" />
          <span>Sao chép</span>
        </button>
      </div>
    </div>
  );
}
