import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import type { ReviewState } from '@/lib/types';
import { createReviewRepository } from './reviewRepository';
import type { ReviewRepository } from './types';

function state(wordId: string, dueDate: string): ReviewState {
  return { wordId, easeFactor: 2.5, interval: 1, repetitions: 1, dueDate };
}

describe('reviewRepository', () => {
  let db: VocabDatabase;
  let repo: ReviewRepository;

  beforeEach(() => {
    db = createTestDatabase();
    repo = createReviewRepository(db);
  });

  afterEach(async () => {
    await db.delete();
  });

  it('dueDate가 오늘 이하인 카드만 날짜순으로 돌려준다', async () => {
    await repo.put(state('a', '2026-10-05'));
    await repo.put(state('b', '2026-10-04'));
    await repo.put(state('c', '2026-09-30'));
    await repo.put(state('d', '2026-12-31'));
    const due = await repo.getDue('2026-10-04');
    expect(due.map((s) => s.wordId)).toEqual(['c', 'b']);
    expect(await repo.countDue('2026-10-04')).toBe(2);
  });

  it('put은 같은 wordId를 덮어쓰고, delete로 지울 수 있다', async () => {
    await repo.put(state('a', '2026-10-05'));
    await repo.put({ ...state('a', '2026-10-11'), interval: 6, repetitions: 2 });
    expect(await repo.getAll()).toHaveLength(1);
    expect(await repo.count()).toBe(1);
    expect((await repo.get('a'))?.interval).toBe(6);
    await repo.delete('a');
    expect(await repo.get('a')).toBeUndefined();
  });
});
