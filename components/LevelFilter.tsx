import { LEVEL_LABELS, WORD_LEVELS, type WordLevel } from '@/lib/types';

export type LevelFilterValue = WordLevel | 'all';

const OPTIONS: readonly { value: LevelFilterValue; label: string }[] = [
  { value: 'all', label: '전체' },
  ...WORD_LEVELS.map((level) => ({ value: level, label: LEVEL_LABELS[level] })),
];

interface LevelFilterProps {
  value: LevelFilterValue;
  onChange: (value: LevelFilterValue) => void;
}

export function LevelFilter({ value, onChange }: LevelFilterProps) {
  return (
    <div role="group" aria-label="레벨 필터" className="flex gap-2">
      {OPTIONS.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 flex-1 rounded-xl px-3 text-sm font-medium ${
            value === option.value ? 'bg-indigo-600 text-white' : 'border border-slate-300 bg-white text-slate-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
