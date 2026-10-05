'use client';

import { todayLocal } from '@/lib/date';
import { describeInterval, GRADE_LABELS, review, type Grade } from '@/lib/srs';
import type { ReviewState } from '@/lib/types';

const GRADES: readonly Grade[] = [0, 1, 2, 3];

const GRADE_STYLES: Record<Grade, string> = {
  0: 'bg-rose-600 hover:bg-rose-700',
  1: 'bg-amber-500 hover:bg-amber-600',
  2: 'bg-indigo-600 hover:bg-indigo-700',
  3: 'bg-emerald-600 hover:bg-emerald-700',
};

interface GradeButtonsProps {
  state: ReviewState;
  disabled: boolean;
  onGrade: (grade: Grade) => void;
}

export function GradeButtons({ state, disabled, onGrade }: GradeButtonsProps) {
  const today = todayLocal();
  return (
    <div role="group" aria-label="기억한 정도 평가" className="grid grid-cols-4 gap-2">
      {GRADES.map((grade) => {
        const preview = describeInterval(review(state, grade, today).interval);
        return (
          <button
            key={grade}
            type="button"
            disabled={disabled}
            onClick={() => onGrade(grade)}
            aria-keyshortcuts={String(grade + 1)}
            className={`flex min-h-14 flex-col items-center justify-center rounded-2xl px-1 py-2 text-white disabled:opacity-50 ${GRADE_STYLES[grade]}`}
          >
            <span className="text-base font-semibold">{GRADE_LABELS[grade]}</span>
            <span className="text-xs opacity-90">
              {preview} · {grade + 1}
            </span>
          </button>
        );
      })}
    </div>
  );
}
