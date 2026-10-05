import type { VocabDatabase } from '@/db/database';
import type { StudyLog } from '@/lib/types';
import type { StudyLogRepository } from './types';

export function createStudyLogRepository(db: VocabDatabase): StudyLogRepository {
  return {
    get: (date) => db.studyLogs.get(date),
    getAll: () => db.studyLogs.orderBy('date').toArray(),
    getRange: (fromDate, toDate) =>
      db.studyLogs.where('date').between(fromDate, toDate, true, true).toArray(),
    async increment(date, reviewed, correct) {
      return db.transaction('rw', db.studyLogs, async () => {
        const existing = await db.studyLogs.get(date);
        const next: StudyLog = {
          date,
          reviewedCount: (existing?.reviewedCount ?? 0) + reviewed,
          correctCount: (existing?.correctCount ?? 0) + correct,
        };
        await db.studyLogs.put(next);
        return next;
      });
    },
  };
}
