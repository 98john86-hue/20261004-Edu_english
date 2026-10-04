import type { Word, WordLevel } from './types';

export interface WordFormValues {
  term: string;
  meaning: string;
  example: string;
  level: WordLevel;
}

export interface ValidWordInput {
  term: string;
  meaning: string;
  example?: string;
  level: WordLevel;
}

export type WordFormField = 'term' | 'meaning' | 'example';
export type WordFormErrors = Partial<Record<WordFormField, string>>;

export type WordValidationResult =
  | { ok: true; value: ValidWordInput }
  | { ok: false; errors: WordFormErrors };

export const WORD_LIMITS: Record<WordFormField, number> = {
  term: 60,
  meaning: 100,
  example: 200,
};

export const EMPTY_WORD_FORM: WordFormValues = { term: '', meaning: '', example: '', level: 'beginner' };

export function normalizeTerm(term: string): string {
  return term.trim().toLowerCase();
}

export function validateWordInput(values: WordFormValues): WordValidationResult {
  const term = values.term.trim();
  const meaning = values.meaning.trim();
  const example = values.example.trim();
  const errors: WordFormErrors = {};

  if (!term) errors.term = '영어 단어를 입력해 주세요.';
  else if (term.length > WORD_LIMITS.term) errors.term = `영어 단어는 ${WORD_LIMITS.term}자 이하로 입력해 주세요.`;

  if (!meaning) errors.meaning = '뜻을 입력해 주세요.';
  else if (meaning.length > WORD_LIMITS.meaning) errors.meaning = `뜻은 ${WORD_LIMITS.meaning}자 이하로 입력해 주세요.`;

  if (example.length > WORD_LIMITS.example) errors.example = `예문은 ${WORD_LIMITS.example}자 이하로 입력해 주세요.`;

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: { term, meaning, level: values.level, ...(example ? { example } : {}) },
  };
}

export function findDuplicateWords(term: string, words: readonly Word[], excludeId?: string): Word[] {
  const key = normalizeTerm(term);
  if (!key) return [];
  return words.filter((word) => word.id !== excludeId && normalizeTerm(word.term) === key);
}

export interface WordFilter {
  query: string;
  level: WordLevel | 'all';
}

export function filterWords(words: readonly Word[], { query, level }: WordFilter): Word[] {
  const needle = query.trim().toLowerCase();
  return words
    .filter((word) => level === 'all' || word.level === level)
    .filter(
      (word) =>
        !needle || word.term.toLowerCase().includes(needle) || word.meaning.toLowerCase().includes(needle),
    )
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }) || a.id.localeCompare(b.id));
}
