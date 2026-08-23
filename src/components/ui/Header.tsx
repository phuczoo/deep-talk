'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, Bookmark, PlusCircle, ArrowLeft } from 'lucide-react';
import { getPinnedQuestions } from '@/lib/storage';
import { useEffect, useState } from 'react';

interface HeaderProps {
  showBack?: boolean;
  backHref?: string;
  title?: string;
  subtitle?: string;
}

export function Header({
  showBack = false,
  backHref = '/',
  title,
  subtitle,
}: HeaderProps) {
  const [pinnedCount, setPinnedCount] = useState<number>(0);

  useEffect(() => {
    // Initial fetch
    setPinnedCount(getPinnedQuestions().length);

    // Listen to storage events across tabs or local updates
    const handleStorage = () => {
      setPinnedCount(getPinnedQuestions().length);
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

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
            <div className="ml-1 flex flex-col">
              <h1 className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 leading-tight">
                {title}
              </h1>
              {subtitle && (
                <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                  {subtitle}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Right action links */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/custom"
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-zinc-700 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors active:scale-95"
            title="Thêm câu hỏi riêng"
          >
            <PlusCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
            <span className="hidden xs:inline">Thêm câu</span>
          </Link>

          <Link
            href="/saved"
            className="relative inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition-colors active:scale-95"
            title="Câu đã ghim"
          >
            <Bookmark className="w-3.5 h-3.5 fill-rose-500/20" />
            <span className="hidden xs:inline">Đã ghim</span>
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
