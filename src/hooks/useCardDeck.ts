'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question, PackId, GameMode, QuestionLevel } from '@/types';
import defaultQuestionsData from '@/data/questions.json';
import { getCustomQuestions } from '@/lib/storage';
import { shuffleArray } from '@/lib/utils';

interface UseCardDeckOptions {
  packIds: PackId[];
  mode: GameMode;
  enableDarePong?: boolean;
}

export function useCardDeck({ packIds, mode, enableDarePong = true }: UseCardDeckOptions) {
  const packKey = packIds.slice().sort().join(',');

  const [currentCard, setCurrentCard] = useState<Question | null>(null);
  const [historyStack, setHistoryStack] = useState<Question[]>([]);
  const [cardQueue, setCardQueue] = useState<Question[]>([]);
  const [totalDeckSize, setTotalDeckSize] = useState<number>(0);
  const [totalAnsweredCount, setTotalAnsweredCount] = useState<number>(0);
  
  // Level 3 transition warning states (for sequential mode)
  const [isLevelTransition, setIsLevelTransition] = useState<boolean>(false);
  const [hasConfirmedLevel3Transition, setHasConfirmedLevel3Transition] = useState<boolean>(false);
  
  // Session completion state
  const [isSessionComplete, setIsSessionComplete] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  // Initialize or reset deck
  const initDeck = useCallback(() => {
    const activePacks = (packKey ? packKey.split(',') : []) as PackId[];

    // 1. Gather default questions from all selected packs
    let defaults = (defaultQuestionsData as Question[]).filter((q) => activePacks.includes(q.pack));
    if (!enableDarePong) {
      defaults = defaults.filter((q) => q.type !== 'dare');
    }
    
    // 2. Gather custom questions from all selected packs
    const custom = activePacks.flatMap((pid) => getCustomQuestions(pid));
    const combined = [...defaults, ...custom];

    let orderedDeck: Question[] = [];

    if (mode === 'sequential') {
      // Group by level and shuffle inside each level
      const lvl1 = shuffleArray(combined.filter((q) => q.level === 1));
      const lvl2 = shuffleArray(combined.filter((q) => q.level === 2));
      const lvl3 = shuffleArray(combined.filter((q) => q.level === 3));
      orderedDeck = [...lvl1, ...lvl2, ...lvl3];
    } else {
      // Random mode: shuffle all
      orderedDeck = shuffleArray(combined);
    }

    setTotalDeckSize(orderedDeck.length);
    setHistoryStack([]);
    setTotalAnsweredCount(0);
    setIsSessionComplete(false);
    setIsLevelTransition(false);
    setHasConfirmedLevel3Transition(false);

    if (orderedDeck.length > 0) {
      const [first, ...rest] = orderedDeck;
      setCurrentCard(first);
      setCardQueue(rest);
    } else {
      setCurrentCard(null);
      setCardQueue([]);
      setIsSessionComplete(true);
    }

    setIsLoaded(true);
  }, [packKey, mode, enableDarePong]);

  useEffect(() => {
    initDeck();
  }, [initDeck]);

  // Go to Next Card
  const nextCard = useCallback(() => {
    if (!currentCard) return;

    // Check if cardQueue is empty -> Session complete
    if (cardQueue.length === 0) {
      setHistoryStack((prev) => [...prev, currentCard]);
      setTotalAnsweredCount((prev) => prev + 1);
      setCurrentCard(null);
      setIsSessionComplete(true);
      return;
    }

    const nextCandidate = cardQueue[0];

    // Check sequential transition to Level 3 warning
    if (
      mode === 'sequential' &&
      !hasConfirmedLevel3Transition &&
      nextCandidate.level === 3 &&
      currentCard.level < 3
    ) {
      // Show transition modal/screen
      setIsLevelTransition(true);
      return;
    }

    // Advance
    setHistoryStack((prev) => [...prev, currentCard]);
    setTotalAnsweredCount((prev) => prev + 1);
    setCurrentCard(nextCandidate);
    setCardQueue((prev) => prev.slice(1));
  }, [currentCard, cardQueue, mode, hasConfirmedLevel3Transition]);

  // Confirm Level 3 transition warning and proceed
  const confirmLevel3Transition = useCallback(() => {
    setHasConfirmedLevel3Transition(true);
    setIsLevelTransition(false);

    if (cardQueue.length > 0 && currentCard) {
      const nextCandidate = cardQueue[0];
      setHistoryStack((prev) => [...prev, currentCard]);
      setTotalAnsweredCount((prev) => prev + 1);
      setCurrentCard(nextCandidate);
      setCardQueue((prev) => prev.slice(1));
    }
  }, [cardQueue, currentCard]);

  // Skip current card (send to end of queue without advancing history)
  const skipCard = useCallback(() => {
    if (!currentCard) return;

    if (cardQueue.length === 0) {
      // If no other cards left, keep showing current or mark complete
      return;
    }

    const nextCandidate = cardQueue[0];

    // Check sequential transition to Level 3 warning if skipping onto level 3
    if (
      mode === 'sequential' &&
      !hasConfirmedLevel3Transition &&
      nextCandidate.level === 3 &&
      currentCard.level < 3
    ) {
      setIsLevelTransition(true);
      return;
    }

    // Place currentCard at the end of remaining queue
    const remainingAfterNext = cardQueue.slice(1);
    setCardQueue([...remainingAfterNext, currentCard]);
    setCurrentCard(nextCandidate);
  }, [currentCard, cardQueue, mode, hasConfirmedLevel3Transition]);

  // Previous card (pop from history stack, put current back to queue front)
  const prevCard = useCallback(() => {
    if (historyStack.length === 0) return;

    const previousCard = historyStack[historyStack.length - 1];
    const newHistory = historyStack.slice(0, historyStack.length - 1);

    if (currentCard) {
      setCardQueue((prev) => [currentCard, ...prev]);
    }

    setCurrentCard(previousCard);
    setHistoryStack(newHistory);
    setTotalAnsweredCount((prev) => Math.max(0, prev - 1));
    
    // If we go back from level 3 to level < 3, reset level 3 confirmation if needed
    if (previousCard.level < 3) {
      setHasConfirmedLevel3Transition(false);
    }
  }, [historyStack, currentCard]);

  // Restart
  const restart = useCallback(() => {
    initDeck();
  }, [initDeck]);

  return {
    isLoaded,
    currentCard,
    historyStack,
    cardQueue,
    totalDeckSize,
    totalAnsweredCount,
    canGoBack: historyStack.length > 0,
    remainingCount: cardQueue.length + (currentCard ? 1 : 0),
    isLevelTransition,
    isSessionComplete,
    nextCard,
    skipCard,
    prevCard,
    confirmLevel3Transition,
    restart,
  };
}
