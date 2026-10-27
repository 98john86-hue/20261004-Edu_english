import type { SignupData, SignupResult } from '@/lib/types';
import { signupFieldOrder, validateSignup } from '@/lib/validation';

export const MOCK_DELAY_MS = 1000;

/**
 * 사전 등록 제출. 백엔드가 준비되기 전까지 1초 뒤 성공을 반환하는 mock.
 * 실제 API로 교체할 때는 이 함수 내부만 fetch 호출로 바꾸면 된다.
 */
export async function submitSignup(data: SignupData): Promise<SignupResult> {
  const errors = validateSignup(data);
  const firstError = signupFieldOrder.map((field) => errors[field]).find(Boolean);
  if (firstError) return { ok: false, message: firstError };

  await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));
  return { ok: true };
}
