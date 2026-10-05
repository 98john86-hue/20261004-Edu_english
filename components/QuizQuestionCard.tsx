'use client';

import type { QuizQuestion } from '@/lib/quiz';
import { LevelBadge } from './LevelBadge';
import { SpeakButton } from './SpeakButton';

interface QuizQuestionCardProps {
  question: QuizQuestion;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

function choiceStyle(index: number, question: QuizQuestion, selectedIndex: number | null): string {
  if (selectedIndex === null) return 'border-slate-300 bg-white hover:border-indigo-400 hover:bg-indigo-50';
  if (index === question.answerIndex) return 'border-emerald-500 bg-emerald-50 text-emerald-900';
  if (index === selectedIndex) return 'border-rose-500 bg-rose-50 text-rose-900';
  return 'border-slate-200 bg-white text-slate-400';
}

export function QuizQuestionCard({ question, selectedIndex, onSelect }: QuizQuestionCardProps) {
  const answered = selectedIndex !== null;
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col items-center gap-3 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <LevelBadge level={question.word.level} />
        <div className="flex items-center gap-3">
          <h2 lang="en" className="text-4xl font-bold tracking-tight break-all">
            {question.word.term}
          </h2>
          <SpeakButton text={question.word.term} />
        </div>
        <p className="text-sm text-slate-500">알맞은 뜻을 고르세요</p>
      </div>

      <ol aria-label="보기" className="flex flex-col gap-2">
        {question.choices.map((choice, index) => {
          const isAnswer = index === question.answerIndex;
          const isSelected = index === selectedIndex;
          return (
            <li key={`${index}-${choice}`}>
              <button
                type="button"
                disabled={answered}
                onClick={() => onSelect(index)}
                aria-keyshortcuts={String(index + 1)}
                className={`flex min-h-14 w-full items-center gap-3 rounded-2xl border-2 px-4 text-left text-base disabled:cursor-default ${choiceStyle(index, question, selectedIndex)}`}
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
                  {index + 1}
                </span>
                <span className="flex-1">{choice}</span>
                {answered && isAnswer && <span className="text-sm font-semibold">정답</span>}
                {answered && isSelected && !isAnswer && <span className="text-sm font-semibold">내 선택</span>}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
