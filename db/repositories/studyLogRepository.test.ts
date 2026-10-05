import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { createStudyLogRepository } from './studyLogRepository';
import type { StudyLogRepository } from './types';

describe('studyLogRepository', () => {
  let db: VocabDatabase;
  let repo: StudyLogRepository;

  beforeEach(() => {
    db = createTestDatabase();
    repo = createStudyLogRepository(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it('같은 날짜에는 횟수를 누적한다', async () => {
    await repo.increment('2026-10-04', 1, 1);
    await repo.increment('2026-10-04', 1, 0);
    expect(await repo.get('2026-10-04')).toEqual({ date: '2026-10-04', reviewedCount: 2, correctCount: 1 });
  });

  it('동시에 증가시켜도 누락이 없다', async () => {
    await Promise.all(Array.from({ length: 5 }, () => repo.increment('2026-10-04', 1, 1)));
    expect((await repo.get('2026-10-04'))?.reviewedCount).toBe(5);
  });

  it('기간 조회는 양 끝 날짜를 포함한다', async () => {
    for (const date of ['2026-09-27', '2026-09-28', '2026-10-03', '2026-10-04', '2026-10-05']) {
      await repo.increment(date, 1, 1);
    }
    const logs = await repo.getRange('2026-09-28', '2026-10-04');
    expect(logs.map((log) => log.date)).toEqual(['2026-09-28', '2026-10-03', '2026-10-04']);
    expect(await repo.getAll()).toHaveLength(5);
  });
});
