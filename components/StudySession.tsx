'use client';

import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { todayLocal } from '@/lib/date';
import { speak } from '@/lib/speech';
import { createInitialReviewState, type Grade } from '@/lib/srs';
import { EXTRA_NEW_WORDS, useStudySession } from '@/store/studySession';
import { Flashcard } from './Flashcard';
import { GradeButtons } from './GradeButtons';
import { NewWordsSetting } from './NewWordsSetting';
import { StudyEmpty } from './StudyEmpty';
import { StudySummary } from './StudySummary';

const GRADE_BY_KEY: Record<string, Grade> = { '1': 0, '2': 1, '3': 2, '4': 3 };
const GRADE_BY_CODE: Record<string, Grade> = {
  Digit1: 0, Digit2: 1, Digit3: 2, Digit4: 3,
  Numpad1: 0, Numpad2: 1, Numpad3: 2, Numpad4: 3,
};

function isTypingTarget(target: EventTarget | null): boolean {
  return (
    target instanceof HTMLElement &&
    (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
  );
}

function isSpaceKey(event: KeyboardEvent): boolean {
  return event.code === 'Space' || event.key === ' ';
}

// 한글 입력 상태에서는 P 키의 event.key가 'ㅔ'가 되므로 물리 키(code)도 함께 본다.
function isSpeakKey(event: KeyboardEvent): boolean {
  return event.code === 'KeyP' || event.key.toLowerCase() === 'p';
}

function useStudyKeyboard() {
  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.ctrlKey || event.metaKey || event.altKey || isTypingTarget(event.target)) return;
      const session = useStudySession.getState();
      if (session.status !== 'studying') return;
      const card = session.cards[session.index];
      if (!card) return;

      if (isSpaceKey(event)) {
        event.preventDefault();
        if (!event.repeat) session.flip();
        return;
      }
      if (isSpeakKey(event)) {
        event.preventDefault();
        speak(card.word.term);
        return;
      }
      const grade = GRADE_BY_KEY[event.key] ?? GRADE_BY_CODE[event.code];
      if (grade !== undefined && session.flipped && !event.repeat) {
        event.preventDefault();
        void session.grade(grade);
      }
    }

    // 버튼에 포커스가 있을 때 Space를 떼면 브라우저가 그 버튼을 클릭한다. keydown에서
    // 이미 뒤집기를 처리했으므로 keyup의 기본 동작을 막아 두 번 실행되지 않게 한다.
    function onKeyUp(event: KeyboardEvent) {
      if (isSpaceKey(event) && event.target instanceof HTMLButtonElement) event.preventDefault();
    }

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, []);
}

export function StudySession() {
  const session = useStudySession(
    useShallow((state) => ({
      status: state.status,
      cards: state.cards,
      index: state.index,
      flipped: state.flipped,
      saving: state.saving,
      reviewedCount: state.reviewedCount,
      correctCount: state.correctCount,
      remainingNewCount: state.remainingNewCount,
      errorMessage: state.errorMessage,
    })),
  );
  const { start, flip, grade, reset } = useStudySession.getState();

  useEffect(() => {
    void start();
    return () => reset();
  }, [start, reset]);

  useStudyKeyboard();

  const startMoreNewWords = () => void start({ extraNewWords: EXTRA_NEW_WORDS });
  const card = session.cards[session.index];

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">플래시카드</h1>
        <NewWordsSetting />
      </header>

      {session.status === 'loading' || session.status === 'idle' ? (
        <p role="status" className="py-16 text-center text-slate-500">
          카드를 준비하는 중…
        </p>
      ) : session.status === 'error' ? (
        <p role="alert" className="rounded-2xl bg-rose-50 p-4 text-rose-700">
          {session.errorMessage}
        </p>
      ) : session.status === 'empty' ? (
        <StudyEmpty remainingNewCount={session.remainingNewCount} onMoreNewWords={startMoreNewWords} />
      ) : session.status === 'finished' ? (
        <StudySummary
          reviewedCount={session.reviewedCount}
          correctCount={session.correctCount}
          remainingNewCount={session.remainingNewCount}
          onMoreNewWords={startMoreNewWords}
        />
      ) : card ? (
        <>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            <span aria-label="진행 상황">
              {session.index + 1} / {session.cards.length}
            </span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all"
                style={{ width: `${(session.index / session.cards.length) * 100}%` }}
              />
            </div>
          </div>

          <Flashcard word={card.word} isNew={card.isNew} flipped={session.flipped} onFlip={flip} />

          {session.flipped ? (
            <GradeButtons
              state={card.state ?? createInitialReviewState(card.word.id, todayLocal())}
              disabled={session.saving}
              onGrade={(value) => void grade(value)}
            />
          ) : (
            <button
              type="button"
              onClick={flip}
              aria-keyshortcuts="Space"
              className="min-h-14 rounded-2xl bg-slate-900 px-4 text-lg font-semibold text-white hover:bg-slate-800"
            >
              정답 보기 <span className="text-sm font-normal opacity-70">(Space)</span>
            </button>
          )}

          {session.errorMessage && (
            <p role="alert" className="rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">
              {session.errorMessage}
            </p>
          )}

          <p className="hidden text-center text-xs text-slate-400 sm:block">
            Space 뒤집기 · 1~4 평가 · P 발음
          </p>
        </>
      ) : null}
    </div>
  );
}
