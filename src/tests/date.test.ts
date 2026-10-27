import { describe, expect, it } from 'vitest';
import { formatLogDate } from '@/lib/date';

describe('formatLogDate', () => {
  it('날짜와 요일을 한국어로 표시한다', () => {
    expect(formatLogDate('2026-11-12')).toBe('11월 12일 (목)');
  });
});
