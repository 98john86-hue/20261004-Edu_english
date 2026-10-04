import { create } from 'zustand';
import { getRepositories } from '@/db';
import { todayLocal } from '@/lib/date';
import { buildQuiz, type QuizAnswer, type QuizQuestion } from '@/lib/quiz';

export type QuizStatus = 'idle' | 'loading' | 'answering' | 'answered' | 'finished' | 'insufficient' | 'error';

interface QuizSessionState {
  status: QuizStatus;
  questions: QuizQuestion[];
  index: number;
  answers: QuizAnswer[];
  errorMessage: string | null;
  start(): Promise<void>;
  answer(choiceIndex: number): Promise<void>;
  next(): void;
  reset(): void;
}

const INITIAL_STATE = {
  status: 'idle' as QuizStatus,
  questions: [] as QuizQuestion[],
  index: 0,
  answers: [] as QuizAnswer[],
  errorMessage: null as string | null,
};

let sessionToken = 0;

export const useQuizSession = create<QuizSessionState>()((set, get) => ({
  ...INITIAL_STATE,

  async start() {
    const token = ++sessionToken;
    set({ ...INITIAL_STATE, status: 'loading' });
    try {
      const repos = getRepositories();
      const [words, reviewStates] = await Promise.all([repos.words.getAll(), repos.reviews.getAll()]);
      const questions = buildQuiz(words, new Set(reviewStates.map((state) => state.wordId)));
      if (token !== sessionToken) return;
      set({ status: questions.length > 0 ? 'answering' : 'insufficient', questions });
    } catch {
      if (token !== sessionToken) return;
      set({ status: 'error', errorMessage: '퀴즈를 만들지 못했어요.' });
    }
  },

  // 퀴즈는 SM-2 복습 상태를 건드리지 않고 학습 기록(StudyLog)에만 남긴다.
  // 중간에 그만둬도 푼 만큼은 기록되도록 문제마다 바로 저장한다.
  async answer(choiceIndex) {
    const { status, questions, index } = get();
    const question = questions[index];
    if (status !== 'answering' || !question || choiceIndex < 0 || choiceIndex >= question.choices.length) return;

    const correct = choiceIndex === question.answerIndex;
    set((state) => ({
      status: 'answered',
      answers: [...state.answers, { question, selectedIndex: choiceIndex, correct }],
    }));

    try {
      await getRepositories().studyLogs.increment(todayLocal(), 1, correct ? 1 : 0);
    } catch {
      set({ errorMessage: '학습 기록을 저장하지 못했어요.' });
    }
  },

  next() {
    const { status, index, questions } = get();
    if (status !== 'answered') return;
    const nextIndex = index + 1;
    set({
      index: nextIndex,
      status: nextIndex >= questions.length ? 'finished' : 'answering',
    });
  },

  reset() {
    sessionToken += 1;
    set({ ...INITIAL_STATE });
  },
}));
