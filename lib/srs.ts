import { addDays, isValidDateString } from './date';
import type { ReviewState } from './types';

export type Grade = 0 | 1 | 2 | 3;

export const INITIAL_EASE_FACTOR = 2.5;
export const MIN_EASE_FACTOR = 1.3;
export const PASSING_QUALITY = 3;

export const GRADE_LABELS: Record<Grade, string> = {
  0: '다시',
  1: '어려움',
  2: '보통',
  3: '쉬움',
};

// 앱의 4단계 평가를 SM-2 품질 점수(0~5)로 바꾼다.
// - 다시(0)   → q=1: 기억하지 못함. q<3이면 SM-2에서 실패로 처리된다.
//   q=0이 아닌 1을 쓰는 이유는 "뜻을 보고 나서야 알아본" 상태가 앱의 '다시'에 가장
//   가깝기 때문이다. q=0(완전한 백지)을 따로 받지 않으므로 easeFactor 감소 폭도
//   0.8이 아닌 0.54로 덜 가혹하다.
// - 어려움(1) → q=3: 힘들게 떠올림. 통과지만 easeFactor가 0.14 줄어 간격이 덜 늘어난다.
// - 보통(2)   → q=4: 약간 망설인 정답. easeFactor 변화 없음.
// - 쉬움(3)   → q=5: 바로 떠올림. easeFactor가 0.1 늘어난다.
export const GRADE_TO_QUALITY: Record<Grade, number> = {
  0: 1,
  1: 3,
  2: 4,
  3: 5,
};

export function isCorrectGrade(grade: Grade): boolean {
  return GRADE_TO_QUALITY[grade] >= PASSING_QUALITY;
}

export function createInitialReviewState(wordId: string, today: string): ReviewState {
  return {
    wordId,
    easeFactor: INITIAL_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    dueDate: today,
  };
}

// SM-2 easeFactor 공식: EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02))
// 원래 SM-2의 "모든 복습 뒤에 EF를 갱신한다"는 단계에 따라 실패(q<3)에도 적용한다.
// 실패할 때 바뀌지 않는 것은 EF를 2.5로 되돌리지 않는다는 뜻이다. 소수점 오차가
// 쌓이지 않게 둘째 자리에서 반올림하고, 1.3 아래로 내려가지 않게 한다.
function nextEaseFactor(easeFactor: number, quality: number): number {
  const delta = 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02);
  const next = Math.round((easeFactor + delta) * 100) / 100;
  return Math.max(MIN_EASE_FACTOR, next);
}

export function review(state: ReviewState, grade: Grade, today: string): ReviewState {
  if (!isValidDateString(today)) {
    throw new RangeError(`잘못된 날짜 형식입니다: ${today}`);
  }

  const quality = GRADE_TO_QUALITY[grade];
  const easeFactor = nextEaseFactor(state.easeFactor, quality);

  if (quality < PASSING_QUALITY) {
    // 실패하면 처음 외우는 단어처럼 다시 시작한다. 다음 날 다시 보여 준다.
    return {
      wordId: state.wordId,
      easeFactor,
      interval: 1,
      repetitions: 0,
      dueDate: addDays(today, 1),
      lastReviewedAt: today,
    };
  }

  // 간격 I(1)=1, I(2)=6, I(n)=I(n-1)×EF. 원래 SM-2 순서대로 간격은 이번 복습 전의 EF로
  // 계산하고, 갱신된 EF는 다음 간격부터 반영된다.
  let interval: number;
  if (state.repetitions === 0) {
    interval = 1;
  } else if (state.repetitions === 1) {
    interval = 6;
  } else {
    interval = Math.max(1, Math.round(state.interval * state.easeFactor));
  }

  return {
    wordId: state.wordId,
    easeFactor,
    interval,
    repetitions: state.repetitions + 1,
    dueDate: addDays(today, interval),
    lastReviewedAt: today,
  };
}
