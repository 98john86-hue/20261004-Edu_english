import type { DistanceLog } from '@/types';

/** 총 거리(m)는 저장하지 않고 계산한다. 1바퀴 = 왕복(레인 2번)이므로 레인 길이 × 2 × 바퀴 수. */
export function getTotalDistance({ laneLength, laps }: Pick<DistanceLog, 'laneLength' | 'laps'>): number {
  if (!Number.isFinite(laneLength) || !Number.isFinite(laps) || laneLength < 0 || laps < 0) return 0;
  return laneLength * 2 * laps;
}

export function formatMeters(meters: number): string {
  return `${meters.toLocaleString('ko-KR')}m`;
}
