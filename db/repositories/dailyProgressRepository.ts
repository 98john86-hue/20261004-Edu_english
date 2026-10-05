import type { VocabDatabase } from '@/db/database';
import type { DailyProgressRepository } from './types';

function newWordKey(date: string): string {
  return `newWords:${date}`;
}

function toCount(value: string | undefined): number {
  const count = Number(value);
  return Number.isInteger(count) && count > 0 ? count : 0;
}

export function createDailyProgressRepository(db: VocabDatabase): DailyProgressRepository {
  return {
    async getNewWordCount(date) {
      return toCount((await db.meta.get(newWordKey(date)))?.value);
    },
    async incrementNewWordCount(date) {
      return db.transaction('rw', db.meta, async () => {
        const key = newWordKey(date);
        const next = toCount((await db.meta.get(key))?.value) + 1;
        await db.meta.put({ key, value: String(next) });
        return next;
      });
    },
  };
}
