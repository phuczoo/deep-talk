'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Header } from '@/components/ui/Header';
import { Toast } from '@/components/ui/Toast';
import { PinnedQuestion, PackId } from '@/types';
import { PACKS, LEVEL_INFO } from '@/data/packs';
import { getPinnedQuestions, removePinnedQuestion } from '@/lib/storage';
import { Bookmark, Trash2, Copy, Play, Sparkles } from 'lucide-react';

export default function SavedPage() {
  const [pinnedList, setPinnedList] = useState<PinnedQuestion[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<PackId | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadPinned = () => {
    setPinnedList(getPinnedQuestions());
  };

  useEffect(() => {
    loadPinned();
  }, []);

  const handleRemove = (id: string) => {
    removePinnedQuestion(id);
    loadPinned();
    setToastMessage('Đã bỏ ghim câu hỏi.');
  };

  const handleCopy = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setToastMessage('Đã sao chép câu hỏi vào bộ nhớ tạm! ✨');
    }
  };

  const filteredList =
    selectedFilter === 'all'
      ? pinnedList
      : pinnedList.filter((item) => item.question.pack === selectedFilter);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header
        showBack
        backHref="/"
        title="Câu Hỏi Đã Ghim"
        subtitle={`${pinnedList.length} câu đã lưu`}
      />

      <main className="flex-1 px-4 py-5 flex flex-col gap-4 max-w-md mx-auto w-full pb-10">
        {/* Filter Pills */}
        {pinnedList.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            <button
              onClick={() => setSelectedFilter('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                selectedFilter === 'all'
                  ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
              }`}
            >
              Tất cả ({pinnedList.length})
            </button>
            {PACKS.map((p) => {
              const count = pinnedList.filter((item) => item.question.pack === p.id).length;
              if (count === 0) return null;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelectedFilter(p.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    selectedFilter === p.id
                      ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                      : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                  }`}
                >
                  {p.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* List of Pinned Cards */}
        {filteredList.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4 my-auto">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/10 text-rose-500 flex items-center justify-center border border-rose-500/20">
              <Bookmark className="w-8 h-8 fill-rose-500/20" />
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">
                Chưa có câu hỏi nào được ghim
              </h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-xs">
                Khi chơi, bạn có thể bấm nút <strong>Ghim</strong> để lưu lại những câu hỏi chạm đến cảm xúc hoặc những câu trả lời đáng nhớ!
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-xs font-bold shadow-md hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Bắt đầu chơi ngay</span>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredList.map((item) => {
              const pack = PACKS.find((p) => p.id === item.question.pack) || PACKS[0];
              const level = LEVEL_INFO[item.question.level] || LEVEL_INFO[1];

              return (
                <div
                  key={item.question.id}
                  className="p-4 sm:p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-3 transition-all"
                >
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${pack.color.badge}`}>
                        {pack.name}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border ${level.bgBadge}`}>
                        Cấp {item.question.level}
                      </span>
                    </div>

                    <span className="text-[10px] text-zinc-400">
                      {new Date(item.pinnedAt).toLocaleDateString('vi-VN')}
                    </span>
                  </div>

                  {/* Question */}
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100 leading-relaxed">
                    &ldquo;{item.question.question}&rdquo;
                  </p>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-100 dark:border-zinc-800/80">
                    <button
                      onClick={() => handleCopy(item.question.question)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
                      title="Sao chép câu hỏi"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>Sao chép</span>
                    </button>
                    <button
                      onClick={() => handleRemove(item.question.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title="Xóa khỏi mục đã ghim"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Bỏ ghim</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Toast message */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
