'use client';

import React, { useState } from 'react';
import { PackId, QuestionLevel } from '@/types';
import { PACKS, LEVEL_INFO } from '@/data/packs';
import { addCustomQuestion } from '@/lib/storage';
import { PlusCircle, Sparkles } from 'lucide-react';

interface AddQuestionFormProps {
  initialPack?: PackId;
  onAdded: () => void;
}

export function AddQuestionForm({
  initialPack = 'couple',
  onAdded,
}: AddQuestionFormProps) {
  const [pack, setPack] = useState<PackId>(initialPack);
  const [level, setLevel] = useState<QuestionLevel>(1);
  const [questionText, setQuestionText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;

    setIsSubmitting(true);
    addCustomQuestion({
      pack,
      level,
      question: questionText.trim(),
    });

    setQuestionText('');
    setIsSubmitting(false);
    onAdded();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-4"
    >
      <div className="flex items-center gap-2 pb-2 border-b border-zinc-100 dark:border-zinc-800">
        <Sparkles className="w-4 h-4 text-rose-500" />
        <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
          Thêm Câu Hỏi Riêng Của Bạn
        </h3>
      </div>

      {/* Select Pack */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Chọn bộ chủ đề
        </label>
        <div className="grid grid-cols-2 gap-2">
          {PACKS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setPack(p.id)}
              className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                pack === p.id
                  ? 'border-zinc-900 dark:border-white bg-zinc-900 text-white dark:bg-white dark:text-zinc-900'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Select Level */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Chọn cấp độ sâu
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {([1, 2, 3] as QuestionLevel[]).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setLevel(lvl)}
              className={`py-2 px-1 rounded-xl border text-center text-xs font-semibold transition-all cursor-pointer ${
                level === lvl
                  ? 'border-rose-500 bg-rose-500 text-white'
                  : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              Cấp {lvl}: {LEVEL_INFO[lvl].name}
            </button>
          ))}
        </div>
      </div>

      {/* Question Text */}
      <div>
        <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-1.5">
          Nội dung câu hỏi
        </label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          placeholder="Ví dụ: Một thói quen kỳ quặc nhưng đáng yêu của bạn là gì?..."
          rows={3}
          required
          className="w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-white transition-all resize-none"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!questionText.trim() || isSubmitting}
        className="w-full py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-100 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99] transition-all cursor-pointer"
      >
        <PlusCircle className="w-4 h-4" />
        <span>Lưu câu hỏi vào bộ {PACKS.find((p) => p.id === pack)?.name}</span>
      </button>
    </form>
  );
}
