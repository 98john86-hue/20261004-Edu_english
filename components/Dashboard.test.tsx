import { render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createRepositories, setRepositoriesForTesting } from '@/db';
import type { VocabDatabase } from '@/db/database';
import { createTestDatabase } from '@/db/testUtils';
import { makeState, makeWord } from '@/lib/testFixtures';
import { Dashboard } from './Dashboard';

let db: VocabDatabase;

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 9, 4, 21, 0));
  db = createTestDatabase();
  setRepositoriesForTesting(createRepositories(db));
});

afterEach(async () => {
  vi.useRealTimers();
  localStorage.clear();
  setRepositoriesForTesting(null);
  await db.delete();
});

describe('Dashboard', () => {
  it('오늘 복습 남은 수, 전체 단어 수, 연속 학습일, 7일 차트를 보여 준다', async () => {
    await db.words.bulkAdd(Array.from({ length: 15 }, (_, i) => makeWord(`w${i}`)));
    await db.reviews.bulkPut([
      makeState('w0', '2026-10-01'),
      makeState('w1', '2026-10-04'),
      makeState('w2', '2026-10-04'),
      makeState('w3', '2026-10-05'),
    ]);
    await db.studyLogs.bulkPut([
      { date: '2026-10-01', reviewedCount: 3, correctCount: 3 },
      { date: '2026-10-02', reviewedCount: 4, correctCount: 2 },
      { date: '2026-10-03', reviewedCount: 10, correctCount: 8 },
    ]);
    await db.meta.put({ key: 'newWords:2026-10-04', value: '4' });

    render(<Dashboard />);

    const hero = await screen.findByRole('region', { name: '오늘 복습할 카드' });
    expect(hero).toHaveTextContent('3개');
    expect(hero).toHaveTextContent('새 단어 6개도 기다리고 있어요');
    expect(screen.getByText('🔥 3일')).toBeInTheDocument();
    expect(screen.getByText('오늘 학습하면 이어져요')).toBeInTheDocument();
    expect(screen.getByText('15개')).toBeInTheDocument();
    expect(screen.getByText('합계 17개')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '학습 시작' })).toHaveAttribute('href', '/study');
  });

  it('할 일이 없으면 완료 메시지를 보여 준다', async () => {
    await db.words.bulkAdd([makeWord('w0')]);
    await db.reviews.put(makeState('w0', '2026-10-09'));
    await db.studyLogs.put({ date: '2026-10-04', reviewedCount: 5, correctCount: 5 });
    render(<Dashboard />);
    expect(await screen.findByText('오늘 할 학습을 모두 마쳤어요! 🎉')).toBeInTheDocument();
    expect(screen.getByText('🔥 1일')).toBeInTheDocument();
    expect(screen.getByText('오늘 5개 학습')).toBeInTheDocument();
  });
});
