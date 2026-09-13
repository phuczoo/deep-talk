'use client';

import React, { useMemo } from 'react';
import { GameCustomSettings, PresetMood, QuestionLevel, DrinkIntensity, Question } from '@/types';
import defaultQuestionsData from '@/data/questions.json';
import {
  X,
  Flame,
  Zap,
  Layers,
  Beer,
  Sparkles,
  Sliders,
  Wine,
  Coffee,
  Moon,
  Check,
} from 'lucide-react';

interface GameCustomizerDrawerProps {
  isOpen: boolean;
  settings: GameCustomSettings;
  onClose: () => void;
  onChangeSettings: (settings: GameCustomSettings) => void;
  onStartGame: () => void;
}

export function GameCustomizerDrawer({
  isOpen,
  settings,
  onClose,
  onChangeSettings,
  onStartGame,
}: GameCustomizerDrawerProps) {
  // Preset definitions
  const applyPreset = (preset: PresetMood) => {
    switch (preset) {
      case 'cafe':
        onChangeSettings({
          preset: 'cafe',
          spicyLevel: 0,
          dareRatio: 0,
          levels: [1, 2],
          drinkIntensity: 'soft',
          deckLimit: 30,
        });
        break;
      case 'date':
        onChangeSettings({
          preset: 'date',
          spicyLevel: 60,
          dareRatio: 30,
          levels: [2, 3],
          drinkIntensity: 'medium',
          deckLimit: 35,
        });
        break;
      case 'party':
        onChangeSettings({
          preset: 'party',
          spicyLevel: 60,
          dareRatio: 50,
          levels: [1, 2, 3],
          drinkIntensity: 'hard',
          deckLimit: 45,
        });
        break;
      case 'deeptalk':
        onChangeSettings({
          preset: 'deeptalk',
          spicyLevel: 0,
          dareRatio: 0,
          levels: [3],
          drinkIntensity: 'soft',
          deckLimit: 30,
        });
        break;
      case 'custom':
        onChangeSettings({
          ...settings,
          preset: 'custom',
        });
        break;
    }
  };

  // Toggle a level on/off
  const toggleLevel = (lvl: QuestionLevel) => {
    let nextLevels = settings.levels.includes(lvl)
      ? settings.levels.filter((l) => l !== lvl)
      : [...settings.levels, lvl];
    if (nextLevels.length === 0) nextLevels = [lvl]; // keep at least 1
    onChangeSettings({
      ...settings,
      preset: 'custom',
      levels: nextLevels.sort(),
    });
  };

  // Real-time estimated matched cards
  const estimatedCardCount = useMemo(() => {
    const questions = defaultQuestionsData as Question[];
    let filtered = questions.filter((q) => settings.levels.includes(q.level));

    // Spicy filter
    if (settings.spicyLevel === 0) {
      filtered = filtered.filter((q) => !q.pack.includes('spicy'));
    } else if (settings.spicyLevel === 100) {
      filtered = filtered.filter((q) => q.pack.includes('spicy'));
    }

    // Dare ratio filter
    if (settings.dareRatio === 0) {
      filtered = filtered.filter((q) => q.type !== 'dare');
    } else if (settings.dareRatio === 100) {
      filtered = filtered.filter((q) => q.type === 'dare');
    }

    const available = filtered.length;
    if (settings.deckLimit && settings.deckLimit > 0) {
      return Math.min(available, settings.deckLimit);
    }
    return available;
  }, [settings]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      {/* Tap outside to close backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Bottom Sheet Modal */}
      <div className="relative w-full max-w-lg mx-auto max-h-[90vh] bg-zinc-950 text-white border-t border-zinc-800 rounded-t-[32px] p-5 pb-8 shadow-2xl flex flex-col gap-5 overflow-y-auto animate-in slide-in-from-bottom duration-300 scrollbar-thin">
        {/* Grab indicator */}
        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mx-auto -mt-1 shrink-0" />

        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 border border-rose-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-zinc-100 tracking-tight flex items-center gap-1.5">
                <span>Setup Ván Chơi Theo Gu</span>
                <Sparkles className="w-4 h-4 text-amber-400" />
              </h3>
              <p className="text-xs text-zinc-400">Tùy biến độ cay, thử thách & luật uống</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. Quick Presets Bar */}
        <div className="space-y-2">
          <label className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1">
            <span>Chọn nhanh theo tâm trạng (Mood Presets)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => applyPreset('cafe')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                settings.preset === 'cafe'
                  ? 'border-emerald-500/80 bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Coffee className="w-4 h-4 text-emerald-400" />
                {settings.preset === 'cafe' && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </div>
              <span className="font-bold text-xs">Cafe Chill</span>
              <span className="text-[10px] text-zinc-400">0% 18+ • Lành mạnh</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('date')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                settings.preset === 'date'
                  ? 'border-rose-500/80 bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Wine className="w-4 h-4 text-rose-400" />
                {settings.preset === 'date' && <Check className="w-3.5 h-3.5 text-rose-400" />}
              </div>
              <span className="font-bold text-xs">Date Đêm</span>
              <span className="text-[10px] text-zinc-400">60% 18+ • Đỏ mặt</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('party')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                settings.preset === 'party'
                  ? 'border-amber-500/80 bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Beer className="w-4 h-4 text-amber-400" />
                {settings.preset === 'party' && <Check className="w-3.5 h-3.5 text-amber-400" />}
              </div>
              <span className="font-bold text-xs">Bàn Nhậu</span>
              <span className="text-[10px] text-zinc-400">Dare Pong • Quẩy hết</span>
            </button>

            <button
              type="button"
              onClick={() => applyPreset('deeptalk')}
              className={`p-2.5 rounded-2xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                settings.preset === 'deeptalk'
                  ? 'border-purple-500/80 bg-purple-500/15 text-purple-300 ring-1 ring-purple-500/40'
                  : 'border-zinc-800 bg-zinc-900/60 hover:border-zinc-700 text-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <Moon className="w-4 h-4 text-purple-400" />
                {settings.preset === 'deeptalk' && <Check className="w-3.5 h-3.5 text-purple-400" />}
              </div>
              <span className="font-bold text-xs">Deep Talk</span>
              <span className="text-[10px] text-zinc-400">100% Cấp 3 thâm sâu</span>
            </button>
          </div>
        </div>

        {/* 2. Spicy Level Selector */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-rose-500" />
              Độ Cay 18+ (Spiciness)
            </span>
            <span className="text-xs font-black text-rose-400">
              {settings.spicyLevel === 0 && '0% • Trong sáng'}
              {settings.spicyLevel === 30 && '30% • Chớm nhen nhóm'}
              {settings.spicyLevel === 60 && '60% • Nóng bỏng'}
              {settings.spicyLevel === 100 && '100% • Khét lẹt (Hardcore)'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[0, 30, 60, 100].map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    preset: 'custom',
                    spicyLevel: lvl as 0 | 30 | 60 | 100,
                  })
                }
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.spicyLevel === lvl
                    ? 'bg-gradient-to-r from-rose-500 to-red-600 text-white shadow-md shadow-rose-500/25 scale-[1.02]'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400'
                }`}
              >
                {lvl}%
              </button>
            ))}
          </div>
        </div>

        {/* 3. Dare vs Truth Ratio */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" />
              Tỉ Lệ Thử Thách (DARE)
            </span>
            <span className="text-xs font-black text-amber-400">
              {settings.dareRatio === 0 && '0% • Chỉ Nói Thật'}
              {settings.dareRatio === 30 && '30% • Thỉnh thoảng Dare'}
              {settings.dareRatio === 50 && '50% • Chuẩn Dare Pong'}
              {settings.dareRatio === 100 && '100% • Toàn Thử Thách'}
            </span>
          </div>
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[0, 30, 50, 100].map((ratio) => (
              <button
                key={ratio}
                type="button"
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    preset: 'custom',
                    dareRatio: ratio as 0 | 30 | 50 | 100,
                  })
                }
                className={`py-2 px-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  settings.dareRatio === ratio
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-zinc-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                    : 'bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400'
                }`}
              >
                {ratio}%
              </button>
            ))}
          </div>
        </div>

        {/* 4. Question Level Filter */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            Cấp Độ Câu Hỏi (Bỏ bớt cấp nếu muốn)
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { lvl: 1 as QuestionLevel, label: 'Cấp 1: Khởi Động' },
              { lvl: 2 as QuestionLevel, label: 'Cấp 2: Gắn Kết' },
              { lvl: 3 as QuestionLevel, label: 'Cấp 3: Thâm Sâu' },
            ].map((item) => {
              const active = settings.levels.includes(item.lvl);
              return (
                <button
                  key={item.lvl}
                  type="button"
                  onClick={() => toggleLevel(item.lvl)}
                  className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    active
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30 ring-1 ring-indigo-400'
                      : 'bg-zinc-800/60 text-zinc-500 hover:bg-zinc-800'
                  }`}
                >
                  {active && <Check className="w-3.5 h-3.5" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Drinking Penalty Intensity */}
        <div className="space-y-2 p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-200 flex items-center gap-1.5">
            <Beer className="w-4 h-4 text-emerald-400" />
            Cường Độ Phạt Uống
          </span>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { id: 'soft' as DrinkIntensity, label: '🥤 Trà Sữa / Snack', desc: 'Không cồn' },
              { id: 'medium' as DrinkIntensity, label: '🍺 Nhấp Nháp', desc: '1-2 hớp bia' },
              { id: 'hard' as DrinkIntensity, label: '🥃 Chiến Thần', desc: 'Cạn nửa ly/chén' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    preset: 'custom',
                    drinkIntensity: item.id,
                  })
                }
                className={`py-2 px-1.5 rounded-xl text-left flex flex-col gap-0.5 transition-all cursor-pointer ${
                  settings.drinkIntensity === item.id
                    ? 'bg-zinc-100 text-zinc-900 shadow-md font-bold'
                    : 'bg-zinc-800/80 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                <span className="text-xs font-bold">{item.label}</span>
                <span className="text-[10px] opacity-70">{item.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6. Deck Limit */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-zinc-900/80 border border-zinc-800">
          <span className="text-xs font-bold text-zinc-300">Giới hạn thời lượng:</span>
          <div className="flex items-center gap-1.5">
            {[
              { val: 20, label: '20 thẻ' },
              { val: 35, label: '35 thẻ' },
              { val: 0, label: 'Tất cả' },
            ].map((item) => (
              <button
                key={item.val}
                type="button"
                onClick={() =>
                  onChangeSettings({
                    ...settings,
                    preset: 'custom',
                    deckLimit: item.val,
                  })
                }
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  (settings.deckLimit || 0) === item.val
                    ? 'bg-rose-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Counter & Big Action Button */}
        <div className="space-y-2 pt-2">
          <div className="text-center text-xs font-semibold text-zinc-400">
            🃏 Sẽ có khoảng{' '}
            <span className="font-bold text-amber-400">{estimatedCardCount} thẻ bài</span> sẵn sàng
            cho ván này
          </div>

          <button
            type="button"
            onClick={onStartGame}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-600 to-amber-500 hover:opacity-95 text-white font-black text-base flex items-center justify-center gap-2 shadow-xl shadow-rose-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <Sparkles className="w-5 h-5 fill-white" />
            <span>ÁP DỤNG & BẮT ĐẦU CHƠI NGAY 🔥</span>
          </button>
        </div>
      </div>
    </div>
  );
}
