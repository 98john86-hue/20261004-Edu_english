import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { createDailyProgressRepository } from './dailyProgressRepository';
import type { DailyProgressRepository } from './types';

describe('dailyProgressRepository', () => {
  let db: VocabDatabase;
  let repo: DailyProgressRepository;

  beforeEach(() => {
    db = createTestDatabase();
    repo = createDailyProgressRepository(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it('날짜별로 새 단어 수를 따로 센다', async () => {
    expect(await repo.getNewWordCount('2026-10-04')).toBe(0);
    await repo.incrementNewWordCount('2026-10-04');
    await repo.incrementNewWordCount('2026-10-04');
    await repo.incrementNewWordCount('2026-10-05');
    expect(await repo.getNewWordCount('2026-10-04')).toBe(2);
    expect(await repo.getNewWordCount('2026-10-05')).toBe(1);
  });

  it('동시에 증가시켜도 누락이 없다', async () => {
    await Promise.all(Array.from({ length: 4 }, () => repo.incrementNewWordCount('2026-10-04')));
    expect(await repo.getNewWordCount('2026-10-04')).toBe(4);
  });
});
