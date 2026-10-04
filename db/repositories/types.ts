import type { ReviewState, StudyLog, Word, WordLevel } from '@/lib/types';

// 이 인터페이스들이 저장소 교체 지점이다. 서버 DB로 옮길 때는 같은 계약을 따르는
// HTTP 구현체를 만들어 db/index.ts에서 바꿔 끼우면 된다.

export interface NewWordInput {
  term: string;
  meaning: string;
  example?: string;
  level: WordLevel;
}

export type WordUpdate = Partial<NewWordInput>;

export interface WordRepository {
  getAll(): Promise<Word[]>;
  getById(id: string): Promise<Word | undefined>;
  getByIds(ids: string[]): Promise<Word[]>;
  getByLevel(level: WordLevel): Promise<Word[]>;
  findByTerm(term: string): Promise<Word[]>;
  count(): Promise<number>;
  add(input: NewWordInput): Promise<Word>;
  update(id: string, changes: WordUpdate): Promise<Word>;
  delete(id: string): Promise<void>;
}

export interface ReviewRepository {
  get(wordId: string): Promise<ReviewState | undefined>;
  getAll(): Promise<ReviewState[]>;
  count(): Promise<number>;
  getDue(today: string): Promise<ReviewState[]>;
  countDue(today: string): Promise<number>;
  put(state: ReviewState): Promise<void>;
  delete(wordId: string): Promise<void>;
}

export interface StudyLogRepository {
  get(date: string): Promise<StudyLog | undefined>;
  getAll(): Promise<StudyLog[]>;
  getRange(fromDate: string, toDate: string): Promise<StudyLog[]>;
  increment(date: string, reviewed: number, correct: number): Promise<StudyLog>;
}

export class WordNotFoundError extends Error {
  constructor(id: string) {
    super(`단어를 찾을 수 없습니다: ${id}`);
    this.name = 'WordNotFoundError';
  }
}

export class ReadonlyWordError extends Error {
  constructor() {
    super('기본 제공 단어는 수정하거나 삭제할 수 없습니다.');
    this.name = 'ReadonlyWordError';
  }
}

// 하루 새 단어 한도를 지키려면 "오늘 처음 학습한 새 단어 수"가 필요한데, 이 값은
// ReviewState만으로는 알 수 없어서(실패하면 repetitions가 0으로 돌아감) 따로 센다.
export interface DailyProgressRepository {
  getNewWordCount(date: string): Promise<number>;
  incrementNewWordCount(date: string): Promise<number>;
}
