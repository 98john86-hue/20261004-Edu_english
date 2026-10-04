import type { ReviewState, Word, WordLevel } from './types';

export function makeWord(id: string, overrides: Partial<Word> = {}): Word {
  return {
    id,
    term: `term-${id}`,
    meaning: `뜻-${id}`,
    level: 'beginner' as WordLevel,
    source: 'builtin',
    createdAt: '2026-10-01T00:00:00.000Z',
    ...overrides,
  };
}

export function makeState(wordId: string, dueDate: string, overrides: Partial<ReviewState> = {}): ReviewState {
  return { wordId, easeFactor: 2.5, interval: 1, repetitions: 1, dueDate, ...overrides };
}
