import { signup } from '@/content/landing';
import type { SignupData } from '@/types';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_PATTERN.test(email.trim());
}

export type SignupErrors = Partial<Record<'email' | 'agreed', string>>;

export function validateSignup(data: SignupData): SignupErrors {
  const errors: SignupErrors = {};
  const email = data.email.trim();
  if (!email) errors.email = signup.errors.emailRequired;
  else if (!isValidEmail(email)) errors.email = signup.errors.emailInvalid;
  if (!data.agreed) errors.agreed = signup.errors.agreeRequired;
  return errors;
}
