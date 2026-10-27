import { describe, expect, it } from 'vitest';
import { formatMeters, getTotalDistance } from '@/lib/distance';

describe('getTotalDistance (1바퀴 = 왕복)', () => {
  it('25m 레인 6바퀴 = 300m', () => {
    expect(getTotalDistance({ laneLength: 25, laps: 6 })).toBe(300);
  });

  it('25m 레인 10바퀴 = 500m', () => {
    expect(getTotalDistance({ laneLength: 25, laps: 10 })).toBe(500);
  });

  it('50m 레인 15바퀴 = 1500m', () => {
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
