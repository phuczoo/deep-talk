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
  spicyLevel?: number;
  dareRatio?: number;
  selectedLevels?: QuestionLevel[];
  deckLimit?: number;
}

export function useCardDeck({
  packIds,
  mode,
  enableDarePong = true,
  spicyLevel,
  dareRatio,
  selectedLevels,
  deckLimit,
}: UseCardDeckOptions) {
  const packKey = packIds.slice().sort().join(',');
  const levelsKey = (selectedLevels && selectedLevels.length > 0 ? selectedLevels : [1, 2, 3])
    .slice()
    .sort()
    .join(',');

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
    const parsedLevels = levelsKey.split(',').map((l) => Number(l) as QuestionLevel);

    // 1. Gather all candidate packs based on selected theme
    const hasCouple = activePacks.some((p) => p.startsWith('couple'));
    const hasFriends = activePacks.some((p) => p.startsWith('friends'));

    const targetPacks: PackId[] = [];
    if (hasCouple) targetPacks.push('couple', 'couple_spicy');
    if (hasFriends) targetPacks.push('friends', 'friends_spicy');
    if (targetPacks.length === 0) targetPacks.push(...activePacks);

    // 2. Gather default questions from target packs
    const defaults = (defaultQuestionsData as Question[]).filter((q) =>
      targetPacks.includes(q.pack)
    );
    const custom = targetPacks.flatMap((pid) => getCustomQuestions(pid));
    let pool = [...defaults, ...custom];

    // 3. Filter by selected levels
    pool = pool.filter((q) => parsedLevels.includes(q.level));

    // 4. Filter / Sample based on spicyLevel
    const effectiveSpicy =
      spicyLevel !== undefined
        ? spicyLevel
        : activePacks.some((p) => p.includes('spicy'))
        ? 60
        : 0;

    if (effectiveSpicy === 0) {
      pool = pool.filter((q) => !q.pack.includes('spicy'));
    } else if (effectiveSpicy === 100) {
      pool = pool.filter((q) => q.pack.includes('spicy'));
    } else {
      // Blend normal and spicy according to percentage
      const normalCards = shuffleArray(pool.filter((q) => !q.pack.includes('spicy')));
      const spicyCards = shuffleArray(pool.filter((q) => q.pack.includes('spicy')));

      if (normalCards.length > 0 && spicyCards.length > 0) {
        const spicyFraction = effectiveSpicy / 100;
        let countSpicy = spicyCards.length;
        let countNormal = Math.round(countSpicy * ((1 - spicyFraction) / spicyFraction));

        if (countNormal > normalCards.length) {
          countNormal = normalCards.length;
          countSpicy = Math.round(countNormal * (spicyFraction / (1 - spicyFraction)));
        }

        pool = [
          ...normalCards.slice(0, Math.max(1, countNormal)),
          ...spicyCards.slice(0, Math.max(1, countSpicy)),
        ];
      }
    }

    // 5. Filter / Sample based on Dare ratio
    const effectiveDare = !enableDarePong
      ? 0
      : dareRatio !== undefined
      ? dareRatio
      : 30;

    if (effectiveDare === 0) {
      pool = pool.filter((q) => q.type !== 'dare');
    } else if (effectiveDare === 100) {
      pool = pool.filter((q) => q.type === 'dare');
    } else {
      const truthCards = shuffleArray(pool.filter((q) => q.type !== 'dare'));
      const dareCards = shuffleArray(pool.filter((q) => q.type === 'dare'));

      if (truthCards.length > 0 && dareCards.length > 0) {
        const dareFraction = effectiveDare / 100;
        let countDare = dareCards.length;
        let countTruth = Math.round(countDare * ((1 - dareFraction) / dareFraction));

        if (countTruth > truthCards.length) {
          countTruth = truthCards.length;
          countDare = Math.round(countTruth * (dareFraction / (1 - dareFraction)));
        }

        pool = [
          ...truthCards.slice(0, Math.max(1, countTruth)),
          ...dareCards.slice(0, Math.max(1, countDare)),
        ];
      }
    }

    // 6. Ordering & Deck Limit
    let orderedDeck: Question[] = [];

    if (mode === 'sequential') {
      const lvl1 = shuffleArray(pool.filter((q) => q.level === 1));
      const lvl2 = shuffleArray(pool.filter((q) => q.level === 2));
      const lvl3 = shuffleArray(pool.filter((q) => q.level === 3));

      if (deckLimit && deckLimit > 0) {
        const activeGroups = [lvl1, lvl2, lvl3].filter((g) => g.length > 0);
        if (activeGroups.length > 0) {
          const perGroup = Math.floor(deckLimit / activeGroups.length);
          let rem = deckLimit % activeGroups.length;

          const takeFrom = (group: Question[]) => {
            if (group.length === 0) return [];
            const take = perGroup + (rem > 0 ? 1 : 0);
            if (rem > 0) rem--;
            return group.slice(0, take);
          };

          orderedDeck = [...takeFrom(lvl1), ...takeFrom(lvl2), ...takeFrom(lvl3)];
        }
      } else {
        orderedDeck = [...lvl1, ...lvl2, ...lvl3];
      }
    } else {
      orderedDeck = shuffleArray(pool);
      if (deckLimit && deckLimit > 0) {
        orderedDeck = orderedDeck.slice(0, deckLimit);
      }
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
  }, [packKey, mode, enableDarePong, spicyLevel, dareRatio, levelsKey, deckLimit]);

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
