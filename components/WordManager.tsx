'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { getRepositories } from '@/db';
import type { Word } from '@/lib/types';
import { filterWords, type ValidWordInput } from '@/lib/wordValidation';
import { LevelFilter, type LevelFilterValue } from './LevelFilter';
import { WordForm } from './WordForm';
import { WordListItem } from './WordListItem';

type FormMode = { type: 'closed' } | { type: 'add' } | { type: 'edit'; word: Word };

export function WordManager() {
  const [words, setWords] = useState<Word[] | null>(null);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState<LevelFilterValue>('all');
  const [formMode, setFormMode] = useState<FormMode>({ type: 'closed' });
  const [confirmingDeleteId, setConfirmingDeleteId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loadError, setLoadError] = useState(false);

  const reload = useCallback(async () => {
    try {
      setWords(await getRepositories().words.getAll());
      setLoadError(false);
    } catch {
      setLoadError(true);
    }
  }, []);

  useEffect(() => {
    let active = true;
    getRepositories()
      .words.getAll()
      .then(
        (all) => active && setWords(all),
        () => active && setLoadError(true),
      );
    return () => {
      active = false;
    };
  }, []);

  const visibleWords = useMemo(() => (words ? filterWords(words, { query, level }) : []), [words, query, level]);

  const findDuplicates = useCallback((term: string) => getRepositories().words.findByTerm(term), []);

  async function handleAdd(input: ValidWordInput) {
    await getRepositories().words.add(input);
    setFormMode({ type: 'closed' });
    setNotice(`‘${input.term}’을(를) 추가했어요.`);
    await reload();
  }

  async function handleEdit(id: string, input: ValidWordInput) {
    await getRepositories().words.update(id, { ...input, example: input.example ?? '' });
    setFormMode({ type: 'closed' });
    setNotice(`‘${input.term}’을(를) 수정했어요.`);
    await reload();
  }

  async function handleDelete(word: Word) {
    setConfirmingDeleteId(null);
    try {
      await getRepositories().words.delete(word.id);
      setNotice(`‘${word.term}’을(를) 삭제했어요.`);
    } catch {
      setNotice('삭제하지 못했어요. 다시 시도해 주세요.');
    }
    await reload();
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex items-center justify-between gap-2">
        <h1 className="text-2xl font-bold">단어 관리</h1>
        {formMode.type !== 'add' && (
          <button
            type="button"
            onClick={() => {
              setFormMode({ type: 'add' });
              setNotice(null);
            }}
            className="min-h-11 rounded-xl bg-indigo-600 px-4 font-semibold text-white hover:bg-indigo-700"
          >
            + 단어 추가
          </button>
        )}
      </header>

      <p role="status" aria-live="polite" className={notice ? 'rounded-xl bg-emerald-50 p-3 text-sm text-emerald-800' : 'sr-only'}>
        {notice}
      </p>

      {formMode.type === 'add' && (
        <WordForm findDuplicates={findDuplicates} onSubmit={handleAdd} onCancel={() => setFormMode({ type: 'closed' })} />
      )}

      <div className="flex flex-col gap-2">
        <label htmlFor="word-search" className="sr-only">
          단어 검색
        </label>
        <input
          id="word-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="영어 단어나 뜻으로 검색"
          className="min-h-11 w-full rounded-xl border border-slate-300 bg-white px-3"
        />
        <LevelFilter value={level} onChange={setLevel} />
      </div>

      {loadError ? (
        <p role="alert" className="rounded-xl bg-rose-50 p-3 text-rose-700">
          단어 목록을 불러오지 못했어요.
        </p>
      ) : words === null ? (
        <p className="py-8 text-center text-slate-500">단어를 불러오는 중…</p>
      ) : (
        <>
          <p className="text-sm text-slate-500">
            {visibleWords.length === words.length ? `단어 ${words.length}개` : `${words.length}개 중 ${visibleWords.length}개`}
          </p>
          {visibleWords.length === 0 ? (
            <p className="py-8 text-center text-slate-500">조건에 맞는 단어가 없어요.</p>
          ) : (
            <ul aria-label="단어 목록" className="flex flex-col gap-2">
              {visibleWords.map((word) =>
                formMode.type === 'edit' && formMode.word.id === word.id ? (
                  <li key={word.id}>
                    <WordForm
                      initial={word}
                      findDuplicates={findDuplicates}
                      onSubmit={(input) => handleEdit(word.id, input)}
                      onCancel={() => setFormMode({ type: 'closed' })}
                    />
                  </li>
                ) : (
                  <WordListItem
                    key={word.id}
                    word={word}
                    confirmingDelete={confirmingDeleteId === word.id}
                    onEdit={() => {
                      setFormMode({ type: 'edit', word });
                      setNotice(null);
                    }}
                    onRequestDelete={() => setConfirmingDeleteId(word.id)}
                    onConfirmDelete={() => void handleDelete(word)}
                    onCancelDelete={() => setConfirmingDeleteId(null)}
                  />
                ),
              )}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
