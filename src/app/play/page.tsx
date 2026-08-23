'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { QuestionCard } from '@/components/card/QuestionCard';
import { CardControls } from '@/components/card/CardControls';
import { LevelTransition } from '@/components/card/LevelTransition';
import { SessionComplete } from '@/components/card/SessionComplete';
import { Toast } from '@/components/ui/Toast';
import { useCardDeck } from '@/hooks/useCardDeck';
import { PackId, GameMode } from '@/types';
import { PACKS } from '@/data/packs';
import { togglePinQuestion, isQuestionPinned } from '@/lib/storage';

function PlayScreen() {
  const searchParams = useSearchParams();
  const rawPack = searchParams.get('pack') as PackId | null;
  const rawMode = searchParams.get('mode') as GameMode | null;

  const packId: PackId = (rawPack && PACKS.some((p) => p.id === rawPack)) ? rawPack : 'couple';
  const mode: GameMode = rawMode === 'random' ? 'random' : 'sequential';

  const packInfo = PACKS.find((p) => p.id === packId) || PACKS[0];

  const {
    isLoaded,
    currentCard,
    historyStack,
    totalAnsweredCount,
    remainingCount,
    canGoBack,
    isLevelTransition,
    isSessionComplete,
    nextCard,
    skipCard,
    prevCard,
    confirmLevel3Transition,
    restart,
  } = useCardDeck({ packId, mode });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Check pin status for current card
  const isPinned = currentCard ? isQuestionPinned(currentCard.id) : false;

  const handleTogglePin = () => {
    if (!currentCard) return;
    const pinnedNow = togglePinQuestion(currentCard);
    setToastMessage(
      pinnedNow ? 'Đã ghim câu hỏi vào mục Yêu thích! 📌' : 'Đã bỏ ghim câu hỏi 🗑️'
    );
  };

  const handleShare = () => {
    if (!currentCard) return;
    const textToCopy = `"${currentCard.question}"\n— Chuyện Trò (Deep Talk)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToCopy);
      setToastMessage('Đã sao chép câu hỏi vào bộ nhớ tạm! ✨');
    }
  };

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <Header
        showBack
        backHref="/"
        title={packInfo.name}
        subtitle={mode === 'sequential' ? 'Chế độ: Tuần tự' : 'Chế độ: Ngẫu nhiên'}
      />

      <main className="flex-1 px-4 py-5 flex flex-col justify-between max-w-md mx-auto w-full pb-8">
        {!isLoaded ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          </div>
        ) : isSessionComplete ? (
          <SessionComplete
            packId={packId}
            totalAnswered={totalAnsweredCount}
            onRestart={restart}
          />
        ) : isLevelTransition ? (
          <LevelTransition onConfirm={confirmLevel3Transition} />
        ) : currentCard ? (
          <div className="flex-1 flex flex-col justify-between gap-6">
            {/* The Main Flashcard */}
            <div className="flex-1 flex items-center justify-center">
              <QuestionCard
                question={currentCard}
                currentIndex={historyStack.length}
                totalAnswered={totalAnsweredCount}
                remainingCount={remainingCount}
                isPinned={isPinned}
                onTogglePin={handleTogglePin}
              />
            </div>

            {/* Bottom Actions */}
            <div className="w-full">
              <CardControls
                onNext={nextCard}
                onSkip={skipCard}
                onPrev={prevCard}
                onTogglePin={handleTogglePin}
                onShare={handleShare}
                canGoBack={canGoBack}
                isPinned={isPinned}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-center p-6">
            <p className="text-sm text-zinc-500">Chưa có câu hỏi nào trong bộ này.</p>
          </div>
        )}
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

export default function PlayPage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 min-h-screen flex items-center justify-center bg-zinc-50 dark:bg-zinc-950">
          <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
        </div>
      }
    >
      <PlayScreen />
    </Suspense>
  );
}
