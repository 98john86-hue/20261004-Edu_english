import { describe, expect, it } from 'vitest';
import { accuracyPercent } from './stats';

describe('accuracyPercent', () => {
  it('반올림한 백분율', () => {
    expect(accuracyPercent(2, 3)).toBe(67);
    expect(accuracyPercent(10, 10)).toBe(100);
    expect(accuracyPercent(0, 4)).toBe(0);
  });

  it('학습 수가 0이면 0%', () => {
    expect(accuracyPercent(0, 0)).toBe(0);
  });
});
