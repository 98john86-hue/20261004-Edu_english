import { describe, expect, it } from 'vitest';
import type { SignupData } from '@/lib/types';
import { formatPhone, isValidEmail, isValidPhone, normalizePhone, validateSignup } from '@/lib/validation';

const validData: SignupData = {
  name: '물개',
  phone: '010-1234-5678',
  email: 'swimmer@example.com',
  level: 'beginner',
  agreed: true,
};

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

describe('isValidPhone', () => {
  it.each(['010-1234-5678', '01012345678', '011-123-4567', '010 1234 5678'])('정상: %s', (phone) => {
    expect(isValidPhone(phone)).toBe(true);
  });

  it.each(['', '02-123-4567', '010-123', '012-1234-5678', '010-1234-56789', '0101234abcd'])('비정상: "%s"', (phone) => {
    expect(isValidPhone(phone)).toBe(false);
  });

  it('하이픈과 공백을 제거해 정규화한다', () => {
    expect(normalizePhone('010 1234-5678')).toBe('01012345678');
  });
});

describe('formatPhone', () => {
  it.each([
    ['010', '010'],
    ['0101234', '010-1234'],
    ['01012345678', '010-1234-5678'],
    ['0111234567', '011-123-4567'],
    ['010-1234-5678999', '010-1234-5678'],
  ])('%s → %s', (input, expected) => {
    expect(formatPhone(input)).toBe(expected);
  });
});

describe('validateSignup', () => {
  it('필수 항목이 비어 있으면 각각 에러를 반환한다', () => {
    const errors = validateSignup({ name: ' ', phone: '', email: '', level: 'beginner', agreed: false });
    expect(Object.keys(errors).sort()).toEqual(['agreed', 'email', 'name', 'phone']);
  });

  it('필수 항목만 올바르면 에러가 없다 (선택 항목 생략 가능)', () => {
    expect(validateSignup(validData)).toEqual({});
  });

  it('선택 항목을 포함해도 에러가 없다', () => {
    expect(validateSignup({ ...validData, goal: '호흡 편하게', referral: 'instagram' })).toEqual({});
  });

  it('잘못된 휴대폰 번호에 에러를 반환한다', () => {
    expect(validateSignup({ ...validData, phone: '02-123-4567' }).phone).toBeDefined();
  });

  it('너무 긴 이름과 목표에 에러를 반환한다', () => {
    const errors = validateSignup({ ...validData, name: '가'.repeat(21), goal: '가'.repeat(201) });
    expect(errors.name).toBeDefined();
    expect(errors.goal).toBeDefined();
  });
});
