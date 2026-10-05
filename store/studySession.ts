import { create } from 'zustand';
import { getRepositories } from '@/db';
import { todayLocal } from '@/lib/date';
import { loadSettings } from '@/lib/settings';
import { createInitialReviewState, isCorrectGrade, review, type Grade } from '@/lib/srs';
import { buildStudyQueue, type StudyCard } from '@/lib/studyQueue';

export type StudyStatus = 'idle' | 'loading' | 'studying' | 'finished' | 'empty' | 'error';

export const EXTRA_NEW_WORDS = 10;

export interface StartOptions {
  extraNewWords?: number;
}

interface StudySessionState {
  status: StudyStatus;
  cards: StudyCard[];
  index: number;
  flipped: boolean;
  saving: boolean;
  reviewedCount: number;
  correctCount: number;
  remainingNewCount: number;
  errorMessage: string | null;
  start(options?: StartOptions): Promise<void>;
  flip(): void;
  grade(grade: Grade): Promise<void>;
  reset(): void;
}

const INITIAL_STATE = {
  status: 'idle' as StudyStatus,
  cards: [] as StudyCard[],
  index: 0,
  flipped: false,
  saving: false,
  reviewedCount: 0,
  correctCount: 0,
  remainingNewCount: 0,
  errorMessage: null as string | null,
};

// start()가 겹쳐 호출되면(StrictMode의 이중 effect, 빠른 재시작) 늦게 끝난 이전 요청이
// 새 세션을 덮어쓰지 않도록 세션 번호로 구분한다.
let sessionToken = 0;

export const useStudySession = create<StudySessionState>()((set, get) => ({
  ...INITIAL_STATE,

  async start(options = {}) {
    const token = ++sessionToken;
    set({ ...INITIAL_STATE, status: 'loading' });
    try {
      const repos = getRepositories();
      const today = todayLocal();
      const [words, reviewStates, introducedToday] = await Promise.all([
        repos.words.getAll(),
        repos.reviews.getAll(),
        repos.dailyProgress.getNewWordCount(today),
      ]);
      const newWordLimit =
        options.extraNewWords ?? Math.max(0, loadSettings().newWordsPerDay - introducedToday);
      const queue = buildStudyQueue({ words, reviewStates, today, newWordLimit });
      if (token !== sessionToken) return;
      set({
        status: queue.cards.length > 0 ? 'studying' : 'empty',
        cards: queue.cards,
        remainingNewCount: queue.remainingNewCount,
      });
    } catch {
      if (token !== sessionToken) return;
      set({ status: 'error', errorMessage: '학습할 카드를 불러오지 못했어요.' });
    }
  },

  flip() {
    if (get().status !== 'studying') return;
    set((state) => ({ flipped: !state.flipped }));
  },

  async grade(grade) {
    const { status, flipped, saving, cards, index } = get();
    const card = cards[index];
    if (status !== 'studying' || !flipped || saving || !card) return;

    const token = sessionToken;
    set({ saving: true, errorMessage: null });
    const today = todayLocal();
    const previous = card.state ?? createInitialReviewState(card.word.id, today);
    const next = review(previous, grade, today);
    const correct = isCorrectGrade(grade);

    try {
      const repos = getRepositories();
      await repos.reviews.put(next);
      await repos.studyLogs.increment(today, 1, correct ? 1 : 0);
      if (card.isNew) await repos.dailyProgress.incrementNewWordCount(today);
    } catch {
      if (token === sessionToken) {
        set({ saving: false, errorMessage: '학습 결과를 저장하지 못했어요. 다시 시도해 주세요.' });
      }
      return;
    }

    if (token !== sessionToken) return;
    const nextIndex = index + 1;
    set((state) => ({
      saving: false,
      flipped: false,
      index: nextIndex,
      reviewedCount: state.reviewedCount + 1,
      correctCount: state.correctCount + (correct ? 1 : 0),
      status: nextIndex >= state.cards.length ? 'finished' : 'studying',
    }));
  },

  reset() {
    sessionToken += 1;
    set({ ...INITIAL_STATE });
  },
}));
