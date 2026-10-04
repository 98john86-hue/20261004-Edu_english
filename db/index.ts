import { createDatabase, type VocabDatabase } from './database';
import { createDailyProgressRepository } from './repositories/dailyProgressRepository';
import { createReviewRepository } from './repositories/reviewRepository';
import { createStudyLogRepository } from './repositories/studyLogRepository';
import type {
  DailyProgressRepository,
  ReviewRepository,
  StudyLogRepository,
  WordRepository,
} from './repositories/types';
import { createWordRepository } from './repositories/wordRepository';
import { seedBuiltinWords } from './seed';

export * from './repositories/types';

export interface Repositories {
  words: WordRepository;
  reviews: ReviewRepository;
  studyLogs: StudyLogRepository;
  dailyProgress: DailyProgressRepository;
}

let database: VocabDatabase | null = null;
let repositories: Repositories | null = null;
let initPromise: Promise<void> | null = null;

// Dexie 인스턴스는 브라우저에서 처음 필요할 때 만든다. 모듈 로드 시점에 만들면
// 서버 렌더링 중 IndexedDB가 없는 환경에서 평가될 수 있기 때문이다.
function getDatabase(): VocabDatabase {
  database ??= createDatabase();
  return database;
}

export function getRepositories(): Repositories {
  if (!repositories) {
    repositories = createRepositories(getDatabase());
  }
  return repositories;
}

export function createRepositories(db: VocabDatabase): Repositories {
  return {
    words: createWordRepository(db),
    reviews: createReviewRepository(db),
    studyLogs: createStudyLogRepository(db),
    dailyProgress: createDailyProgressRepository(db),
  };
}

export class StorageUnavailableError extends Error {
  constructor(cause?: unknown) {
    super('브라우저 저장소(IndexedDB)를 사용할 수 없습니다.', { cause });
    this.name = 'StorageUnavailableError';
  }
}

export function initDatabase(): Promise<void> {
  initPromise ??= (async () => {
    if (typeof indexedDB === 'undefined') throw new StorageUnavailableError();
    const db = getDatabase();
    try {
      await db.open();
      await seedBuiltinWords(db);
    } catch (error) {
      throw new StorageUnavailableError(error);
    }
  })().catch((error: unknown) => {
    initPromise = null;
    throw error;
  });
  return initPromise;
}

export function setRepositoriesForTesting(next: Repositories | null): void {
  repositories = next;
}
