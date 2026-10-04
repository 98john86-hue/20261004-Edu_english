import { shuffle, type RandomFn } from './random';
import { WORD_LEVELS, type ReviewState, type Word } from './types';

export interface StudyCard {
  word: Word;
  state?: ReviewState;
  isNew: boolean;
}

export interface BuildStudyQueueInput {
  words: readonly Word[];
  reviewStates: readonly ReviewState[];
  today: string;
  newWordLimit: number;
  random?: RandomFn;
}

export interface StudyQueue {
  cards: StudyCard[];
  dueCount: number;
  newCount: number;
  remainingNewCount: number;
}

const LEVEL_RANK = new Map(WORD_LEVELS.map((level, index) => [level, index]));

function compareNewWords(a: Word, b: Word): number {
  return (
    (LEVEL_RANK.get(a.level) ?? 0) - (LEVEL_RANK.get(b.level) ?? 0) ||
    a.createdAt.localeCompare(b.createdAt) ||
    a.id.localeCompare(b.id)
  );
}

// 새 단어는 초급부터, 같은 레벨 안에서는 먼저 추가된 순서로 고른다.
export function selectNewWords(
  words: readonly Word[],
  reviewedWordIds: ReadonlySet<string>,
  limit: number,
): { selected: Word[]; remaining: number } {
  const candidates = words.filter((word) => !reviewedWordIds.has(word.id)).sort(compareNewWords);
  const count = Math.max(0, Math.min(limit, candidates.length));
  return { selected: candidates.slice(0, count), remaining: candidates.length - count };
}

export function buildStudyQueue({
  words,
  reviewStates,
  today,
  newWordLimit,
  random = Math.random,
}: BuildStudyQueueInput): StudyQueue {
  const wordsById = new Map(words.map((word) => [word.id, word]));

  const dueCards: StudyCard[] = [];
  for (const state of reviewStates) {
    const word = wordsById.get(state.wordId);
    if (word && state.dueDate <= today) dueCards.push({ word, state, isNew: false });
  }

  const reviewedIds = new Set(reviewStates.map((state) => state.wordId));
  const { selected, remaining } = selectNewWords(words, reviewedIds, newWordLimit);
  const newCards: StudyCard[] = selected.map((word) => ({ word, isNew: true }));

  return {
    cards: shuffle([...dueCards, ...newCards], random),
    dueCount: dueCards.length,
    newCount: newCards.length,
    remainingNewCount: remaining,
  };
}
