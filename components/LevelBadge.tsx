import { LEVEL_LABELS, type WordLevel } from '@/lib/types';

const LEVEL_STYLES: Record<WordLevel, string> = {
  beginner: 'bg-emerald-50 text-emerald-700',
  intermediate: 'bg-sky-50 text-sky-700',
  advanced: 'bg-violet-50 text-violet-700',
};

export function LevelBadge({ level }: { level: WordLevel }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${LEVEL_STYLES[level]}`}>
      {LEVEL_LABELS[level]}
    </span>
  );
}
