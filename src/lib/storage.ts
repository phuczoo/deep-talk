import { Question, PinnedQuestion, PackId, QuestionLevel } from '@/types';

const PINNED_STORAGE_KEY = 'chuyen_tro_pinned_v1';
const CUSTOM_QUESTIONS_STORAGE_KEY = 'chuyen_tro_custom_questions_v1';

// --- Pinned Questions ---

export function getPinnedQuestions(): PinnedQuestion[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PINNED_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load pinned questions', e);
    return [];
  }
}

export function savePinnedQuestions(pinned: PinnedQuestion[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PINNED_STORAGE_KEY, JSON.stringify(pinned));
  } catch (e) {
    console.error('Failed to save pinned questions', e);
  }
}

export function togglePinQuestion(question: Question, note?: string): boolean {
  const current = getPinnedQuestions();
  const index = current.findIndex((item) => item.question.id === question.id);
  
  if (index >= 0) {
    // Unpin
    current.splice(index, 1);
    savePinnedQuestions(current);
    return false; // Not pinned now
  } else {
    // Pin
    const newItem: PinnedQuestion = {
      question,
      pinnedAt: new Date().toISOString(),
      note,
    };
    current.unshift(newItem);
    savePinnedQuestions(current);
    return true; // Pinned now
  }
}

export function isQuestionPinned(questionId: string): boolean {
  const current = getPinnedQuestions();
  return current.some((item) => item.question.id === questionId);
}

export function removePinnedQuestion(questionId: string): void {
  const current = getPinnedQuestions();
  const filtered = current.filter((item) => item.question.id !== questionId);
  savePinnedQuestions(filtered);
}

// --- Custom Questions ---

export function getCustomQuestions(packId?: PackId): Question[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(CUSTOM_QUESTIONS_STORAGE_KEY);
    const allCustom: Question[] = raw ? JSON.parse(raw) : [];
    if (packId) {
      return allCustom.filter((q) => q.pack === packId);
    }
    return allCustom;
  } catch (e) {
    console.error('Failed to load custom questions', e);
    return [];
  }
}

export function saveCustomQuestions(questions: Question[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CUSTOM_QUESTIONS_STORAGE_KEY, JSON.stringify(questions));
  } catch (e) {
    console.error('Failed to save custom questions', e);
  }
}

export function addCustomQuestion(data: {
  pack: PackId;
  level: QuestionLevel;
  question: string;
}): Question {
  const current = getCustomQuestions();
  const newQuestion: Question = {
    id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    pack: data.pack,
    level: data.level,
    question: data.question.trim(),
    isCustom: true,
  };
  current.unshift(newQuestion);
  saveCustomQuestions(current);
  return newQuestion;
}

export function removeCustomQuestion(id: string): void {
  const current = getCustomQuestions();
  const filtered = current.filter((q) => q.id !== id);
  saveCustomQuestions(filtered);
}
