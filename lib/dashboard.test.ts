import { describe, expect, it } from 'vitest';
import { summarizeDashboard, type DashboardInput } from './dashboard';

const BASE: DashboardInput = {
  today: '2026-10-04',
  dueCount: 4,
  totalWords: 60,
  studiedWords: 20,
  newWordsPerDay: 10,
  newWordsIntroducedToday: 3,
  logs: [
    { date: '2026-10-03', reviewedCount: 8, correctCount: 6 },
    { date: '2026-10-04', reviewedCount: 5, correctCount: 5 },
  ],
};

describe('summarizeDashboard', () => {
  it('오늘 남은 복습, 새 단어 여유, 연속 학습일, 7일 데이터를 계산한다', () => {
    const summary = summarizeDashboard(BASE);
    expect(summary).toMatchObject({ dueCount: 4, newWordsAvailable: 7, totalWords: 60, streak: 2, todayReviewed: 5 });
    expect(summary.week).toHaveLength(7);
    expect(summary.week.map((d) => d.reviewedCount)).toEqual([0, 0, 0, 0, 0, 8, 5]);
  });

  it('새 단어 여유는 남은 미학습 단어 수를 넘지 않고 음수가 되지 않는다', () => {
    expect(summarizeDashboard({ ...BASE, studiedWords: 58 }).newWordsAvailable).toBe(2);
    expect(summarizeDashboard({ ...BASE, newWordsIntroducedToday: 15 }).newWordsAvailable).toBe(0);
    expect(summarizeDashboard({ ...BASE, studiedWords: 70 }).newWordsAvailable).toBe(0);
  });
});
