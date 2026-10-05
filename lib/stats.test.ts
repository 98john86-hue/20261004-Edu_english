import { describe, expect, it } from 'vitest';
import { accuracyPercent, calcStreak, lastNDays, niceMax, weekdayLabel } from './stats';
import type { StudyLog } from './types';

function log(date: string, reviewedCount = 1, correctCount = reviewedCount): StudyLog {
  return { date, reviewedCount, correctCount };
}

describe('accuracyPercent', () => {
  it('반올림한 백분율', () => {
    expect(accuracyPercent(2, 3)).toBe(67);
    expect(accuracyPercent(10, 10)).toBe(100);
    expect(accuracyPercent(0, 4)).toBe(0);
  });

  it('학습 수가 0이면 0%', () => {
    expect(accuracyPercent(0, 0)).toBe(0);
  });
});

describe('calcStreak', () => {
  const TODAY = '2026-10-04';

  it('기록이 없으면 0', () => {
    expect(calcStreak([], TODAY)).toBe(0);
  });

  it('오늘까지 이어진 날을 센다', () => {
    expect(calcStreak([log('2026-10-02'), log('2026-10-03'), log('2026-10-04')], TODAY)).toBe(3);
  });

  it('오늘 아직 안 했어도 어제까지 이어졌으면 유지된다', () => {
    expect(calcStreak([log('2026-10-02'), log('2026-10-03')], TODAY)).toBe(2);
  });

  it('어제를 건너뛰었으면 0', () => {
    expect(calcStreak([log('2026-10-01'), log('2026-10-02')], TODAY)).toBe(0);
  });

  it('중간에 하루 비면 거기서 끊긴다', () => {
    expect(calcStreak([log('2026-09-30'), log('2026-10-02'), log('2026-10-03'), log('2026-10-04')], TODAY)).toBe(3);
  });

  it('학습 수가 0인 기록은 학습한 날로 치지 않는다', () => {
    expect(calcStreak([log('2026-10-03'), log('2026-10-04', 0, 0)], TODAY)).toBe(1);
  });

  it('월말과 연말을 넘어서도 이어진다', () => {
    const logs = [log('2026-12-30'), log('2026-12-31'), log('2027-01-01')];
    expect(calcStreak(logs, '2027-01-01')).toBe(3);
    expect(calcStreak([log('2026-02-28'), log('2026-03-01')], '2026-03-01')).toBe(2);
  });

  it('입력 순서와 상관없다', () => {
    expect(calcStreak([log('2026-10-04'), log('2026-10-02'), log('2026-10-03')], TODAY)).toBe(3);
  });
});

describe('lastNDays', () => {
  it('오늘을 포함한 최근 7일을 오래된 순서로, 기록이 없는 날은 0으로 채운다', () => {
    const days = lastNDays([log('2026-09-28', 5, 3), log('2026-10-04', 12, 10), log('2026-09-01', 99)], '2026-10-04');
    expect(days.map((d) => d.date)).toEqual([
      '2026-09-28',
      '2026-09-29',
      '2026-09-30',
      '2026-10-01',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
    ]);
    expect(days.map((d) => d.reviewedCount)).toEqual([5, 0, 0, 0, 0, 0, 12]);
    expect(days[6]).toEqual({ date: '2026-10-04', label: '일', reviewedCount: 12, correctCount: 10 });
  });

  it('연초에는 작년 날짜까지 거슬러 간다', () => {
    expect(lastNDays([], '2027-01-02', 3).map((d) => d.date)).toEqual(['2026-12-31', '2027-01-01', '2027-01-02']);
  });
});

describe('weekdayLabel', () => {
  it('로컬 날짜의 요일', () => {
    expect(weekdayLabel('2026-10-04')).toBe('일');
    expect(weekdayLabel('2026-10-05')).toBe('월');
    expect(weekdayLabel('2026-10-10')).toBe('토');
  });
});

describe('niceMax', () => {
  it('1·2·5 단위로 올리고, 최소 5', () => {
    expect(niceMax(0)).toBe(5);
    expect(niceMax(1)).toBe(5);
    expect(niceMax(3)).toBe(5);
    expect(niceMax(6)).toBe(10);
    expect(niceMax(7)).toBe(10);
    expect(niceMax(10)).toBe(10);
    expect(niceMax(12)).toBe(20);
    expect(niceMax(37)).toBe(50);
    expect(niceMax(120)).toBe(200);
  });
});
