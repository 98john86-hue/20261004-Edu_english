'use client';

import type { Word } from '@/lib/types';
import { LevelBadge } from './LevelBadge';
import { SpeakButton } from './SpeakButton';

interface FlashcardProps {
  word: Word;
  isNew: boolean;
  flipped: boolean;
  onFlip: () => void;
}

export function Flashcard({ word, isNew, flipped, onFlip }: FlashcardProps) {
  return (
    <article
      aria-label={flipped ? '카드 뒷면' : '카드 앞면'}
      onClick={onFlip}
      className="flex min-h-72 cursor-pointer flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm select-none"
    >
      <div className="flex items-center gap-2">
        <LevelBadge level={word.level} />
        {isNew && (
          <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">새 단어</span>
        )}
      </div>

      <div className="flex flex-1 flex-col items-center justify-center gap-4 py-6 text-center">
        <div className="flex items-center gap-3">
          <h2 lang="en" className="text-4xl font-bold tracking-tight break-all">
            {word.term}
          </h2>
          <SpeakButton text={word.term} />
        </div>

        {flipped && (
          <div className="flex w-full flex-col gap-3 border-t border-slate-100 pt-4">
            <p className="text-2xl font-semibold text-indigo-700">{word.meaning}</p>
            {word.example && (
              <p lang="en" className="text-base leading-7 text-slate-600 italic">
                {word.example}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
