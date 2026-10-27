import { weekdays } from '@/content/landing';

/** 'YYYY-MM-DD' → '11월 12일 (목)'. 시간대 영향을 받지 않도록 UTC 기준으로 계산한다. */
export function formatLogDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d) return date;
  const weekday = weekdays[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];
  return `${m}월 ${d}일 (${weekday})`;
}
