import { signup } from '@/content/landing';
import type { SignupData, SwimFrequency } from '@/lib/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;
// 국내 휴대폰 번호: 010/011/016/017/018/019, 하이픈·공백은 무시
const PHONE_PATTERN = /^01[016789]\d{7,8}$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export function normalizePhone(phone: string): string {
  return phone.replace(/[\s-]/g, '');
}

export function isValidPhone(phone: string): boolean {
  return PHONE_PATTERN.test(normalizePhone(phone));
}

/** 입력 중인 번호를 010-1234-5678 형태로 맞춘다 */
export function formatPhone(phone: string): string {
  const digits = phone.replace(/\D/g, '').slice(0, 11);
  if (digits.length < 4) return digits;
  if (digits.length < 8) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  const middle = digits.length === 11 ? 4 : 3;
  return `${digits.slice(0, 3)}-${digits.slice(3, 3 + middle)}-${digits.slice(3 + middle)}`;
}

export type SignupField = 'name' | 'phone' | 'email' | 'frequency' | 'goal' | 'agreed';
export type SignupErrors = Partial<Record<SignupField, string>>;

/** 화면에 보이는 순서대로 첫 번째 에러를 찾을 때 사용 */
export const signupFieldOrder: readonly SignupField[] = ['name', 'phone', 'email', 'frequency', 'goal', 'agreed'];

/** 작성 중인 폼: 필수 선택 항목이 아직 비어 있을 수 있다 */
export type SignupDraft = Omit<SignupData, 'frequency'> & { frequency?: SwimFrequency };

export function validateSignup(data: SignupDraft): SignupErrors {
  const errors: SignupErrors = {};
  const { errors: msg, limits } = signup;

  const name = data.name.trim();
  if (!name) errors.name = msg.nameRequired;
  else if (name.length > limits.name) errors.name = msg.nameTooLong;

  if (!data.phone.trim()) errors.phone = msg.phoneRequired;
  else if (!isValidPhone(data.phone)) errors.phone = msg.phoneInvalid;

  const email = data.email.trim();
  if (!email) errors.email = msg.emailRequired;
  else if (!isValidEmail(email)) errors.email = msg.emailInvalid;

  if (!data.frequency) errors.frequency = msg.frequencyRequired;

  if (data.goal && data.goal.trim().length > limits.goal) errors.goal = msg.goalTooLong;

  if (!data.agreed) errors.agreed = msg.agreeRequired;
  return errors;
}
