export type WordLevel = 'beginner' | 'intermediate' | 'advanced';
export type WordSource = 'builtin' | 'user';

export interface Word {
  id: string;
  term: string;
  meaning: string;
  example?: string;
  level: WordLevel;
  source: WordSource;
  createdAt: string;
}

export interface ReviewState {
  wordId: string;
  easeFactor: number;
  interval: number;
  repetitions: number;
  dueDate: string;
  lastReviewedAt?: string;
}

export interface StudyLog {
  date: string;
  reviewedCount: number;
  correctCount: number;
}

export const WORD_LEVELS: readonly WordLevel[] = ['beginner', 'intermediate', 'advanced'];

export const LEVEL_LABELS: Record<WordLevel, string> = {
  beginner: '초급',
  intermediate: '중급',
  advanced: '고급',
};
