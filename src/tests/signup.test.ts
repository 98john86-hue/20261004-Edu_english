import { afterEach, describe, expect, it, vi } from 'vitest';
import { MOCK_DELAY_MS, submitSignup } from '@/lib/signup';

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
