'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Header } from '@/components/ui/Header';
import { QuestionCard } from '@/components/card/QuestionCard';
import { CardControls } from '@/components/card/CardControls';
import { LevelTransition } from '@/components/card/LevelTransition';
import { SessionComplete } from '@/components/card/SessionComplete';
import { DrinkPenaltyModal } from '@/components/card/DrinkPenaltyModal';
import { Toast } from '@/components/ui/Toast';
import { PlayerManagerDrawer } from '@/components/player/PlayerManagerDrawer';
import { useCardDeck } from '@/hooks/useCardDeck';
import { PackId, GameMode, QuestionLevel, DrinkIntensity } from '@/types';
import { PACKS } from '@/data/packs';
import { togglePinQuestion, isQuestionPinned } from '@/lib/storage';

function PlayScreen() {
  const searchParams = useSearchParams();
  const rawPacks = searchParams.get('packs');
  const rawPack = searchParams.get('pack') as PackId | null;
  const rawMode = searchParams.get('mode') as GameMode | null;
  const rawDare = searchParams.get('dare');
  const enableDarePong = rawDare === null ? true : rawDare !== '0';

  // Customizer params
  const rawSpicy = searchParams.get('spicy');
  const spicyLevel = rawSpicy !== null ? Number(rawSpicy) : undefined;

  const rawDareRatio = searchParams.get('dareRatio');
  const dareRatio = rawDareRatio !== null ? Number(rawDareRatio) : undefined;

  const rawLevels = searchParams.get('levels');
  const selectedLevels = useMemo(() => {
    if (!rawLevels) return undefined;
    return rawLevels
      .split(',')
      .map(Number)
      .filter((n): n is QuestionLevel => [1, 2, 3].includes(n));
  }, [rawLevels]);

  const drinkIntensity = (searchParams.get('drink') as DrinkIntensity) || 'medium';
  const rawLimit = searchParams.get('limit');
  const deckLimit = rawLimit ? Number(rawLimit) : undefined;

  const packIds: PackId[] = useMemo(() => {
    let ids: PackId[] = [];
    if (rawPacks) {
      ids = rawPacks
        .split(',')
        .map((p) => p.trim())
        .filter((id): id is PackId => PACKS.some((p) => p.id === id));
    } else if (rawPack && PACKS.some((p) => p.id === rawPack)) {
      ids = [rawPack];
    }
    return ids.length > 0 ? ids : ['couple'];
  }, [rawPacks, rawPack]);

  const mode: GameMode = rawMode === 'random' ? 'random' : 'sequential';

  const packNames = useMemo(
    () =>
      packIds
        .map((pid) => PACKS.find((p) => p.id === pid)?.name)
        .filter(Boolean)
        .join(' + '),
    [packIds]
  );

  const headerSubtitle = useMemo(() => {
    const parts = [mode === 'sequential' ? 'Tuần tự' : 'Ngẫu nhiên'];
    if (spicyLevel !== undefined && spicyLevel > 0) parts.push(`🔥 Cay ${spicyLevel}%`);
    if (dareRatio !== undefined && dareRatio > 0) parts.push(`⚡ ${dareRatio}% Dare`);
    return parts.join(' • ');
  }, [mode, spicyLevel, dareRatio]);

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
  } = useCardDeck({
    packIds,
    mode,
    enableDarePong,
    spicyLevel,
    dareRatio,
    selectedLevels,
    deckLimit,
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isDrinkModalOpen, setIsDrinkModalOpen] = useState<boolean>(false);

  // Player Turn Management
  const [players, setPlayers] = useState<string[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const saved = localStorage.getItem('chuyen_tro_players');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
  const [isPlayerDrawerOpen, setIsPlayerDrawerOpen] = useState<boolean>(false);

  const handleUpdatePlayers = (newPlayers: string[]) => {
    setPlayers(newPlayers);
    try {
      localStorage.setItem('chuyen_tro_players', JSON.stringify(newPlayers));
    } catch {
      // ignore
    }
  };

  const handleNextWithPlayer = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
    nextCard();
  };

  const handleSkipWithPlayer = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev + 1) % players.length);
    }
    skipCard();
  };

  const handlePrevWithPlayer = () => {
    if (players.length > 0) {
      setCurrentPlayerIndex((prev) => (prev - 1 + players.length) % players.length);
    }
    prevCard();
  };

  const currentPlayer = players.length > 0 ? players[currentPlayerIndex % players.length] : undefined;
  const nextPlayer = players.length > 1 ? players[(currentPlayerIndex + 1) % players.length] : undefined;

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
        title={packNames}
        subtitle={headerSubtitle}
        onOpenPlayers={() => setIsPlayerDrawerOpen(true)}
        playerCount={players.length}
      />

      <main className="flex-1 px-4 py-5 flex flex-col justify-between max-w-md mx-auto w-full pb-8">
        {!isLoaded ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-rose-500 border-t-transparent animate-spin" />
          </div>
        ) : isSessionComplete ? (
          <SessionComplete
            packIds={packIds}
            totalAnswered={totalAnsweredCount}
            onRestart={restart}
          />
        ) : isLevelTransition ? (
          <LevelTransition onConfirm={confirmLevel3Transition} />
        ) : currentCard ? (
          <div className="flex-1 flex flex-col justify-between gap-6">
            {/* The Main Flashcard with Swipe & Reveal */}
            <div className="flex-1 flex items-center justify-center">
              <QuestionCard
                question={currentCard}
                currentIndex={historyStack.length}
                totalAnswered={totalAnsweredCount}
                remainingCount={remainingCount}
                isPinned={isPinned}
                onTogglePin={handleTogglePin}
                onNext={handleNextWithPlayer}
                onSkip={handleSkipWithPlayer}
                currentPlayer={currentPlayer}
                nextPlayer={nextPlayer}
              />
            </div>

            {/* Bottom Actions */}
            <div className="w-full">
              <CardControls
                onNext={handleNextWithPlayer}
                onSkip={handleSkipWithPlayer}
                onPrev={handlePrevWithPlayer}
                onTogglePin={handleTogglePin}
                onShare={handleShare}
                onDrinkPenalty={enableDarePong ? () => setIsDrinkModalOpen(true) : undefined}
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

      {/* Drink Penalty Modal */}
      <DrinkPenaltyModal
        isOpen={isDrinkModalOpen}
        drinkIntensity={drinkIntensity}
        onClose={() => setIsDrinkModalOpen(false)}
        onAcceptAndNext={() => {
          setIsDrinkModalOpen(false);
          handleNextWithPlayer();
        }}
      />

      {/* Player Manager & Lucky Spin Drawer */}
      <PlayerManagerDrawer
        isOpen={isPlayerDrawerOpen}
        players={players}
        currentPlayerIndex={currentPlayerIndex}
        onClose={() => setIsPlayerDrawerOpen(false)}
        onUpdatePlayers={handleUpdatePlayers}
        onSelectPlayerIndex={(idx) => setCurrentPlayerIndex(idx)}
      />

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
