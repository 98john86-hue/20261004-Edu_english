import { describe, expect, it } from 'vitest';
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
