'use client';

import React from 'react';
import { Heart, Sparkles, ShieldCheck } from 'lucide-react';

interface LevelTransitionProps {
  onConfirm: () => void;
}

export function LevelTransition({ onConfirm }: LevelTransitionProps) {
  return (
    <div className="relative w-full aspect-[4/5] max-h-[500px] min-h-[380px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl border border-rose-200 dark:border-rose-900/60 bg-gradient-to-b from-rose-50/90 via-white to-pink-50/70 dark:from-zinc-900 dark:via-zinc-900 dark:to-rose-950/40 text-center animate-in fade-in zoom-in-95 duration-300">
      {/* Top Header */}
      <div className="flex flex-col items-center gap-2">
        <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20 shadow-sm animate-bounce">
          <Heart className="w-6 h-6 fill-rose-500" />
        </div>
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
          <Sparkles className="w-3.5 h-3.5" />
          Chuyển Sang Cấp Độ 3: Thâm Sâu
        </span>
      </div>

      {/* Center Message */}
      <div className="my-auto py-3 space-y-3">
        <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
          Sẵn sàng mở lòng hơn nhé?
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-xs mx-auto">
          Các câu hỏi tiếp theo sẽ đi sâu vào cảm xúc, những trăn trở và suy nghĩ chân thật nhất. Hãy dành cho nhau sự lắng nghe không phán xét.
        </p>
        <div className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400 bg-white/60 dark:bg-zinc-800/60 px-3 py-1.5 rounded-full border border-zinc-200/60 dark:border-zinc-700/60">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Không gian trò chuyện an toàn & chân thành</span>
        </div>
      </div>

      {/* Confirm CTA */}
      <button
        onClick={onConfirm}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-base shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all cursor-pointer"
      >
        Tụi mình đã sẵn sàng! ✨
      </button>
    </div>
  );
}
