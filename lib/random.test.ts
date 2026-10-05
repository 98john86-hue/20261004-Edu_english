import { describe, expect, it } from 'vitest';
import { createSeededRandom, shuffle } from './random';

describe('shuffle', () => {
  it('원본을 바꾸지 않고 같은 원소를 모두 담은 새 배열을 돌려준다', () => {
    const items = [1, 2, 3, 4, 5, 6];
    const result = shuffle(items, createSeededRandom(1));
    expect(items).toEqual([1, 2, 3, 4, 5, 6]);
    expect([...result].sort()).toEqual(items);
  });

  it('같은 시드면 같은 순서', () => {
    const a = shuffle([1, 2, 3, 4, 5, 6, 7, 8], createSeededRandom(42));
    const b = shuffle([1, 2, 3, 4, 5, 6, 7, 8], createSeededRandom(42));
    expect(a).toEqual(b);
  });

  it('random이 항상 0에 가까우면 예측 가능한 순서가 된다', () => {
    expect(shuffle(['a', 'b', 'c'], () => 0)).toEqual(['b', 'c', 'a']);
  });

  it('빈 배열과 한 개짜리 배열', () => {
    expect(shuffle([])).toEqual([]);
    expect(shuffle(['x'])).toEqual(['x']);
  });
});

describe('createSeededRandom', () => {
  it('0 이상 1 미만의 값을 낸다', () => {
    const random = createSeededRandom(7);
    for (let i = 0; i < 1000; i += 1) {
      const value = random();
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThan(1);
    }
  });
});
