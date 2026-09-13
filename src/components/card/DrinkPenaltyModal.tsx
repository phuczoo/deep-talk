'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Beer, X, ArrowRight, RotateCw, Sparkles } from 'lucide-react';

import { DrinkIntensity } from '@/types';

const PENALTIES_BY_INTENSITY = {
  soft: [
    {
      title: 'Trà Sữa / Nước Ngọt',
      drink: '🥤 Uống 1 ngụm trà sữa / nước ngọt lớn!',
      desc: 'Ngọt ngào thế này thì ngại ngùng gì nữa, uống ngay 1 ngụm rồi chuyền máy nhé!',
    },
    {
      title: 'Ăn Vặt Chuộc Tội',
      drink: '🍿 Ăn 1 miếng snack hoặc đồ ăn vặt!',
      desc: 'Tự tay đút cho mình hoặc nhờ người đối diện đút 1 miếng ăn vặt!',
    },
    {
      title: 'Tập Thể Lực',
      drink: '💪 Hít đất hoặc thụt dầu 5 cái!',
      desc: 'Không uống thì vận động tí cho tỉnh táo nào!',
    },
    {
      title: 'Thẻ Miễn Phạt',
      drink: '👑 May Mắn: Được Miễn Phạt!',
      desc: 'Bạn được tha bổng lần này, nhưng lần sau nhất định phải trả lời nhé!',
    },
    {
      title: 'Uống Bằng Ống Hút',
      drink: '🧃 Hút cạn 1 hơi bằng ống hút!',
      desc: 'Hút một hơi thật dài không ngừng nghỉ trong 5 giây!',
    },
  ],
  medium: [
    {
      title: 'Phạt Nhẹ Nhàng',
      drink: '🍺 Uống 1 ngụm/hớp bia!',
      desc: 'Uống một ngụm để lấy lại bình tĩnh rồi chuyền máy nhé!',
    },
    {
      title: 'Cặp Đôi Đồng Điệu',
      drink: '🍻 Uống 2 hớp cùng người bên tay phải!',
      desc: 'Có phúc cùng hưởng, có bia cùng cạn!',
    },
    {
      title: 'Giao Bôi Thắm Thiết',
      drink: '🥂 Uống giao bôi 1 ngụm cùng đối phương!',
      desc: 'Khoác tay và uống giao bôi 1 ngụm thật tình cảm.',
    },
    {
      title: 'Thẻ Kim Bài May Mắn',
      drink: '👑 Bạn ĐƯỢC MIỄN UỐNG!',
      desc: 'Nhưng chỉ định 1 người bất kỳ trong bàn phải uống thay bạn 1 hớp!',
    },
    {
      title: 'Tay Trái Khó Đỡ',
      drink: '🍺 Uống 1 ngụm bằng tay không thuận!',
      desc: 'Không được dùng tay thuận, ai làm đổ phạt thêm 1 ngụm.',
    },
  ],
  hard: [
    {
      title: 'Đối Đầu Kịch Tính',
      drink: '🥃 Cạn NỬA LY cùng người đối diện!',
      desc: 'Nhìn thẳng vào mắt người đối diện và cạn nửa ly không chớp mắt!',
    },
    {
      title: 'Chiến Thần Bàn Nhậu',
      drink: '🔥 Cạn 1 CHÉN RƯỢU / CẠN LY BIA!',
      desc: 'Dũng cảm lên chiến thần, không nói là phải cạn ly!',
    },
    {
      title: 'Phạt Kép Bất Ổn',
      drink: '🍻 Uống 3 hớp lớn liên tiếp!',
      desc: 'Tội ngại ngùng xứng đáng bị cả bàn phạt kép!',
    },
    {
      title: 'Uống Không Cầm Ly',
      drink: '🍺 Uống cạn 1 ngụm không dùng 2 tay!',
      desc: 'Nhờ người bên cạnh bưng ly cho uống hoặc ghé mồm tự uống.',
    },
    {
      title: 'Cả Bàn Cùng Cháy',
      drink: '🔥 CẢ BÀN CÙNG CẠN NỬA LY!',
      desc: '1, 2, 3... ZÔ! Không ai được thoát nạn trong ván này!',
    },
  ],
};

interface DrinkPenaltyModalProps {
  isOpen: boolean;
  drinkIntensity?: DrinkIntensity;
  onClose: () => void;
  onAcceptAndNext: () => void;
}

export function DrinkPenaltyModal({
  isOpen,
  drinkIntensity = 'medium',
  onClose,
  onAcceptAndNext,
}: DrinkPenaltyModalProps) {
  const list = PENALTIES_BY_INTENSITY[drinkIntensity] || PENALTIES_BY_INTENSITY.medium;
  const [penalty, setPenalty] = useState(list[0]);

  const rollRandomPenalty = () => {
    const activeList = PENALTIES_BY_INTENSITY[drinkIntensity] || PENALTIES_BY_INTENSITY.medium;
    const randomIndex = Math.floor(Math.random() * activeList.length);
    setPenalty(activeList[randomIndex]);
  };

  useEffect(() => {
    if (isOpen) {
      rollRandomPenalty();
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        console.log('confetti error', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm rounded-3xl p-6 bg-gradient-to-b from-zinc-900 via-zinc-900 to-amber-950/40 border border-amber-500/30 text-white shadow-2xl flex flex-col items-center text-center space-y-4 animate-in zoom-in-95 duration-200">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Big Beer Icon with Glow */}
        <div className="relative">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/20 animate-bounce">
            <Beer className="w-10 h-10" />
          </div>
          <Sparkles className="w-6 h-6 text-amber-300 absolute -top-2 -right-2 animate-spin duration-1000" />
        </div>

        {/* Title & Tag */}
        <div className="space-y-1">
          <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            {penalty.title}
          </span>
          <h3 className="text-2xl font-black text-amber-400 tracking-tight pt-2">
            {penalty.drink}
          </h3>
          <p className="text-xs text-zinc-300 leading-relaxed px-2">
            {penalty.desc}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-2 pt-2">
          <button
            onClick={onAcceptAndNext}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 font-bold text-sm text-zinc-950 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 active:scale-[0.98] transition-all cursor-pointer"
          >
            <span>Đã uống xong! (Qua câu)</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex gap-2 w-full">
            <button
              onClick={rollRandomPenalty}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>Đổi hình phạt</span>
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 text-xs font-semibold transition-colors cursor-pointer"
            >
              <span>Để tôi suy nghĩ lại</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
