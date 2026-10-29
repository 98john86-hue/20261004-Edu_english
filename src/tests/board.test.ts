import { describe, expect, it } from 'vitest';
import {
  addDays,
  buildSampleLogs,
  formatShortDate,
  getDayLogs,
  getWeekDates,
  rankByWeek,
  replaceDayLogs,
  summarizeWeek,
} from '@/lib/board';
import type { SwimLog } from '@/lib/types';

const START = '2026-11-02'; // 월요일

describe('주차 날짜', () => {
  it('월말을 넘어가도 날짜를 더한다', () => {
    expect(addDays('2026-11-30', 2)).toBe('2026-12-02');
  });

  it('n주차의 월~금 5일을 반환한다', () => {
    expect(getWeekDates(START, 0)).toEqual(['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06']);
    expect(getWeekDates(START, 3)[4]).toBe('2026-11-27');
  });

  it('짧은 날짜로 표시한다', () => {
    expect(formatShortDate('2026-11-02')).toBe('11/2');
  });
});

const dist = (date: string): SwimLog => ({ type: 'distance', date, laneLength: 25, laps: 6 });
const learn = (date: string): SwimLog => ({ type: 'learning', date, note: '호흡' });

describe('summarizeWeek / rankByWeek', () => {
  const week = getWeekDates(START, 0);

  it('그 주의 기록 수와 인증한 날 수를 센다 (다른 주 기록 제외)', () => {
    const logs = [dist('2026-11-02'), learn('2026-11-02'), dist('2026-11-04'), dist('2026-11-09')];
    expect(summarizeWeek(logs, week)).toEqual({ logs: 3, days: 2 });
  });

  it('기록이 많은 참여자가 위로, 같으면 인증한 날이 많은 순, 그래도 같으면 원래 순서', () => {
    const rows = [
      { id: 'few', logs: [dist('2026-11-02')] },
      { id: 'tieDaysLess', logs: [dist('2026-11-03'), learn('2026-11-03')] },
      { id: 'many', logs: [dist('2026-11-02'), learn('2026-11-02'), dist('2026-11-03')] },
      { id: 'tieDaysMore', logs: [dist('2026-11-03'), dist('2026-11-04')] },
      { id: 'none', logs: [] },
    ];
    expect(rankByWeek(rows, week).map((r) => r.id)).toEqual(['many', 'tieDaysMore', 'tieDaysLess', 'few', 'none']);
  });

  it('주간 목표를 달성한 참여자가 기록 수와 상관없이 위로 온다', () => {
    const rows = [
      { id: 'manyLogsNotMet', goal: 4, logs: [dist('2026-11-02'), learn('2026-11-02'), dist('2026-11-03'), learn('2026-11-03'), dist('2026-11-04')] },
      { id: 'met', goal: 3, logs: [dist('2026-11-02'), dist('2026-11-03'), dist('2026-11-04')] },
    ];
    expect(rankByWeek(rows, week).map((r) => r.id)).toEqual(['met', 'manyLogsNotMet']);
  });
});

describe('getDayLogs / replaceDayLogs', () => {
  it('그날의 거리·배운 점 기록을 찾는다', () => {
    const day = getDayLogs([dist('2026-11-02'), learn('2026-11-02'), dist('2026-11-03')], '2026-11-02');
    expect(day.distance?.type).toBe('distance');
    expect(day.learning?.type).toBe('learning');
  });

  it('그날 기록을 바꾸거나 지운다', () => {
    const logs = [dist('2026-11-02'), learn('2026-11-03')];
    const replaced = replaceDayLogs(logs, '2026-11-02', { learning: { type: 'learning', date: '2026-11-02', note: '새 기록' } });
    expect(replaced).toHaveLength(2);
    expect(getDayLogs(replaced, '2026-11-02').distance).toBeUndefined();
    expect(replaceDayLogs(logs, '2026-11-03', {})).toEqual([dist('2026-11-02')]);
  });
});

describe('buildSampleLogs', () => {
  it('패턴 문자를 기록으로 바꾼다 (D=거리, L=배운 점, B=둘 다)', () => {
    const pools = { distances: [[25, 6]] as const, notes: [{ stroke: '자유형', note: '팔 옆으로' }] as const };
    const logs = buildSampleLogs(['DLB--'], START, pools);
    expect(summarizeWeek(logs, getWeekDates(START, 0))).toEqual({ logs: 4, days: 3 });
    expect(getDayLogs(logs, '2026-11-04').distance).toBeDefined();
    expect(getDayLogs(logs, '2026-11-04').learning).toBeDefined();
  });
});
