'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { Trophy, Bookmark, RotateCcw, LayoutGrid, Heart } from 'lucide-react';
import { PackId } from '@/types';
import { PACKS } from '@/data/packs';

interface SessionCompleteProps {
  packIds: PackId[];
  totalAnswered: number;
  onRestart: () => void;
}

export function SessionComplete({
  packIds,
  totalAnswered,
  onRestart,
}: SessionCompleteProps) {
  const packNames = packIds
    .map((pid) => PACKS.find((p) => p.id === pid)?.name)
    .filter(Boolean)
    .join(', ');

  useEffect(() => {
    // Fire confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      console.log('Confetti failed gracefully', e);
    }
  }, []);

  return (
    <div className="w-full flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-300">
      {/* Celebration Card */}
      <div className="relative w-full aspect-[4/5] max-h-[460px] min-h-[360px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-xl border border-zinc-200/90 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/70 to-zinc-100 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-950">
        <div className="flex flex-col items-center gap-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-sm">
            <Trophy className="w-7 h-7" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
            Hoàn Thành Phiên Trò Chuyện
          </span>
        </div>

        <div className="my-auto py-2 space-y-2 max-w-xs">
          <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            Bạn đã đi hết bộ câu hỏi! 🎉
          </h3>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Tuyệt vời! Các bạn đã cùng nhau đi qua{' '}
            <span className="font-bold text-zinc-900 dark:text-zinc-100">
              {totalAnswered} câu hỏi
            </span>{' '}
            chủ đề <span className="font-semibold text-rose-500">{packNames}</span> và có những phút giây thấu hiểu đáng nhớ.
          </p>
        </div>

        {/* Shortcut to Pinned Items */}
        <div className="w-full pt-2">
          <Link
            href="/saved"
            className="w-full py-3 px-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/80 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors"
          >
            <Bookmark className="w-4 h-4 fill-rose-500/20" />
            <span>Xem lại các câu hỏi đã ghim trong ván</span>
          </Link>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onRestart}
          className="py-3.5 px-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 transition-all shadow-sm cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 text-zinc-500" />
          <span>Chơi lại bộ này</span>
        </button>

        <Link
          href="/"
          className="py-3.5 px-4 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-xs flex items-center justify-center gap-2 hover:bg-zinc-800 dark:hover:bg-zinc-100 active:scale-95 transition-all shadow-sm"
        >
          <LayoutGrid className="w-4 h-4" />
          <span>Chọn bộ khác</span>
        </Link>
      </div>
    </div>
  );
}
