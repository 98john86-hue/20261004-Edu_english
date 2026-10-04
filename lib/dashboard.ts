import { lastNDays, calcStreak, type DailyCount } from './stats';
import type { StudyLog } from './types';

export interface DashboardInput {
  today: string;
  dueCount: number;
  totalWords: number;
  studiedWords: number;
  newWordsPerDay: number;
  newWordsIntroducedToday: number;
  logs: readonly StudyLog[];
}

export interface DashboardSummary {
  dueCount: number;
  newWordsAvailable: number;
  totalWords: number;
  streak: number;
  todayReviewed: number;
  week: DailyCount[];
}

export function summarizeDashboard(input: DashboardInput): DashboardSummary {
  const unstudied = Math.max(0, input.totalWords - input.studiedWords);
  const newQuota = Math.max(0, input.newWordsPerDay - input.newWordsIntroducedToday);
  const week = lastNDays(input.logs, input.today);
  return {
    dueCount: input.dueCount,
    newWordsAvailable: Math.min(unstudied, newQuota),
    totalWords: input.totalWords,
    streak: calcStreak(input.logs, input.today),
    todayReviewed: week[week.length - 1]?.reviewedCount ?? 0,
    week,
  };
}
