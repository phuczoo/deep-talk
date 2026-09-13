export type PackId = 'couple' | 'couple_spicy' | 'friends' | 'friends_spicy';

export type GameMode = 'sequential' | 'random';

export type QuestionLevel = 1 | 2 | 3;

export interface Question {
  id: string;
  pack: PackId;
  level: QuestionLevel;
  question: string;
  isCustom?: boolean;
}

export interface PackInfo {
  id: PackId;
  name: string;
  subtitle: string;
  description: string;
  iconName: string;
  color: {
    primary: string; // Tailwind color class or hex
    bg: string;
    badge: string;
    border: string;
    gradient: string;
  };
}

export interface PinnedQuestion {
  question: Question;
  pinnedAt: string; // ISO string
  note?: string;
}

export interface GameSessionState {
  packId: PackId;
  mode: GameMode;
  currentCard: Question | null;
  historyStack: Question[]; // Exactly past viewed cards in order
  cardQueue: Question[]; // Remaining deck queue
  totalAnsweredCount: number;
  isLevelTransition: boolean; // True when showing warning before Level 3
  transitionTargetLevel: QuestionLevel | null;
  isSessionComplete: boolean;
}
