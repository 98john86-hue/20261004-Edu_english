import { shuffle, type RandomFn } from './random';
import type { Word } from './types';

export const QUIZ_SIZE = 10;
export const CHOICE_COUNT = 4;

export interface QuizQuestion {
  word: Word;
  choices: string[];
  answerIndex: number;
}

export interface QuizAnswer {
  question: QuizQuestion;
  selectedIndex: number;
  correct: boolean;
}

function meaningKey(meaning: string): string {
  return meaning.trim().toLowerCase();
}

// 이미 학습한(복습 기록이 있는) 단어를 먼저 무작위로 뽑고, 모자라면 아직 안 배운 단어로 채운다.
export function selectQuizWords(
  words: readonly Word[],
  studiedWordIds: ReadonlySet<string>,
  size: number = QUIZ_SIZE,
  random: RandomFn = Math.random,
): Word[] {
  const studied = shuffle(
    words.filter((word) => studiedWordIds.has(word.id)),
    random,
  );
  const unstudied = shuffle(
    words.filter((word) => !studiedWordIds.has(word.id)),
    random,
  );
  return [...studied, ...unstudied].slice(0, Math.max(0, size));
}

// 오답 보기는 같은 레벨에서 고르되, 보기끼리 뜻이 같으면 정답이 두 개가 되므로 뜻이
// 겹치는 단어는 건너뛴다. 같은 레벨에 쓸 만한 단어가 부족하면(사용자 단어가 적은
// 경우 등) 다른 레벨에서 채운다.
export function pickDistractors(
  target: Word,
  words: readonly Word[],
  count: number = CHOICE_COUNT - 1,
  random: RandomFn = Math.random,
): string[] {
  const used = new Set([meaningKey(target.meaning)]);
  const result: string[] = [];
  const others = words.filter((word) => word.id !== target.id);
  const sameLevel = shuffle(
    others.filter((word) => word.level === target.level),
    random,
  );
  const otherLevels = shuffle(
    others.filter((word) => word.level !== target.level),
    random,
  );

  for (const word of [...sameLevel, ...otherLevels]) {
    if (result.length >= count) break;
    const key = meaningKey(word.meaning);
    if (used.has(key)) continue;
    used.add(key);
    result.push(word.meaning);
  }
  return result;
}

export function buildQuestion(target: Word, words: readonly Word[], random: RandomFn = Math.random): QuizQuestion | null {
  const distractors = pickDistractors(target, words, CHOICE_COUNT - 1, random);
  if (distractors.length < CHOICE_COUNT - 1) return null;
  const choices = shuffle([target.meaning, ...distractors], random);
  return { word: target, choices, answerIndex: choices.indexOf(target.meaning) };
}

export function countDistinctMeanings(words: readonly Word[]): number {
  return new Set(words.map((word) => meaningKey(word.meaning))).size;
}

export function canBuildQuiz(words: readonly Word[]): boolean {
  return countDistinctMeanings(words) >= CHOICE_COUNT;
}

export function buildQuiz(
  words: readonly Word[],
  studiedWordIds: ReadonlySet<string>,
  random: RandomFn = Math.random,
  size: number = QUIZ_SIZE,
): QuizQuestion[] {
  if (!canBuildQuiz(words)) return [];
  const questions: QuizQuestion[] = [];
  for (const word of selectQuizWords(words, studiedWordIds, words.length, random)) {
    if (questions.length >= size) break;
    const question = buildQuestion(word, words, random);
    if (question) questions.push(question);
  }
  return questions;
}

export function wrongAnswers(answers: readonly QuizAnswer[]): QuizAnswer[] {
  return answers.filter((answer) => !answer.correct);
}
