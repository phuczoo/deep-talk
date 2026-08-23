'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { PackCard } from '@/components/pack/PackCard';
import { ModeSelector } from '@/components/pack/ModeSelector';
import { PACKS } from '@/data/packs';
import { PackId, GameMode, Question } from '@/types';
import defaultQuestionsData from '@/data/questions.json';
import { getCustomQuestions } from '@/lib/storage';
import { Play, Sparkles, Smartphone, HeartHandshake } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedPack, setSelectedPack] = useState<PackId>('couple');
  const [selectedMode, setSelectedMode] = useState<GameMode>('sequential');
  const [questionCounts, setQuestionCounts] = useState<Record<PackId, number>>({
    couple: 0,
    friends: 0,
    family: 0,
    work: 0,
  });

  // Calculate dynamic question counts per pack (defaults + custom)
  useEffect(() => {
    const counts: Record<PackId, number> = {
      couple: 0,
      friends: 0,
      family: 0,
      work: 0,
    };

    PACKS.forEach((p) => {
      const defaultCount = (defaultQuestionsData as Question[]).filter(
        (q) => q.pack === p.id
      ).length;
      const customCount = getCustomQuestions(p.id).length;
      counts[p.id] = defaultCount + customCount;
    });

    setQuestionCounts(counts);
  }, []);

  const handleStartGame = () => {
    router.push(`/play?pack=${selectedPack}&mode=${selectedMode}`);
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header />

      <main className="flex-1 px-4 py-5 flex flex-col gap-6 max-w-md mx-auto w-full pb-10">
        {/* Intro Hero */}
        <div className="text-center space-y-1.5 pt-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Kết nối sâu sắc qua từng câu chuyện</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
            Hôm nay bạn muốn trò chuyện cùng ai?
          </h1>
          <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400">
            Chọn một chủ đề, ngồi cạnh nhau và bắt đầu chuyền tay chiếc điện thoại.
          </p>
        </div>

        {/* 1. Select Pack */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            1. Chọn bộ chủ đề
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {PACKS.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                isSelected={selectedPack === pack.id}
                questionCount={questionCounts[pack.id] || 0}
                onSelect={() => setSelectedPack(pack.id)}
              />
            ))}
          </div>
        </div>

        {/* 2. Select Mode */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
            2. Chọn cách chơi
          </label>
          <ModeSelector
            mode={selectedMode}
            onSelectMode={(mode) => setSelectedMode(mode)}
          />
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStartGame}
            type="button"
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:opacity-95 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xl shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Play className="w-5 h-5 fill-white" />
            <span>Bắt đầu ván chơi</span>
          </button>
        </div>

        {/* Game Rule / Pass phone tip banner */}
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 text-xs space-y-2 text-zinc-600 dark:text-zinc-400">
          <div className="flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-200">
            <Smartphone className="w-4 h-4 text-emerald-500" />
            <span>Luật chơi chuyền tay đơn giản:</span>
          </div>
          <ul className="space-y-1.5 pl-5 list-disc text-[11px] leading-relaxed">
            <li>Người cầm điện thoại đọc to câu hỏi và chia sẻ câu trả lời của mình.</li>
            <li>Các thành viên còn lại có thể chia sẻ thêm góc nhìn của mình.</li>
            <li>Bấm <strong>Câu tiếp theo</strong> và chuyền máy cho người kế bên.</li>
            <li>Bấm <strong>Ghim</strong> để lưu lại những câu hỏi hoặc câu trả lời ý nghĩa!</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
