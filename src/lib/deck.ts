import { Question, PackId, GameMode, QuestionLevel } from '@/types';
import defaultQuestionsData from '@/data/questions.json';
import { getCustomQuestions } from '@/lib/storage';
import { shuffleArray } from '@/lib/utils';

export interface BuildDeckOptions {
  packIds: PackId[];
  mode?: GameMode;
  enableDarePong?: boolean;
  spicyLevel?: number; // 0, 30, 60, 100
  dareRatio?: number; // 0, 30, 50, 100
  selectedLevels?: QuestionLevel[];
  deckLimit?: number; // 0 = unlimited
  shuffle?: boolean;
}

/**
 * Builds, filters, and samples the deck based on pack selection and customizer options.
 * This is the single source of truth for both the UI estimators and the actual game loop.
 */
export function buildDeck({
  packIds,
  mode = 'sequential',
  enableDarePong = true,
  spicyLevel,
  dareRatio,
  selectedLevels,
  deckLimit = 0,
  shuffle = true,
}: BuildDeckOptions): Question[] {
  const activePacks = packIds && packIds.length > 0 ? packIds : (['couple'] as PackId[]);
  const parsedLevels =
    selectedLevels && selectedLevels.length > 0 ? selectedLevels : ([1, 2, 3] as QuestionLevel[]);

  // 1. Resolve candidate packs based on active theme
  const hasCouple = activePacks.some((p) => p.startsWith('couple'));
  const hasFriends = activePacks.some((p) => p.startsWith('friends'));

  const targetPacks: PackId[] = [];
  if (hasCouple) {
    targetPacks.push('couple', 'couple_spicy');
  }
  if (hasFriends) {
    targetPacks.push('friends', 'friends_spicy');
  }
  if (targetPacks.length === 0) {
    targetPacks.push(...activePacks);
  }

  // 2. Gather questions (default + custom)
  const defaults = (defaultQuestionsData as Question[]).filter((q) =>
    targetPacks.includes(q.pack)
  );
  let custom: Question[] = [];
  if (typeof window !== 'undefined') {
    try {
      custom = targetPacks.flatMap((pid) => getCustomQuestions(pid));
    } catch {
      // ignore in SSR / node
    }
  }
  let pool = [...defaults, ...custom];

  // 3. Filter by selected levels
  pool = pool.filter((q) => parsedLevels.includes(q.level));

  // 4. Filter / Sample based on Spicy Level
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
    const normalCards = shuffle
      ? shuffleArray(pool.filter((q) => !q.pack.includes('spicy')))
      : pool.filter((q) => !q.pack.includes('spicy'));
    const spicyCards = shuffle
      ? shuffleArray(pool.filter((q) => q.pack.includes('spicy')))
      : pool.filter((q) => q.pack.includes('spicy'));

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
    const truthCards = shuffle
      ? shuffleArray(pool.filter((q) => q.type !== 'dare'))
      : pool.filter((q) => q.type !== 'dare');
    const dareCards = shuffle
      ? shuffleArray(pool.filter((q) => q.type === 'dare'))
      : pool.filter((q) => q.type === 'dare');

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
    const lvl1 = pool.filter((q) => q.level === 1);
    const lvl2 = pool.filter((q) => q.level === 2);
    const lvl3 = pool.filter((q) => q.level === 3);

    const sLvl1 = shuffle ? shuffleArray(lvl1) : lvl1;
    const sLvl2 = shuffle ? shuffleArray(lvl2) : lvl2;
    const sLvl3 = shuffle ? shuffleArray(lvl3) : lvl3;

    if (deckLimit && deckLimit > 0) {
      const activeGroups = [sLvl1, sLvl2, sLvl3].filter((g) => g.length > 0);
      if (activeGroups.length > 0) {
        const perGroup = Math.floor(deckLimit / activeGroups.length);
        let rem = deckLimit % activeGroups.length;

        const takeFrom = (group: Question[]) => {
          if (group.length === 0) return [];
          const take = perGroup + (rem > 0 ? 1 : 0);
          if (rem > 0) rem--;
          return group.slice(0, take);
        };

        orderedDeck = [...takeFrom(sLvl1), ...takeFrom(sLvl2), ...takeFrom(sLvl3)];
      }
    } else {
      orderedDeck = [...sLvl1, ...sLvl2, ...sLvl3];
    }
  } else {
    orderedDeck = shuffle ? shuffleArray(pool) : pool;
    if (deckLimit && deckLimit > 0) {
      orderedDeck = orderedDeck.slice(0, deckLimit);
    }
  }

  return orderedDeck;
}
