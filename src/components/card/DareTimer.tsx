'use client';

import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { Play, Pause, RotateCcw, Clock, CheckCircle2 } from 'lucide-react';

interface DareTimerProps {
  questionText: string;
}

export function DareTimer({ questionText }: DareTimerProps) {
  // Detect default seconds from question text if present (e.g. "15 giây", "30 giây", "60 giây", "45 giây", "1 phút")
  const detectDefaultSeconds = (): number => {
    if (questionText.includes('15 giây') || questionText.includes('15s')) return 15;
    if (questionText.includes('20 giây') || questionText.includes('20s')) return 20;
    if (questionText.includes('30 giây') || questionText.includes('30s')) return 30;
    if (questionText.includes('45 giây') || questionText.includes('45s')) return 45;
    if (questionText.includes('60 giây') || questionText.includes('60s') || questionText.includes('1 phút')) return 60;
    return 30; // default 30s
  };

  const [totalSeconds, setTotalSeconds] = useState<number>(detectDefaultSeconds);
  const [timeLeft, setTimeLeft] = useState<number>(detectDefaultSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset timer when questionText changes
  useEffect(() => {
    const detected = detectDefaultSeconds();
    setTotalSeconds(detected);
    setTimeLeft(detected);
    setIsRunning(false);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, [questionText]);

  // Countdown interval
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            setIsFinished(true);
            try {
              confetti({
                particleCount: 70,
                spread: 70,
                origin: { y: 0.6 },
              });
            } catch (e) {
              console.log('Confetti failed', e);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFinished) {
      handleReset(e);
      setIsRunning(true);
    } else {
      setIsRunning(!isRunning);
    }
  };

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setIsFinished(false);
    setTimeLeft(totalSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleSelectPreset = (seconds: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsRunning(false);
    setIsFinished(false);
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Progress percentage
  const progress = totalSeconds > 0 ? ((totalSeconds - timeLeft) / totalSeconds) * 100 : 0;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="w-full mt-3 p-3 rounded-2xl bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 flex flex-col gap-2.5 transition-all"
    >
      <div className="flex items-center justify-between">
        {/* Timer Display */}
        <div className="flex items-center gap-2">
          <Clock className={`w-4 h-4 ${isRunning ? 'text-amber-500 animate-spin' : 'text-amber-600 dark:text-amber-400'}`} />
          <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200">
            Đếm ngược:
          </span>
          <span
            className={`text-base font-black font-mono tracking-tight ${
              isFinished
                ? 'text-emerald-500'
                : timeLeft <= 5 && isRunning
                ? 'text-rose-500 animate-pulse'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {timeLeft}s
          </span>

          {isFinished && (
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Xong!
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1 transition-all active:scale-95 cursor-pointer shadow-sm ${
              isRunning
                ? 'bg-amber-500 text-zinc-950 hover:bg-amber-600'
                : 'bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:opacity-90'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>{isFinished ? 'Lại' : 'Bắt đầu'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 rounded-xl bg-white/60 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-700 transition-colors cursor-pointer"
            title="Đặt lại thời gian"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${
            isFinished
              ? 'bg-emerald-500'
              : timeLeft <= 5
              ? 'bg-rose-500'
              : 'bg-gradient-to-r from-amber-500 to-orange-500'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset Pills */}
      <div className="flex items-center gap-1.5 text-[10px] font-medium text-zinc-500 dark:text-zinc-400">
        <span>Chọn mốc:</span>
        {[15, 30, 45, 60].map((sec) => (
          <button
            key={sec}
            type="button"
            onClick={(e) => handleSelectPreset(sec, e)}
            className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
              totalSeconds === sec
                ? 'bg-amber-500/30 text-amber-800 dark:text-amber-200 font-bold border border-amber-500/40'
                : 'bg-zinc-100 dark:bg-zinc-800/80 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-600 dark:text-zinc-400'
            }`}
          >
            {sec}s
          </button>
        ))}
      </div>
    </div>
  );
}
