'use client';

import { useId, useState } from 'react';
import { loadSettings, NEW_WORDS_PER_DAY_OPTIONS, saveSettings } from '@/lib/settings';

export function NewWordsSetting() {
  const id = useId();
  const [value, setValue] = useState(() => loadSettings().newWordsPerDay);

  return (
    <label htmlFor={id} className="flex items-center gap-2 text-sm text-slate-600">
      하루 새 단어
      <select
        id={id}
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value);
          setValue(next);
          saveSettings({ ...loadSettings(), newWordsPerDay: next });
          event.target.blur();
        }}
        className="min-h-11 rounded-xl border border-slate-300 bg-white px-2"
      >
        {NEW_WORDS_PER_DAY_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}개
          </option>
        ))}
      </select>
    </label>
  );
}
