'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Question } from '@/types';
import { PACKS, LEVEL_INFO } from '@/data/packs';
import { Sparkles, UserCheck, Flame, Heart, Zap, Crown, Eye, EyeOff } from 'lucide-react';
import { DareTimer } from './DareTimer';
import { playSwipeSound, playRevealSound, vibrateLight, vibrateMedium } from '@/lib/sound';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  totalAnswered: number;
  remainingCount: number;
  isPinned: boolean;
  onTogglePin: () => void;
  onNext?: () => void;
  onSkip?: () => void;
  currentPlayer?: string;
  nextPlayer?: string;
}

export function QuestionCard({
  question,
  currentIndex,
  totalAnswered,
  remainingCount,
  isPinned,
  onTogglePin,
  onNext,
  onSkip,
  currentPlayer,
  nextPlayer,
}: QuestionCardProps) {
  const packInfo = PACKS.find((p) => p.id === question.pack) || PACKS[0];
  const levelInfo = LEVEL_INFO[question.level] || LEVEL_INFO[1];

  const levelIcons = {
    1: <Sparkles className="w-3.5 h-3.5 text-emerald-500" />,
    2: <Flame className="w-3.5 h-3.5 text-amber-500" />,
    3: <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500/20" />,
  };

  const isDare = question.type === 'dare';
  const isSpicy = question.pack.includes('spicy');
  const needsReveal = isSpicy || isDare;

  // 1. Secret Reveal state
  const [isRevealed, setIsRevealed] = useState(!needsReveal);

  useEffect(() => {
    setIsRevealed(!needsReveal);
  }, [question.id, needsReveal]);

  const handleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed(true);
    playRevealSound();
    vibrateMedium();
  };

  const handleToggleReveal = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRevealed((prev) => !prev);
    vibrateLight();
  };

  // 2. Tinder-style Swipe Gestures
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [flyDirection, setFlyDirection] = useState<'left' | 'right' | null>(null);
  const startPos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Avoid triggering drag on interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button') || target.closest('.no-swipe')) return;

    setIsDragging(true);
    startPos.current = { x: e.clientX, y: e.clientY };
    setFlyDirection(null);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = (e.clientY - startPos.current.y) * 0.3;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setIsDragging(false);
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const threshold = 85;
    if (dragOffset.x > threshold && onNext) {
      // Swipe Right -> Next
      setFlyDirection('right');
      playSwipeSound();
      vibrateLight();
      setTimeout(() => {
        setFlyDirection(null);
        setDragOffset({ x: 0, y: 0 });
        onNext();
      }, 160);
    } else if (dragOffset.x < -threshold && onSkip) {
      // Swipe Left -> Skip
      setFlyDirection('left');
      playSwipeSound();
      vibrateLight();
      setTimeout(() => {
        setFlyDirection(null);
        setDragOffset({ x: 0, y: 0 });
        onSkip();
      }, 160);
    } else {
      // Spring back to center
      setDragOffset({ x: 0, y: 0 });
    }
  };

  // Dynamic style calculation for smooth card physics
  const getCardStyle = () => {
    if (flyDirection === 'right') {
      return {
        transform: 'translate3d(500px, 0px, 0px) rotate(22deg)',
        opacity: 0,
        transition: 'transform 0.18s ease-out, opacity 0.18s ease-out',
      };
    }
    if (flyDirection === 'left') {
      return {
        transform: 'translate3d(-500px, 0px, 0px) rotate(-22deg)',
        opacity: 0,
        transition: 'transform 0.18s ease-out, opacity 0.18s ease-out',
      };
    }
    if (isDragging) {
      const rotation = dragOffset.x * 0.08;
      return {
        transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0px) rotate(${rotation}deg)`,
        transition: 'none',
        cursor: 'grabbing',
      };
    }
    return {
      transform: 'translate3d(0, 0, 0) rotate(0deg)',
      transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      cursor: 'grab',
    };
  };

  // Opacity of Next vs Skip visual stamps
  const rightStampOpacity = Math.min(1, Math.max(0, (dragOffset.x - 30) / 60));
  const leftStampOpacity = Math.min(1, Math.max(0, (-dragOffset.x - 30) / 60));

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      style={getCardStyle()}
      className={`relative w-full aspect-[4/5] max-h-[520px] min-h-[400px] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-2xl transition-colors duration-200 select-none touch-none ${
        isDare
          ? 'border-2 border-amber-500/60 dark:border-amber-500/50 bg-gradient-to-b from-amber-500/10 via-white to-orange-50/60 dark:from-amber-950/40 dark:via-zinc-900 dark:to-zinc-950 ring-2 ring-amber-500/20'
          : isSpicy
          ? 'border-2 border-rose-500/60 dark:border-rose-500/50 bg-gradient-to-b from-rose-500/10 via-white to-pink-50/60 dark:from-rose-950/40 dark:via-zinc-900 dark:to-zinc-950 ring-2 ring-rose-500/20'
          : 'border border-zinc-200/90 dark:border-zinc-800 bg-gradient-to-b from-white via-zinc-50/50 to-zinc-100/80 dark:from-zinc-900 dark:via-zinc-900/90 dark:to-zinc-950'
      }`}
    >
      {/* Visual Swipe Stamps */}
      {rightStampOpacity > 0 && (
        <div
          style={{ opacity: rightStampOpacity }}
          className="absolute top-8 left-8 z-40 px-4 py-1.5 rounded-2xl border-4 border-emerald-500 bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 font-black text-xl tracking-wider uppercase rotate-[-15deg] shadow-lg shadow-emerald-500/30 pointer-events-none"
        >
          TIẾP THEO ➔
        </div>
      )}

      {leftStampOpacity > 0 && (
        <div
          style={{ opacity: leftStampOpacity }}
          className="absolute top-8 right-8 z-40 px-4 py-1.5 rounded-2xl border-4 border-amber-500 bg-amber-500/20 text-amber-500 dark:text-amber-400 font-black text-xl tracking-wider uppercase rotate-[15deg] shadow-lg shadow-amber-500/30 pointer-events-none"
        >
          BỎ QUA ➔
        </div>
      )}

      {/* Background ambient glow */}
      <div
        className={`absolute -top-10 -right-10 w-48 h-48 rounded-full ${
          isDare
            ? 'bg-gradient-to-br from-amber-500/30 to-orange-500/20'
            : isSpicy
            ? 'bg-gradient-to-br from-rose-500/30 to-pink-500/20'
            : `bg-gradient-to-br ${packInfo.color.gradient}`
        } blur-3xl pointer-events-none opacity-60 dark:opacity-40`}
      />

      {/* Top Bar of Card */}
      <div className="relative z-10 flex items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {/* Dare or Truth badge */}
          {isDare ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black bg-amber-500 text-zinc-950 shadow-sm animate-pulse">
              ⚡ THỬ THÁCH (DARE)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              🗣️ NÓI THẬT
            </span>
          )}

          {/* Pack badge */}
          <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${packInfo.color.badge}`}
          >
            {packInfo.name}
          </span>

          {/* Level badge */}
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${levelInfo.bgBadge}`}
          >
            {levelIcons[question.level]}
            <span>Cấp {question.level}</span>
          </span>

          {/* Custom tag */}
          {question.isCustom && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
              <UserCheck className="w-3 h-3" />
              Tự tạo
            </span>
          )}
        </div>

        {/* Question Counter & Reveal Peek Button */}
        <div className="flex items-center gap-2">
          {needsReveal && (
            <button
              type="button"
              onClick={handleToggleReveal}
              className="no-swipe p-1.5 rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400 transition-colors cursor-pointer"
              title={isRevealed ? 'Che lại' : 'Xem câu hỏi'}
            >
              {isRevealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          )}

          <div className="text-[12px] font-mono font-medium text-zinc-400 dark:text-zinc-500">
            #{totalAnswered + 1}
          </div>
        </div>
      </div>

      {/* Player Turn Banner (if players are configured) */}
      {currentPlayer && (
        <div className="relative z-10 mt-2 py-1.5 px-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-700 dark:text-indigo-300 text-xs font-bold flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-1.5 truncate">
            <Crown className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span className="truncate">Lượt của: <strong className="text-indigo-600 dark:text-indigo-200">{currentPlayer}</strong></span>
          </div>
          {nextPlayer && (
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate pl-2">
              👉 Tiếp: {nextPlayer}
            </span>
          )}
        </div>
      )}

      {/* Center Question Text with Frosted Glass Mist & Dare Timer */}
      <div className="relative z-10 my-auto py-2 flex flex-col justify-center min-h-[140px]">
        {/* Frosted Glass Reveal Overlay */}
        {needsReveal && !isRevealed && (
          <div
            onClick={handleReveal}
            className="absolute inset-0 z-20 rounded-2xl bg-zinc-950/70 dark:bg-black/85 backdrop-blur-xl border border-rose-500/40 dark:border-rose-500/30 flex flex-col items-center justify-center p-5 text-center cursor-pointer group shadow-2xl transition-all"
          >
            <div className="p-3 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 text-rose-400 border border-rose-500/40 mb-2 animate-pulse">
              {isDare ? (
                <Zap className="w-6 h-6 text-amber-400" />
              ) : (
                <Flame className="w-6 h-6 text-rose-500" />
              )}
            </div>
            <span className="font-black text-sm tracking-wide text-zinc-100 group-hover:scale-105 transition-transform flex items-center gap-1.5">
              {isDare ? '⚡ THỬ THÁCH DARE BÍ MẬT' : '🔥 THẺ 18+ NÓNG BỎNG'}
            </span>
            <span className="text-xs text-rose-400 dark:text-rose-300 font-bold mt-1">
              Chạm vào đây để hé mở bí mật ✨
            </span>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-2">
              (Đừng để đối phương nhìn lén trước nhé!)
            </span>
          </div>
        )}

        {/* Question Text */}
        <h2
          className={`text-lg sm:text-2xl font-bold leading-relaxed tracking-tight text-zinc-900 dark:text-zinc-50 text-balance text-left sm:text-center transition-all duration-300 ${
            needsReveal && !isRevealed ? 'blur-md select-none pointer-events-none opacity-40' : ''
          }`}
        >
          &ldquo;{question.question}&rdquo;
        </h2>

        {/* Interactive Dare Countdown Timer */}
        {isDare && isRevealed && (
          <div className="no-swipe pt-2">
            <DareTimer questionText={question.question} />
          </div>
        )}
      </div>

      {/* Bottom Hint */}
      <div className="relative z-10 pt-4 border-t border-zinc-200/60 dark:border-zinc-800/60 flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
        <span className="inline-flex items-center gap-1.5 font-medium truncate">
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isDare ? 'bg-amber-500 animate-ping' : 'bg-emerald-500 animate-pulse'
            }`}
          />
          <span className="truncate">
            {isDare ? 'Làm thử thách hoặc Phạt Uống 🍺' : 'Vuốt phải để Tiếp ➔ • Vuốt trái để Bỏ ➔'}
          </span>
        </span>

        <span className="text-[11px] font-medium text-zinc-400 shrink-0 pl-2">
          Còn {remainingCount} câu
        </span>
      </div>
    </div>
  );
}
