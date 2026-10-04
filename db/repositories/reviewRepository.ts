import type { VocabDatabase } from '@/db/database';
import type { ReviewRepository } from './types';

export function createReviewRepository(db: VocabDatabase): ReviewRepository {
  return {
    get: (wordId) => db.reviews.get(wordId),
    getAll: () => db.reviews.toArray(),
    count: () => db.reviews.count(),
    // 'YYYY-MM-DD' 문자열은 사전순과 날짜순이 같아서 인덱스 범위 비교가 그대로 동작한다.
    getDue: (today) => db.reviews.where('dueDate').belowOrEqual(today).sortBy('dueDate'),
    countDue: (today) => db.reviews.where('dueDate').belowOrEqual(today).count(),
    async put(state) {
      await db.reviews.put(state);
    },
    async delete(wordId) {
      await db.reviews.delete(wordId);
    },
  };
}
