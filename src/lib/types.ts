export type Level = 'beginner' | 'intermediate' | 'advanced';

export type Stroke = '자유형' | '배영' | '평영' | '접영' | '기타';

export type DistanceLog = {
  type: 'distance';
  date: string; // 'YYYY-MM-DD'
  laneLength: number; // m 단위, 예: 25
  laps: number; // 예: 6
};

export type LearningLog = {
  type: 'learning';
  date: string;
  stroke?: Stroke;
  note: string;
};

export type SwimLog = DistanceLog | LearningLog;

export type SignupData = { email: string; level: Level; agreed: boolean };
export type SignupResult = { ok: true } | { ok: false; message: string };

/** 30일 미리보기 그리드의 하루 상태 */
export type DayStatus = 'distance' | 'learning' | 'both' | 'upcoming';
