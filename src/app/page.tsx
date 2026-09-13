'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { PackCard } from '@/components/pack/PackCard';
import { ModeSelector } from '@/components/pack/ModeSelector';
import { GameCustomizerDrawer } from '@/components/settings/GameCustomizerDrawer';
import { PACKS } from '@/data/packs';
import { PackId, GameMode, Question, GameCustomSettings, PresetMood } from '@/types';
import defaultQuestionsData from '@/data/questions.json';
import { getCustomQuestions } from '@/lib/storage';
import { buildDeck } from '@/lib/deck';
import {
  Play,
  Sparkles,
  Smartphone,
  Beer,
  Sliders,
  Coffee,
  Wine,
  Moon,
  ChevronRight,
  Flame,
  Zap,
} from 'lucide-react';

export default function HomePage() {
  const router = useRouter();
  const [selectedPacks, setSelectedPacks] = useState<PackId[]>(['couple', 'couple_spicy']);
  const [selectedMode, setSelectedMode] = useState<GameMode>('sequential');
  const [enableDarePong, setEnableDarePong] = useState<boolean>(true);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState<boolean>(false);

  const [customSettings, setCustomSettings] = useState<GameCustomSettings>({
    preset: 'date',
    spicyLevel: 60,
    dareRatio: 30,
    levels: [1, 2, 3],
    drinkIntensity: 'medium',
    deckLimit: 0,
  });

  const [questionCounts, setQuestionCounts] = useState<Record<PackId, number>>({
    couple: 0,
    couple_spicy: 0,
    friends: 0,
    friends_spicy: 0,
  });

  // Calculate dynamic question counts per pack (defaults + custom)
  useEffect(() => {
    const counts: Record<PackId, number> = {
      couple: 0,
      couple_spicy: 0,
      friends: 0,
      friends_spicy: 0,
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

  const handleTogglePack = (packId: PackId) => {
    setSelectedPacks((prev) => {
      const next = prev.includes(packId)
        ? prev.filter((id) => id !== packId)
        : [...prev, packId];
      return next;
    });
  };

  const applyPreset = (preset: PresetMood) => {
    switch (preset) {
      case 'cafe':
        setCustomSettings({
          preset: 'cafe',
          spicyLevel: 0,
          dareRatio: 0,
          levels: [1, 2],
          drinkIntensity: 'soft',
          deckLimit: 0,
        });
        setEnableDarePong(false);
        setSelectedPacks((prev) => {
          const cleaned = prev.filter((p) => !p.includes('spicy'));
          return cleaned.length > 0 ? cleaned : ['couple'];
        });
        break;
      case 'date':
        setCustomSettings({
          preset: 'date',
          spicyLevel: 60,
          dareRatio: 30,
          levels: [2, 3],
          drinkIntensity: 'medium',
          deckLimit: 0,
        });
        setEnableDarePong(true);
        setSelectedPacks(['couple', 'couple_spicy']);
        break;
      case 'party':
        setCustomSettings({
          preset: 'party',
          spicyLevel: 60,
          dareRatio: 50,
          levels: [1, 2, 3],
          drinkIntensity: 'hard',
          deckLimit: 0,
        });
        setEnableDarePong(true);
        setSelectedPacks(['friends', 'friends_spicy']);
        break;
      case 'deeptalk':
        setCustomSettings({
          preset: 'deeptalk',
          spicyLevel: 0,
          dareRatio: 0,
          levels: [3],
          drinkIntensity: 'soft',
          deckLimit: 0,
        });
        setEnableDarePong(false);
        setSelectedPacks((prev) => {
          const cleaned = prev.filter((p) => !p.includes('spicy'));
          return cleaned.length > 0 ? cleaned : ['couple'];
        });
        break;
      case 'custom':
        setCustomSettings((prev) => ({ ...prev, preset: 'custom' }));
        break;
    }
  };

  const handleStartGame = () => {
    if (selectedPacks.length === 0) return;
    const params = new URLSearchParams();
    params.set('packs', selectedPacks.join(','));
    params.set('mode', selectedMode);
    params.set('dare', enableDarePong ? '1' : '0');
    params.set('spicy', customSettings.spicyLevel.toString());
    params.set('dareRatio', enableDarePong ? customSettings.dareRatio.toString() : '0');
    params.set('levels', customSettings.levels.join(','));
    params.set('drink', customSettings.drinkIntensity);
    if (customSettings.deckLimit && customSettings.deckLimit > 0) {
      params.set('limit', customSettings.deckLimit.toString());
    }
    router.push(`/play?${params.toString()}`);
  };

  const totalSelectedQuestions = selectedPacks.reduce(
    (acc, id) => acc + (questionCounts[id] || 0),
    0
  );

  const estimatedQuestions = useMemo(() => {
    return buildDeck({
      packIds: selectedPacks,
      mode: selectedMode,
      enableDarePong,
      spicyLevel: customSettings.spicyLevel,
      dareRatio: customSettings.dareRatio,
      selectedLevels: customSettings.levels,
      deckLimit: customSettings.deckLimit || 0,
      shuffle: false,
    }).length;
  }, [selectedPacks, selectedMode, customSettings, enableDarePong]);

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
            Chọn các chủ đề (có thể chọn nhiều), ngồi cạnh nhau và bắt đầu chuyền tay chiếc điện thoại.
          </p>
        </div>

        {/* 1. Select Pack */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
              1. Chọn bộ chủ đề (chọn nhiều)
            </label>
            <span className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
              {selectedPacks.length} bộ đã chọn ({totalSelectedQuestions} câu)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-2.5">
            {PACKS.map((pack) => (
              <PackCard
                key={pack.id}
                pack={pack}
                isSelected={selectedPacks.includes(pack.id)}
                questionCount={questionCounts[pack.id] || 0}
                onSelect={() => handleTogglePack(pack.id)}
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

        {/* 3. Mood Presets & Customizer */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
              <span>3. Không khí & Tùy biến ván chơi</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white uppercase shadow-xs">
                Mới
              </span>
            </label>
            <span className="text-[11px] font-semibold text-rose-500 dark:text-rose-400">
              1-chạm chọn vibe
            </span>
          </div>

          {/* 4 Mood Presets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('cafe')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                customSettings.preset === 'cafe'
                  ? 'border-emerald-500 bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/40 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Coffee className="w-4 h-4 text-emerald-500" />
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  Chill
                </span>
              </div>
              <span className="font-bold text-xs">Cafe Chill</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">0% 18+ • Nhẹ nhàng</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('date')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                customSettings.preset === 'date'
                  ? 'border-rose-500 bg-rose-500/15 text-rose-700 dark:text-rose-300 ring-1 ring-rose-500/40 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Wine className="w-4 h-4 text-rose-500" />
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-500/10 text-rose-600 dark:text-rose-400">
                  Hot
                </span>
              </div>
              <span className="font-bold text-xs">Date Đêm</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">60% 18+ • Đỏ mặt</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('party')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                customSettings.preset === 'party'
                  ? 'border-amber-500 bg-amber-500/15 text-amber-700 dark:text-amber-300 ring-1 ring-amber-500/40 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Beer className="w-4 h-4 text-amber-500" />
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  Say
                </span>
              </div>
              <span className="font-bold text-xs">Bàn Nhậu</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">50% Dare • Cạn ly</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('deeptalk')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                customSettings.preset === 'deeptalk'
                  ? 'border-purple-500 bg-purple-500/15 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/40 shadow-sm'
                  : 'border-zinc-200 dark:border-zinc-800/90 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700 text-zinc-700 dark:text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className="w-4 h-4 text-purple-500" />
                <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                  Sâu
                </span>
              </div>
              <span className="font-bold text-xs">Deep Talk</span>
              <span className="text-[10px] text-zinc-400 dark:text-zinc-500">100% Cấp 3 • Sâu sắc</span>
            </button>
          </div>

          {/* Trigger Card: Customizer Drawer Button */}
          <button
            type="button"
            onClick={() => setIsCustomizerOpen(true)}
            className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-rose-500/10 via-purple-500/10 to-amber-500/10 dark:from-rose-950/40 dark:via-purple-950/30 dark:to-amber-950/30 border border-rose-400/40 dark:border-rose-500/30 hover:border-rose-500/70 transition-all flex items-center justify-between group shadow-sm cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-rose-500 to-amber-500 text-white shadow-md shadow-rose-500/25 group-hover:scale-105 transition-transform">
                <Sliders className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="font-black text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                    Tùy Chỉnh Chi Tiết Ván Chơi
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                    {customSettings.preset !== 'custom' ? customSettings.preset : 'Gu riêng'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                  <span className="inline-flex items-center gap-0.5 text-rose-600 dark:text-rose-400 font-semibold">
                    <Flame className="w-3 h-3" />
                    Cay {customSettings.spicyLevel}%
                  </span>
                  <span>•</span>
                  <span className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-semibold">
                    <Zap className="w-3 h-3" />
                    {enableDarePong ? `${customSettings.dareRatio}% Dare` : 'Tắt Dare'}
                  </span>
                  <span>•</span>
                  <span>Cấp {customSettings.levels.join(',')}</span>
                  <span>•</span>
                  <span className="capitalize">
                    {customSettings.drinkIntensity === 'soft' ? '🥤 Phạt nhẹ' : customSettings.drinkIntensity === 'medium' ? '🍺 Vừa phải' : '🥃 Chiến thần'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-xs font-bold text-rose-600 dark:text-rose-400 group-hover:translate-x-0.5 transition-transform shrink-0 pl-2">
              <span className="hidden xs:inline">Chỉnh gu</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        </div>

        {/* 4. Dare Pong & Drink Penalty Toggle */}
        <div className="p-3.5 rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-transparent flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-500 border border-amber-500/30 shrink-0">
              <Beer className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100">
                <span>Chế độ Dare Pong & Phạt Uống</span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-amber-500 text-zinc-950 uppercase">
                  Hot
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Kèm thử thách hành động đỏ mặt & nút phạt uống
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setEnableDarePong(!enableDarePong)}
            className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 shrink-0 ${
              enableDarePong ? 'bg-amber-500' : 'bg-zinc-300 dark:bg-zinc-700'
            }`}
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                enableDarePong ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Start Button */}
        <div className="pt-2">
          <button
            onClick={handleStartGame}
            disabled={selectedPacks.length === 0}
            type="button"
            className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-2.5 shadow-xl transition-all ${
              selectedPacks.length > 0
                ? 'bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:opacity-95 text-white shadow-rose-500/25 active:scale-[0.98] cursor-pointer'
                : 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 dark:text-zinc-600 shadow-none cursor-not-allowed'
            }`}
          >
            <Play className={`w-5 h-5 ${selectedPacks.length > 0 ? 'fill-white' : 'fill-zinc-400 dark:fill-zinc-600'}`} />
            <span>
              {selectedPacks.length > 0
                ? `Bắt đầu ván chơi (~${estimatedQuestions} câu) 🔥`
                : 'Vui lòng chọn ít nhất 1 bộ chủ đề'}
            </span>
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

      {/* Game Customizer Drawer (Bottom-sheet) */}
      <GameCustomizerDrawer
        isOpen={isCustomizerOpen}
        selectedPacks={selectedPacks}
        enableDarePong={enableDarePong}
        settings={customSettings}
        onClose={() => setIsCustomizerOpen(false)}
        onChangeSettings={(newSettings) => setCustomSettings(newSettings)}
        onStartGame={() => {
          setIsCustomizerOpen(false);
          handleStartGame();
        }}
      />
    </div>
  );
}
