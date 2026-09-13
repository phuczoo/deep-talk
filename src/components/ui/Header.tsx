'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Bookmark,
  PlusCircle,
  ArrowLeft,
  Volume2,
  VolumeX,
  Users,
} from 'lucide-react';
import { getPinnedQuestions } from '@/lib/storage';
import { isSoundMuted, setSoundMuted, playFlipSound, vibrateLight } from '@/lib/sound';

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
  subtitle?: string;
  onOpenPlayers?: () => void;
  playerCount?: number;
}

export function Header({
  showBack = false,
  backHref = '/',
  title,
  subtitle,
  onOpenPlayers,
  playerCount = 0,
}: HeaderProps) {
  const [pinnedCount, setPinnedCount] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    // Initial fetch
    setPinnedCount(getPinnedQuestions().length);
    setIsMuted(isSoundMuted());

    // Listen to storage & sound events
    const handleStorage = () => {
      setPinnedCount(getPinnedQuestions().length);
    };
    const handleSoundChange = () => {
      setIsMuted(isSoundMuted());
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('chuyen_tro_sound_change', handleSoundChange);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('chuyen_tro_sound_change', handleSoundChange);
    };
  }, []);

  const handleToggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    setSoundMuted(next);
    if (!next) {
      playFlipSound();
    }
    vibrateLight();
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200/80 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {showBack ? (
            <Link
              href={backHref}
              className="inline-flex items-center justify-center w-9 h-9 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-95"
              aria-label="Quay lại"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : (
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white shadow-sm shadow-rose-500/20 group-hover:scale-105 transition-transform">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight leading-tight text-zinc-900 dark:text-zinc-50">
                  Chuyện Trò
                </span>
                <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 leading-none">
                  Deep Talk Card Game
                </span>
              </div>
            </Link>
          )}

          {title && (
            <div className="ml-1 flex flex-col truncate max-w-[170px] xs:max-w-[200px]">
              <h1 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight truncate">
                {title}
              </h1>
              {subtitle && (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right action controls */}
        <div className="flex items-center gap-1">
          {/* Sound Mute Toggle Button */}
          <button
            type="button"
            onClick={handleToggleSound}
            className={`p-2 rounded-full border transition-colors active:scale-95 cursor-pointer ${
              isMuted
                ? 'border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-800/60 text-zinc-400 hover:text-zinc-300'
                : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
            }`}
            title={isMuted ? 'Bật âm thanh & rung' : 'Tắt âm thanh'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Players Drawer Trigger (if supported) */}
          {onOpenPlayers && (
            <button
              type="button"
              onClick={onOpenPlayers}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200/60 dark:border-indigo-800/60 transition-colors active:scale-95 cursor-pointer"
              title="Quản lý người chơi & vòng quay"
            >
              <Users className="w-3.5 h-3.5" />
              <span>{playerCount > 0 ? playerCount : 'Người'}</span>
            </button>
          )}

          {/* Add custom question link */}
          <Link
            href="/custom"
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-95"
            title="Thêm câu hỏi riêng"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden sm:inline">Thêm</span>
          </Link>

          {/* Saved questions */}
          <Link
            href="/saved"
            className="relative inline-flex items-center gap-1 px-2 py-1.5 rounded-full text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors active:scale-95"
            title="Câu đã ghim"
          >
            <Bookmark className="w-3.5 h-3.5 fill-rose-500/20" />
            <span className="hidden sm:inline">Ghim</span>
            {pinnedCount > 0 && (
              <span className="inline-flex items-center justify-center min-w-4 h-4 px-1 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                {pinnedCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
