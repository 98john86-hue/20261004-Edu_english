import { describe, expect, it } from 'vitest';
import {
  createInitialReviewState,
  describeInterval,
  GRADE_TO_QUALITY,
  INITIAL_EASE_FACTOR,
  isCorrectGrade,
  MIN_EASE_FACTOR,
  review,
  type Grade,
} from './srs';
import type { ReviewState } from './types';

const TODAY = '2026-10-04';

function fresh(today = TODAY): ReviewState {
  return createInitialReviewState('w1', today);
}

function reviewSequence(grades: Grade[], start = TODAY): ReviewState {
  let state = fresh(start);
  let day = start;
  for (const grade of grades) {
    state = review(state, grade, day);
    day = state.dueDate;
  }
  return state;
}

describe('createInitialReviewState', () => {
  it('easeFactor 2.5, 반복 0회, 오늘 바로 학습할 수 있는 상태로 만든다', () => {
    expect(fresh()).toEqual({
      wordId: 'w1',
      easeFactor: INITIAL_EASE_FACTOR,
      interval: 0,
      repetitions: 0,
      dueDate: TODAY,
    });
  });
});

describe('평가 매핑', () => {
  it('다시만 실패이고 나머지는 통과다', () => {
    expect(GRADE_TO_QUALITY).toEqual({ 0: 1, 1: 3, 2: 4, 3: 5 });
    expect([0, 1, 2, 3].map((g) => isCorrectGrade(g as Grade))).toEqual([false, true, true, true]);
  });
});

describe('review: 첫 복습', () => {
  it.each([
    [1, 2.36],
    [2, 2.5],
    [3, 2.6],
  ] as const)('평가 %i이면 1일 뒤 복습, easeFactor %f', (grade, easeFactor) => {
    const next = review(fresh(), grade, TODAY);
    expect(next).toEqual({
      wordId: 'w1',
      easeFactor,
      interval: 1,
      repetitions: 1,
      dueDate: '2026-10-05',
      lastReviewedAt: TODAY,
    });
  });

  it('다시(0)이면 내일 다시 보고 반복 횟수는 0', () => {
    const next = review(fresh(), 0, TODAY);
    expect(next).toMatchObject({ interval: 1, repetitions: 0, dueDate: '2026-10-05', easeFactor: 1.96 });
  });

  it('입력 상태를 바꾸지 않는다', () => {
    const state = fresh();
    const snapshot = { ...state };
    review(state, 3, TODAY);
    expect(state).toEqual(snapshot);
  });
});

describe('review: 연속 성공', () => {
  it('보통으로 계속 맞히면 간격이 1 → 6 → 15 → 38일로 늘어난다', () => {
    let state = fresh();
    const intervals: number[] = [];
    const dueDates: string[] = [];
    let day = TODAY;
    for (let i = 0; i < 4; i += 1) {
      state = review(state, 2, day);
      intervals.push(state.interval);
      dueDates.push(state.dueDate);
      day = state.dueDate;
    }
    expect(intervals).toEqual([1, 6, 15, 38]);
    expect(dueDates).toEqual(['2026-10-05', '2026-10-11', '2026-10-26', '2026-12-03']);
    expect(state.repetitions).toBe(4);
    expect(state.easeFactor).toBe(2.5);
  });

  it('간격은 이번 복습 전의 easeFactor로 계산한다', () => {
    const state: ReviewState = { wordId: 'w1', easeFactor: 2.0, interval: 10, repetitions: 3, dueDate: TODAY };
    const next = review(state, 3, TODAY);
    expect(next.interval).toBe(20);
    expect(next.easeFactor).toBe(2.1);
  });

  it('쉬움은 보통보다 간격이 빨리 늘어난다', () => {
    const easy = reviewSequence([3, 3, 3, 3]);
    const good = reviewSequence([2, 2, 2, 2]);
    expect(easy.interval).toBeGreaterThan(good.interval);
  });
});

describe('review: 실패 후 초기화', () => {
  it('오래 외운 단어도 다시(0)이면 반복 0, 간격 1일로 돌아가지만 easeFactor는 2.5로 되돌리지 않는다', () => {
    const learned = reviewSequence([2, 2, 2, 2]);
    expect(learned.interval).toBe(38);

    const failed = review(learned, 0, '2026-12-03');
    expect(failed).toMatchObject({
      interval: 1,
      repetitions: 0,
      dueDate: '2026-12-04',
      easeFactor: 1.96,
      lastReviewedAt: '2026-12-03',
    });

    const relearned = review(failed, 2, '2026-12-04');
    expect(relearned).toMatchObject({ interval: 1, repetitions: 1, dueDate: '2026-12-05' });
    const second = review(relearned, 2, '2026-12-05');
    expect(second).toMatchObject({ interval: 6, repetitions: 2, dueDate: '2026-12-11' });
  });
});

describe('review: easeFactor 최솟값', () => {
  it('계속 실패해도 1.3 아래로 내려가지 않는다', () => {
    const state = reviewSequence([0, 0, 0, 0, 0, 0]);
    expect(state.easeFactor).toBe(MIN_EASE_FACTOR);
  });

  it('어려움을 반복해도 1.3에서 멈추고 간격은 계속 늘어난다', () => {
    let state = fresh();
    let day = TODAY;
    for (let i = 0; i < 12; i += 1) {
      state = review(state, 1, day);
      day = state.dueDate;
      expect(state.easeFactor).toBeGreaterThanOrEqual(MIN_EASE_FACTOR);
    }
    expect(state.easeFactor).toBe(MIN_EASE_FACTOR);
    const next = review(state, 1, day);
    expect(next.interval).toBe(Math.round(state.interval * MIN_EASE_FACTOR));
  });

  it('최솟값 근처에서 쉬움을 받으면 다시 올라간다', () => {
    const state: ReviewState = { wordId: 'w1', easeFactor: 1.3, interval: 6, repetitions: 2, dueDate: TODAY };
    expect(review(state, 3, TODAY).easeFactor).toBe(1.4);
  });
});

describe('review: 날짜 경계', () => {
  it('월말에 복습하면 다음 달로 넘어간다', () => {
    expect(review(fresh('2026-01-31'), 2, '2026-01-31').dueDate).toBe('2026-02-01');
    const second: ReviewState = { wordId: 'w1', easeFactor: 2.5, interval: 1, repetitions: 1, dueDate: '2026-02-26' };
    expect(review(second, 2, '2026-02-26').dueDate).toBe('2026-03-04');
  });

  it('윤년 2월 말을 정확히 계산한다', () => {
    expect(review(fresh('2028-02-28'), 2, '2028-02-28').dueDate).toBe('2028-02-29');
  });

  it('연말에 복습하면 다음 해로 넘어간다', () => {
    expect(review(fresh('2026-12-31'), 0, '2026-12-31').dueDate).toBe('2027-01-01');
    const second: ReviewState = { wordId: 'w1', easeFactor: 2.5, interval: 1, repetitions: 1, dueDate: '2026-12-30' };
    expect(review(second, 2, '2026-12-30').dueDate).toBe('2027-01-05');
  });

  it('잘못된 날짜 문자열은 거부한다', () => {
    expect(() => review(fresh(), 2, '2026/10/04')).toThrow(RangeError);
  });
});

describe('describeInterval', () => {
  it('평가 버튼에 보여 줄 다음 복습 시점 문구', () => {
    expect(describeInterval(0)).toBe('오늘');
    expect(describeInterval(1)).toBe('내일');
    expect(describeInterval(6)).toBe('6일 후');
  });
});
