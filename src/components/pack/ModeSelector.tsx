'use client';

import React from 'react';
import { GameMode } from '@/types';
import { Layers, Shuffle } from 'lucide-react';

interface ModeSelectorProps {
  mode: GameMode;
  onSelectMode: (mode: GameMode) => void;
}

export function ModeSelector({ mode, onSelectMode }: ModeSelectorProps) {
  return (
    <div className="w-full flex flex-col gap-2">
      <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
        Chế độ chơi
      </label>

      <div className="grid grid-cols-2 gap-2 p-1 rounded-2xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800">
        {/* Sequential Mode */}
        <button
          type="button"
          onClick={() => onSelectMode('sequential')}
          className={`py-2.5 px-3 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
            mode === 'sequential'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-bold border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs">
            <Layers className="w-3.5 h-3.5" />
            <span>Tuần tự</span>
          </div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
            Tăng dần độ sâu (Level 1 $\rightarrow$ 3)
          </span>
        </button>

        {/* Random Mode */}
        <button
          type="button"
          onClick={() => onSelectMode('random')}
          className={`py-2.5 px-3 rounded-xl flex flex-col items-center gap-1 text-center transition-all cursor-pointer ${
            mode === 'random'
              ? 'bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm font-bold border border-zinc-200/60 dark:border-zinc-700'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 font-medium'
          }`}
        >
          <div className="flex items-center gap-1.5 text-xs">
            <Shuffle className="w-3.5 h-3.5" />
            <span>Ngẫu nhiên</span>
          </div>
          <span className="text-[10px] text-zinc-500 dark:text-zinc-400 leading-tight">
            Xáo trộn toàn bộ câu hỏi
          </span>
        </button>
      </div>
    </div>
  );
}
