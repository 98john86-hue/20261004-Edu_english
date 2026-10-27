import { afterEach, describe, expect, it, vi } from 'vitest';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import { formatLogDate } from '@/lib/date';
import { MOCK_DELAY_MS, submitSignup } from '@/lib/signup';
import { isValidEmail, validateSignup } from '@/lib/validation';

describe('isValidEmail', () => {
  it.each(['swimmer@example.com', 'a.b+tag@mail.co.kr', '  trim@example.com  '])('정상: %s', (email) => {
    expect(isValidEmail(email)).toBe(true);
  });

  it.each(['', 'plainaddress', 'no-at.example.com', 'a@b', 'a@.com', 'a b@example.com', '@example.com', 'a@example.'])(
    '비정상: "%s"',
    (email) => {
      expect(isValidEmail(email)).toBe(false);
    },
  );
});

describe('validateSignup', () => {
  it('빈 이메일과 미동의에 각각 에러를 반환한다', () => {
    const errors = validateSignup({ email: '', level: 'beginner', agreed: false });
    expect(errors.email).toBeDefined();
    expect(errors.agreed).toBeDefined();
  });

  it('올바른 입력이면 에러가 없다', () => {
    expect(validateSignup({ email: 'a@example.com', level: 'advanced', agreed: true })).toEqual({});
  });
});

describe('getTotalDistance', () => {
  it('25m 레인 6바퀴(왕복) = 300m', () => {
    expect(getTotalDistance({ laneLength: 25, laps: 6 })).toBe(300);
  });

  it('25m 레인 10바퀴(왕복) = 500m', () => {
    expect(getTotalDistance({ laneLength: 25, laps: 10 })).toBe(500);
  });

  it('50m 레인 15바퀴(왕복) = 1500m', () => {
    expect(getTotalDistance({ laneLength: 50, laps: 15 })).toBe(1500);
  });

  it('0이나 잘못된 값은 0으로 처리한다', () => {
    expect(getTotalDistance({ laneLength: 25, laps: 0 })).toBe(0);
    expect(getTotalDistance({ laneLength: 25, laps: Number.NaN })).toBe(0);
    expect(getTotalDistance({ laneLength: -25, laps: 4 })).toBe(0);
  });

  it('천 단위 구분 기호로 표시한다', () => {
    expect(formatMeters(1500)).toBe('1,500m');
  });
});

describe('formatLogDate', () => {
  it('날짜와 요일을 한국어로 표시한다', () => {
    expect(formatLogDate('2026-11-12')).toBe('11월 12일 (목)');
  });
});

describe('submitSignup', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('1초 지연 후 성공을 반환한다', async () => {
    vi.useFakeTimers();
    let settled = false;
    const promise = submitSignup({ email: 'swimmer@example.com', level: 'beginner', agreed: true }).then((r) => {
      settled = true;
      return r;
    });

    await vi.advanceTimersByTimeAsync(MOCK_DELAY_MS - 1);
    expect(settled).toBe(false);
    await vi.advanceTimersByTimeAsync(1);
    await expect(promise).resolves.toEqual({ ok: true });
  });

  it('잘못된 입력은 실패와 메시지를 반환한다', async () => {
    const result = await submitSignup({ email: 'bad', level: 'beginner', agreed: true });
    expect(result.ok).toBe(false);
  });
});
