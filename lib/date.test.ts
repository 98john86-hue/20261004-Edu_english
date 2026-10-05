import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import {
  addDays,
  diffDays,
  isValidDateString,
  parseLocalDate,
  toLocalDateString,
  todayLocal,
} from './date';

function withTimeZone(timeZone: string, run: () => void) {
  const original = process.env.TZ;
  beforeAll(() => {
    process.env.TZ = timeZone;
  });
  afterAll(() => {
    process.env.TZ = original;
  });
  run();
}

describe('toLocalDateString / todayLocal', () => {
  it('로컬 날짜를 0으로 채운 YYYY-MM-DD로 만든다', () => {
    expect(toLocalDateString(new Date(2026, 0, 5))).toBe('2026-01-05');
    expect(todayLocal(new Date(2026, 9, 4, 23, 59, 59))).toBe('2026-10-04');
    expect(todayLocal(new Date(2026, 9, 5, 0, 0, 0))).toBe('2026-10-05');
  });

  describe('한국 시간대', () => {
    withTimeZone('Asia/Seoul', () => {
      it('UTC로는 전날이어도 로컬 날짜를 쓴다', () => {
        const kstEarlyMorning = new Date('2026-10-04T15:30:00Z');
        expect(kstEarlyMorning.toISOString().slice(0, 10)).toBe('2026-10-04');
        expect(todayLocal(kstEarlyMorning)).toBe('2026-10-05');
      });
    });
  });
});

describe('isValidDateString', () => {
  it('형식과 실제 존재하는 날짜인지 검사한다', () => {
    expect(isValidDateString('2026-10-04')).toBe(true);
    expect(isValidDateString('2028-02-29')).toBe(true);
    expect(isValidDateString('2026-02-29')).toBe(false);
    expect(isValidDateString('2026-13-01')).toBe(false);
    expect(isValidDateString('2026-4-1')).toBe(false);
    expect(isValidDateString('')).toBe(false);
  });
});

describe('parseLocalDate', () => {
  it('로컬 자정의 Date를 돌려준다', () => {
    const date = parseLocalDate('2026-10-04');
    expect([date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()]).toEqual([2026, 9, 4, 0]);
  });

  it('잘못된 날짜는 RangeError', () => {
    expect(() => parseLocalDate('2026-02-30')).toThrow(RangeError);
  });
});

describe('addDays', () => {
  it('월말을 넘긴다', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-04-30', 1)).toBe('2026-05-01');
    expect(addDays('2026-01-31', 30)).toBe('2026-03-02');
  });

  it('윤년과 평년의 2월을 구분한다', () => {
    expect(addDays('2026-02-28', 1)).toBe('2026-03-01');
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29');
    expect(addDays('2028-02-29', 1)).toBe('2028-03-01');
  });

  it('연말을 넘긴다', () => {
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01');
    expect(addDays('2026-12-28', 6)).toBe('2027-01-03');
    expect(addDays('2026-12-15', 365)).toBe('2027-12-15');
  });

  it('음수와 0도 처리한다', () => {
    expect(addDays('2027-01-01', -1)).toBe('2026-12-31');
    expect(addDays('2026-10-04', 0)).toBe('2026-10-04');
  });

  describe('서머타임이 있는 시간대', () => {
    withTimeZone('America/New_York', () => {
      it('서머타임 시작·종료일을 지나도 날짜가 하루씩 정확히 늘어난다', () => {
        expect(addDays('2026-03-07', 1)).toBe('2026-03-08');
        expect(addDays('2026-03-08', 1)).toBe('2026-03-09');
        expect(addDays('2026-10-31', 1)).toBe('2026-11-01');
        expect(addDays('2026-11-01', 1)).toBe('2026-11-02');
        expect(diffDays('2026-03-01', '2026-03-15')).toBe(14);
      });
    });
  });
});

describe('diffDays', () => {
  it('두 날짜 사이의 달력 일수를 센다', () => {
    expect(diffDays('2026-10-04', '2026-10-04')).toBe(0);
    expect(diffDays('2026-10-04', '2026-10-05')).toBe(1);
    expect(diffDays('2026-10-05', '2026-10-04')).toBe(-1);
    expect(diffDays('2026-12-31', '2027-01-01')).toBe(1);
    expect(diffDays('2028-02-01', '2028-03-01')).toBe(29);
  });
});
