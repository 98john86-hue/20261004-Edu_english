import Dexie, { type EntityTable } from 'dexie';
import type { ReviewState, StudyLog, Word } from '@/lib/types';

export interface MetaEntry {
  key: string;
  value: string;
}

export type VocabDatabase = Dexie & {
  words: EntityTable<Word, 'id'>;
  reviews: EntityTable<ReviewState, 'wordId'>;
  studyLogs: EntityTable<StudyLog, 'date'>;
  meta: EntityTable<MetaEntry, 'key'>;
};

export const DB_NAME = 'edu-english-vocab';

export function createDatabase(name: string = DB_NAME): VocabDatabase {
  const db = new Dexie(name) as VocabDatabase;
  db.version(1).stores({
    words: 'id, term, level, source, createdAt',
    reviews: 'wordId, dueDate',
    studyLogs: 'date',
    meta: 'key',
  });
  return db;
}
