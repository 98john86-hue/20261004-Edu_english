'use client';

import { useId, useState, type FormEvent } from 'react';
import { LEVEL_LABELS, WORD_LEVELS, type Word, type WordLevel } from '@/lib/types';
import {
  EMPTY_WORD_FORM,
  validateWordInput,
  WORD_LIMITS,
  type ValidWordInput,
  type WordFormErrors,
  type WordFormField,
  type WordFormValues,
} from '@/lib/wordValidation';

interface WordFormProps {
  initial?: Word;
  findDuplicates: (term: string) => Promise<Word[]>;
  onSubmit: (input: ValidWordInput) => Promise<void>;
  onCancel: () => void;
}

const FIELD_ORDER: readonly WordFormField[] = ['term', 'meaning', 'example'];

function toFormValues(word?: Word): WordFormValues {
  if (!word) return { ...EMPTY_WORD_FORM };
  return { term: word.term, meaning: word.meaning, example: word.example ?? '', level: word.level };
}

export function WordForm({ initial, findDuplicates, onSubmit, onCancel }: WordFormProps) {
  const formId = useId();
  const isEdit = initial !== undefined;
  const [values, setValues] = useState<WordFormValues>(() => toFormValues(initial));
  const [errors, setErrors] = useState<WordFormErrors>({});
  const [duplicates, setDuplicates] = useState<Word[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function update<K extends keyof WordFormValues>(key: K, value: WordFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === 'term') setDuplicates([]);
    if (key !== 'level' && errors[key as WordFormField]) {
      setErrors((prev) => ({ ...prev, [key]: undefined }));
    }
  }

  async function save(allowDuplicate: boolean) {
    setSubmitError(null);
    const result = validateWordInput(values);
    if (!result.ok) {
      setErrors(result.errors);
      const firstInvalid = FIELD_ORDER.find((field) => result.errors[field]);
      if (firstInvalid) document.getElementById(`${formId}-${firstInvalid}`)?.focus();
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      if (!allowDuplicate) {
        const found = (await findDuplicates(result.value.term)).filter((word) => word.id !== initial?.id);
        if (found.length > 0) {
          setDuplicates(found);
          return;
        }
      }
      await onSubmit(result.value);
    } catch {
      setSubmitError('저장하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void save(false);
  }

  function fieldProps(field: WordFormField) {
    const errorId = `${formId}-${field}-error`;
    return {
      id: `${formId}-${field}`,
      value: values[field],
      maxLength: WORD_LIMITS[field] + 20,
      onChange: (event: { target: { value: string } }) => update(field, event.target.value),
      'aria-invalid': errors[field] ? true : undefined,
      'aria-describedby': errors[field] ? errorId : undefined,
      className: `min-h-11 w-full rounded-xl border px-3 ${errors[field] ? 'border-rose-500' : 'border-slate-300'}`,
    };
  }

  function errorText(field: WordFormField) {
    return errors[field] ? (
      <p id={`${formId}-${field}-error`} className="mt-1 text-sm text-rose-600">
        {errors[field]}
      </p>
    ) : null;
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      aria-label={isEdit ? '단어 수정' : '단어 추가'}
      className="flex flex-col gap-3 rounded-2xl border border-indigo-200 bg-white p-4 shadow-sm"
    >
      <div>
        <label htmlFor={`${formId}-term`} className="mb-1 block text-sm font-medium">
          영어 단어 <span className="text-rose-600">*</span>
        </label>
        <input {...fieldProps('term')} lang="en" autoComplete="off" autoCapitalize="none" spellCheck={false} autoFocus />
        {errorText('term')}
      </div>

      <div>
        <label htmlFor={`${formId}-meaning`} className="mb-1 block text-sm font-medium">
          뜻 <span className="text-rose-600">*</span>
        </label>
        <input {...fieldProps('meaning')} autoComplete="off" />
        {errorText('meaning')}
      </div>

      <div>
        <label htmlFor={`${formId}-example`} className="mb-1 block text-sm font-medium">
          예문 <span className="text-slate-400">(선택)</span>
        </label>
        <input {...fieldProps('example')} lang="en" autoComplete="off" />
        {errorText('example')}
      </div>

      <div>
        <label htmlFor={`${formId}-level`} className="mb-1 block text-sm font-medium">
          레벨
        </label>
        <select
          id={`${formId}-level`}
          value={values.level}
          onChange={(event) => update('level', event.target.value as WordLevel)}
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
        >
          {WORD_LEVELS.map((level) => (
            <option key={level} value={level}>
              {LEVEL_LABELS[level]}
            </option>
          ))}
        </select>
      </div>

      {duplicates.length > 0 && (
        <div role="alert" className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          <p className="font-semibold">이미 같은 영어 단어가 있어요.</p>
          <ul className="mt-1 list-disc pl-5">
            {duplicates.map((word) => (
              <li key={word.id}>
                <span lang="en">{word.term}</span> – {word.meaning}
                {word.source === 'builtin' ? ' (기본 단어)' : ''}
              </li>
            ))}
          </ul>
          <p className="mt-1">뜻이 다른 단어라면 그대로 저장할 수 있어요.</p>
          <button
            type="button"
            onClick={() => void save(true)}
            disabled={submitting}
            className="mt-2 min-h-11 rounded-xl bg-amber-600 px-4 font-semibold text-white hover:bg-amber-700"
          >
            {isEdit ? '그래도 저장' : '그래도 추가'}
          </button>
        </div>
      )}

      {submitError && (
        <p role="alert" className="text-sm text-rose-600">
          {submitError}
        </p>
      )}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={submitting}
          className="min-h-11 flex-1 rounded-xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {isEdit ? '저장' : '추가'}
        </button>
        <button type="button" onClick={onCancel} className="min-h-11 flex-1 rounded-xl border border-slate-300 px-4">
          취소
        </button>
      </div>
    </form>
  );
}
