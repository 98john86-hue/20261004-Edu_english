import { addDays, parseLocalDate } from './date';
import type { StudyLog } from './types';

export function accuracyPercent(correct: number, total: number): number {
  if (total <= 0) return 0;
  return Math.round((correct / total) * 100);
}

const WEEKDAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'] as const;

export function weekdayLabel(date: string): string {
  return WEEKDAY_LABELS[parseLocalDate(date).getDay()];
}

// 연속 학습일: 하루라도 1개 이상 학습한 날이 끊김 없이 이어진 일수(로컬 날짜 기준).
// 오늘 아직 학습하지 않았어도 어제까지 이어졌다면 오늘 밤 자정 전까지는 기회가
// 남아 있으므로 끊긴 것으로 보지 않고 어제부터 센다.
export function calcStreak(logs: readonly StudyLog[], today: string): number {
  const studiedDays = new Set(logs.filter((log) => log.reviewedCount > 0).map((log) => log.date));
  let day = studiedDays.has(today) ? today : addDays(today, -1);
  let streak = 0;
  while (studiedDays.has(day)) {
    streak += 1;
    day = addDays(day, -1);
  }
  return streak;
}

export interface DailyCount {
  date: string;
  label: string;
  reviewedCount: number;
  correctCount: number;
}

export function lastNDays(logs: readonly StudyLog[], today: string, days = 7): DailyCount[] {
  const byDate = new Map(logs.map((log) => [log.date, log]));
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i - (days - 1));
    const log = byDate.get(date);
    return {
      date,
      label: weekdayLabel(date),
      reviewedCount: log?.reviewedCount ?? 0,
      correctCount: log?.correctCount ?? 0,
    };
  });
}

// 막대 높이 기준이 되는 축 최댓값. 1, 2, 5 × 10ⁿ 단계로 올려서 눈금이 깔끔하게 떨어지게 한다.
// 학습량이 아주 적은 날(1~2개) 막대가 차트를 꽉 채워 과장돼 보이지 않도록 최소 5로 둔다.
export const MIN_AXIS_MAX = 5;

export function niceMax(value: number): number {
  if (value <= MIN_AXIS_MAX) return MIN_AXIS_MAX;
  const exponent = Math.floor(Math.log10(value));
  const base = 10 ** exponent;
  for (const step of [1, 2, 5, 10]) {
    if (value <= step * base) return step * base;
  }
  return 10 * base;
}
