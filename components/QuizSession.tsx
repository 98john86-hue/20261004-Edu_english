'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useQuizSession } from '@/store/quizSession';
import { QuizQuestionCard } from './QuizQuestionCard';
import { QuizResult } from './QuizResult';

const CHOICE_BY_CODE: Record<string, number> = {
  Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3,
  Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3,
};

function useQuizKeyboard() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || event.repeat) return;
      const quiz = useQuizSession.getState();
      if (quiz.status === 'answering') {
        const choice = CHOICE_BY_CODE[event.code] ?? ['1', '2', '3', '4'].indexOf(event.key);
        if (choice >= 0) {
          event.preventDefault();
          void quiz.answer(choice);
        }
      } else if (quiz.status === 'answered' && (event.key === 'Enter' || event.code === 'Space')) {
        event.preventDefault();
        quiz.next();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);
}

export function QuizSession() {
  const quiz = useQuizSession(
    useShallow((state) => ({
      status: state.status,
      questions: state.questions,
      index: state.index,
      answers: state.answers,
      errorMessage: state.errorMessage,
    })),
  );
  const { start, answer, next, reset } = useQuizSession.getState();

  useEffect(() => {
    void start();
    return () => reset();
  }, [start, reset]);

  useQuizKeyboard();

  const question = quiz.questions[quiz.index];
  const currentAnswer = quiz.status === 'answered' ? quiz.answers[quiz.index] : undefined;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">뜻 고르기 퀴즈</h1>

      {quiz.status === 'idle' || quiz.status === 'loading' ? (
        <p role="status" className="py-16 text-center text-slate-500">
          퀴즈를 준비하는 중…
        </p>
      ) : quiz.status === 'error' ? (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-rose-700">
          {quiz.errorMessage}
        </p>
      ) : quiz.status === 'insufficient' ? (
        <p className="rounded-2xl bg-amber-50 p-4 text-amber-900">
          퀴즈를 만들려면 뜻이 서로 다른 단어가 4개 이상 필요해요.{' '}
          <Link href="/words" className="font-medium underline">
            단어 추가하기
          </Link>
        </p>
      ) : quiz.status === 'finished' ? (
        <QuizResult answers={quiz.answers} onRestart={() => void start()} />
      ) : question ? (
        <>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span aria-label="진행 상황">
              {quiz.index + 1} / {quiz.questions.length}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(quiz.index / quiz.questions.length) * 100}%` }}
              />
            </div>
          </div>

          <QuizQuestionCard
            key={quiz.index}
            question={question}
            selectedIndex={currentAnswer?.selectedIndex ?? null}
            onSelect={(index) => void answer(index)}
          />

          {currentAnswer && (
            <div className="flex flex-col gap-2">
              <p
                role="status"
                className={`rounded-2xl p-3 text-center font-semibold ${
                  currentAnswer.correct ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                }`}
              >
                {currentAnswer.correct ? '정답이에요!' : `아쉬워요. 정답은 ‘${question.word.meaning}’`}
              </p>
              <button
                type="button"
                onClick={next}
                autoFocus
                className="min-h-14 rounded-2xl bg-slate-900 px-4 text-lg font-semibold text-white hover:bg-slate-800"
              >
                {quiz.index + 1 >= quiz.questions.length ? '결과 보기' : '다음 문제'}{' '}
                <span className="text-sm font-normal opacity-70">(Enter)</span>
              </button>
            </div>
          )}

          {quiz.errorMessage && (
            <p role="alert" className="text-sm text-rose-600">
              {quiz.errorMessage}
            </p>
          )}
        </>
      ) : null}
    </div>
  );
}
