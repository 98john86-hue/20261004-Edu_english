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

export type ReferralSource = 'youtube' | 'threads' | 'blog' | 'friend' | 'other';

/** 지금 수영하는 빈도 */
export type SwimFrequency = 'once' | 'two-three' | 'five' | 'six';

export type SignupData = {
  name: string; // 이름 또는 닉네임 (필수)
  phone: string; // 연락받을 휴대폰 번호 (필수)
  email: string; // 필수
  frequency: SwimFrequency; // 지금 수영은 어느 정도 하고 계세요? (필수)
  level?: Level; // 수영 강습 레벨 (강습 등록한 경우만, 선택)
  goal?: string; // 30일 동안 가장 바꾸고 싶은 것 (선택)
  referral?: ReferralSource; // 유입 경로 (선택)
  agreed: boolean; // 개인정보 수집·이용 동의 (필수)
};
export type SignupResult = { ok: true } | { ok: false; message: string };

/** 30일 미리보기 그리드의 하루 상태 */
export type DayStatus = 'distance' | 'learning' | 'both' | 'upcoming';
