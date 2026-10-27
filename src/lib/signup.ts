import type { SignupData, SignupResult } from '@/types';
import { validateSignup } from '@/lib/validation';

export const MOCK_DELAY_MS = 1000;

/**
 * 사전 등록 제출. 백엔드가 준비되기 전까지 1초 뒤 성공을 반환하는 mock.
 * 실제 API로 교체할 때는 이 함수 내부만 fetch 호출로 바꾸면 된다.
 */
export async function submitSignup(data: SignupData): Promise<SignupResult> {
  const errors = validateSignup(data);
  const firstError = errors.email ?? errors.agreed;
  if (firstError) return { ok: false, message: firstError };

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return { ok: true };
}
