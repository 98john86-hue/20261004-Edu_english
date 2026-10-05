import { describe, expect, it } from 'vitest';
import {
  buildQuestion,
  buildQuiz,
  canBuildQuiz,
  CHOICE_COUNT,
  pickDistractors,
  QUIZ_SIZE,
  selectQuizWords,
  wrongAnswers,
  type QuizAnswer,
} from './quiz';
import { createSeededRandom } from './random';
import { makeWord } from './testFixtures';
import type { WordLevel } from './types';

function levelWords(level: WordLevel, count: number, prefix = level) {
  return Array.from({ length: count }, (_, i) =>
    makeWord(`${prefix}-${i}`, { level, term: `${prefix}${i}`, meaning: `${prefix}-뜻${i}` }),
  );
}

const ALL = [...levelWords('beginner', 20), ...levelWords('intermediate', 20), ...levelWords('advanced', 20)];

describe('selectQuizWords', () => {
  it('학습한 단어를 먼저 뽑고 모자라면 새 단어로 채운다', () => {
    const studied = new Set(['beginner-0', 'advanced-3', 'intermediate-7']);
    const picked = selectQuizWords(ALL, studied, 10, createSeededRandom(1));
    expect(picked).toHaveLength(10);
    expect(new Set(picked.slice(0, 3).map((word) => word.id))).toEqual(studied);
    expect(new Set(picked.map((word) => word.id)).size).toBe(10);
  });

  it('학습한 단어가 충분하면 학습한 단어로만 낸다', () => {
    const studied = new Set(ALL.slice(0, 15).map((word) => word.id));
    const picked = selectQuizWords(ALL, studied, 10, createSeededRandom(2));
    expect(picked.every((word) => studied.has(word.id))).toBe(true);
  });
});

describe('pickDistractors', () => {
  it('같은 레벨의 다른 단어 뜻 3개를 고른다', () => {
    const target = ALL.find((word) => word.id === 'intermediate-5')!;
    for (let seed = 0; seed < 20; seed += 1) {
      const distractors = pickDistractors(target, ALL, 3, createSeededRandom(seed));
      expect(distractors).toHaveLength(3);
      expect(new Set(distractors).size).toBe(3);
      expect(distractors).not.toContain(target.meaning);
      expect(distractors.every((meaning) => meaning.startsWith('intermediate-'))).toBe(true);
    }
  });

  it('뜻이 같은 단어는 오답 보기로 쓰지 않는다', () => {
    const target = makeWord('t', { meaning: '빌리다' });
    const words = [
      target,
      makeWord('same', { meaning: ' 빌리다 ' }),
      makeWord('d1', { meaning: 'A' }),
      makeWord('d2', { meaning: 'a' }),
      makeWord('d3', { meaning: 'B' }),
      makeWord('d4', { meaning: 'C' }),
    ];
    const distractors = pickDistractors(target, words, 3, createSeededRandom(5));
    expect(distractors.map((m) => m.toLowerCase()).sort()).toEqual(['a', 'b', 'c']);
  });

  it('같은 레벨 단어가 부족하면 다른 레벨에서 채운다', () => {
    const target = makeWord('u', { level: 'advanced', meaning: '내 단어' });
    const words = [target, makeWord('adv', { level: 'advanced', meaning: '고급 뜻' }), ...levelWords('beginner', 5)];
    const distractors = pickDistractors(target, words, 3, createSeededRandom(3));
    expect(distractors).toHaveLength(3);
    expect(distractors[0]).toBe('고급 뜻');
  });
});

describe('buildQuestion', () => {
  it('정답 1개와 오답 3개를 섞고 정답 위치를 기록한다', () => {
    const target = ALL[0];
    const question = buildQuestion(target, ALL, createSeededRandom(4));
    expect(question?.choices).toHaveLength(CHOICE_COUNT);
    expect(question?.choices[question.answerIndex]).toBe(target.meaning);
  });

  it('정답 위치가 한쪽에 몰리지 않는다', () => {
    const random = createSeededRandom(11);
    const positions = new Set(
      Array.from({ length: 40 }, () => buildQuestion(ALL[0], ALL, random)?.answerIndex),
    );
    expect(positions).toEqual(new Set([0, 1, 2, 3]));
  });

  it('보기를 4개 만들 수 없으면 null', () => {
    const words = levelWords('beginner', 3);
    expect(buildQuestion(words[0], words)).toBeNull();
  });
});

describe('buildQuiz', () => {
  it('서로 다른 단어로 10문제를 만든다', () => {
    const quiz = buildQuiz(ALL, new Set(), createSeededRandom(6));
    expect(quiz).toHaveLength(QUIZ_SIZE);
    expect(new Set(quiz.map((q) => q.word.id)).size).toBe(QUIZ_SIZE);
  });

  it('단어가 10개보다 적으면 있는 만큼만 낸다', () => {
    const words = levelWords('beginner', 6);
    expect(buildQuiz(words, new Set(), createSeededRandom(7))).toHaveLength(6);
  });

  it('서로 다른 뜻이 4개 미만이면 퀴즈를 만들지 않는다', () => {
    const words = [...levelWords('beginner', 3), makeWord('dup', { meaning: 'beginner-뜻0' })];
    expect(canBuildQuiz(words)).toBe(false);
    expect(buildQuiz(words, new Set())).toEqual([]);
  });
});

describe('wrongAnswers', () => {
  it('틀린 문제만 돌려준다', () => {
    const question = buildQuestion(ALL[0], ALL, createSeededRandom(8))!;
    const answers: QuizAnswer[] = [
      { question, selectedIndex: question.answerIndex, correct: true },
      { question, selectedIndex: (question.answerIndex + 1) % 4, correct: false },
    ];
    expect(wrongAnswers(answers)).toEqual([answers[1]]);
  });
});
