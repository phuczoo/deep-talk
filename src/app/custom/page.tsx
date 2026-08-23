'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/ui/Header';
import { AddQuestionForm } from '@/components/custom/AddQuestionForm';
import { Toast } from '@/components/ui/Toast';
import { Question, PackId } from '@/types';
import { PACKS, LEVEL_INFO } from '@/data/packs';
import { getCustomQuestions, removeCustomQuestion } from '@/lib/storage';
import { Trash2, PlusCircle, Sparkles, UserCheck } from 'lucide-react';

export default function CustomQuestionsPage() {
  const [customList, setCustomList] = useState<Question[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<PackId | 'all'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadQuestions = () => {
    setCustomList(getCustomQuestions());
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  const handleQuestionAdded = () => {
    loadQuestions();
    setToastMessage('Đã thêm câu hỏi vào bộ thành công! 🎉');
  };

  const handleRemove = (id: string) => {
    removeCustomQuestion(id);
    loadQuestions();
    setToastMessage('Đã xóa câu hỏi tùy chỉnh.');
  };

  const filteredList =
    selectedFilter === 'all'
      ? customList
      : customList.filter((item) => item.pack === selectedFilter);

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header
        showBack
        backHref="/"
        title="Câu Hỏi Tự Tạo"
        subtitle={`${customList.length} câu hỏi của bạn`}
      />

      <main className="flex-1 px-4 py-5 flex flex-col gap-6 max-w-md mx-auto w-full pb-10">
        {/* Form to Add New Question */}
        <AddQuestionForm onAdded={handleQuestionAdded} />

        {/* Existing Custom Questions List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-purple-500" />
              <span>Danh sách câu hỏi của bạn ({customList.length})</span>
            </h3>
          </div>

          {/* Filter Pills */}
          {customList.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedFilter === 'all'
                    ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                    : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                Tất cả ({customList.length})
              </button>
              {PACKS.map((p) => {
                const count = customList.filter((item) => item.pack === p.id).length;
                if (count === 0) return null;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedFilter(p.id)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

          {filteredList.length === 0 ? (
            <div className="p-6 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 text-center text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
              <p>Chưa có câu hỏi tự tạo nào ở mục này.</p>
              <p className="text-[11px] text-zinc-400">
                Hãy dùng form phía trên để thêm những câu hỏi mang đậm dấu ấn riêng của bạn/nhóm nhé!
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {filteredList.map((item) => {
                const pack = PACKS.find((p) => p.id === item.pack) || PACKS[0];
                const level = LEVEL_INFO[item.level] || LEVEL_INFO[1];

                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${pack.color.badge}`}>
                          {pack.name}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold border ${level.bgBadge}`}>
                          Cấp {item.level}: {level.name}
                        </span>
                      </div>

                      <button
                        onClick={() => handleRemove(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Xóa câu hỏi này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      &ldquo;{item.question}&rdquo;
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Toast popup */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
}
