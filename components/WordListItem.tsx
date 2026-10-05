'use client';

import type { Word } from '@/lib/types';
import { LevelBadge } from './LevelBadge';
import { SpeakButton } from './SpeakButton';

interface WordListItemProps {
  word: Word;
  confirmingDelete: boolean;
  onEdit: () => void;
  onRequestDelete: () => void;
  onConfirmDelete: () => void;
  onCancelDelete: () => void;
}

export function WordListItem({
  word,
  confirmingDelete,
  onEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
}: WordListItemProps) {
  const editable = word.source === 'user';
  return (
    <li aria-label={word.term} className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span lang="en" className="text-lg font-semibold break-all">
              {word.term}
            </span>
            <LevelBadge level={word.level} />
            {editable ? (
              <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-xs font-medium text-indigo-700">내 단어</span>
            ) : (
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-500">기본</span>
            )}
          </div>
          <p className="mt-1 text-slate-700">{word.meaning}</p>
          {word.example && (
            <p lang="en" className="mt-1 text-sm text-slate-500 italic">
              {word.example}
            </p>
          )}
        </div>
        <SpeakButton text={word.term} />
      </div>

      {editable &&
        (confirmingDelete ? (
          <div role="alert" className="mt-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-800">
            <p>‘{word.term}’을(를) 삭제할까요? 학습 기록도 함께 삭제돼요.</p>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={onConfirmDelete}
                className="min-h-11 flex-1 rounded-xl bg-rose-600 px-3 font-semibold text-white hover:bg-rose-700"
              >
                삭제
              </button>
              <button type="button" onClick={onCancelDelete} className="min-h-11 flex-1 rounded-xl border border-slate-300 bg-white px-3">
                취소
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={onEdit}
              aria-label={`${word.term} 수정`}
              className="min-h-11 flex-1 rounded-xl border border-slate-300 px-3 text-sm"
            >
              수정
            </button>
            <button
              type="button"
              onClick={onRequestDelete}
              aria-label={`${word.term} 삭제`}
              className="min-h-11 flex-1 rounded-xl border border-rose-200 px-3 text-sm text-rose-600"
            >
              삭제
            </button>
          </div>
        ))}
    </li>
  );
}
