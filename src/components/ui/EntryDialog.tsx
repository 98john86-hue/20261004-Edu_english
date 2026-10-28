'use client';

import { useEffect, useId, useRef, useState, type FormEvent } from 'react';
import { board, strokeOptions } from '@/content/landing';
import type { DayLogs } from '@/lib/board';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { Stroke } from '@/lib/types';
import { buttonStyles } from '@/components/ui/Button';

type EntryDialogProps = {
  date: string;
  dateLabel: string;
  initial: DayLogs;
  onSave: (next: DayLogs) => void;
  onClose: () => void;
};

const fieldClass =
  'mt-1 w-full rounded-xl border-2 border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-teal-600';

const isStroke = (value: string): value is Stroke => (strokeOptions as readonly string[]).includes(value);

/**
 * 진행판의 내 칸을 눌렀을 때 뜨는 기록 입력창 (네이티브 dialog라 Esc·포커스 가두기 지원).
 * 열 때만 마운트되므로 기존 기록으로 초기값을 바로 채운다.
 */
export function EntryDialog({ date, dateLabel, initial, onSave, onClose }: EntryDialogProps) {
  const id = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const lapsRef = useRef<HTMLInputElement>(null);
  const { dialog: copy } = board;

  const [laneLength, setLaneLength] = useState<number>(initial.distance?.laneLength ?? copy.laneOptions[0]);
  const [laps, setLaps] = useState(initial.distance ? String(initial.distance.laps) : '');
  const [stroke, setStroke] = useState<Stroke>(initial.learning?.stroke ?? '자유형');
  const [note, setNote] = useState(initial.learning?.note ?? '');
  const [error, setError] = useState('');

  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
    // 가장 자주 쓰는 바퀴 수 입력칸에 바로 커서를 둔다
    lapsRef.current?.focus();
  }, []);

  // 먼저 dialog를 닫아야 브라우저가 여는 데 쓴 버튼으로 포커스를 돌려준다
  const finish = (next: DayLogs) => {
    ref.current?.close();
    onSave(next);
  };

  const lapCount = Number.parseInt(laps, 10);
  const hasDistance = Number.isFinite(lapCount) && lapCount > 0;
  const trimmedNote = note.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasDistance && !trimmedNote) {
      setError(copy.emptyError);
      return;
    }
    finish({
      ...(hasDistance ? { distance: { type: 'distance', date, laneLength, laps: lapCount } } : {}),
      ...(trimmedNote ? { learning: { type: 'learning', date, stroke, note: trimmedNote } } : {}),
    });
  };

  const hasExisting = Boolean(initial.distance || initial.learning);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      aria-labelledby={`${id}-title`}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[min(28rem,calc(100%-2rem))] overflow-y-auto rounded-3xl bg-white p-0 text-slate-800 shadow-2xl backdrop:bg-slate-900/50"
    >
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 p-6">
        <div>
          <h3 id={`${id}-title`} className="text-xl font-extrabold text-slate-900">
            {copy.title(dateLabel)}
          </h3>
          <p className="mt-1 text-sm text-slate-600">{copy.hint}</p>
        </div>

        <fieldset className="rounded-2xl bg-sky-50 p-4">
          <legend className="sr-only">{copy.distanceLegend}</legend>
          <p className="text-sm font-bold text-sky-900" aria-hidden="true">
            {copy.distanceLegend}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor={`${id}-lane`} className="text-sm font-medium text-slate-700">
                {copy.laneLabel}
              </label>
              <select
                id={`${id}-lane`}
                value={laneLength}
                onChange={(e) => setLaneLength(Number(e.target.value))}
                className={fieldClass}
              >
                {copy.laneOptions.map((len) => (
                  <option key={len} value={len}>
                    {len}m
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`${id}-laps`} className="text-sm font-medium text-slate-700">
                {copy.lapsLabel}
              </label>
              <input
                ref={lapsRef}
                id={`${id}-laps`}
                type="number"
                inputMode="numeric"
                min={0}
                max={200}
                value={laps}
                onChange={(e) => {
                  setLaps(e.target.value);
                  setError('');
                }}
                className={fieldClass}
              />
            </div>
          </div>
          {hasDistance ? (
            <p className="mt-2 text-sm font-bold text-sky-900" aria-live="polite">
              = {formatMeters(getTotalDistance({ laneLength, laps: lapCount }))}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="rounded-2xl bg-teal-50 p-4">
          <legend className="sr-only">{copy.learningLegend}</legend>
          <p className="text-sm font-bold text-teal-900" aria-hidden="true">
            {copy.learningLegend}
          </p>
          <label htmlFor={`${id}-stroke`} className="mt-2 block text-sm font-medium text-slate-700">
            {copy.strokeLabel}
          </label>
          <select
            id={`${id}-stroke`}
            value={stroke}
            onChange={(e) => {
              if (isStroke(e.target.value)) setStroke(e.target.value);
            }}
            className={fieldClass}
          >
            {strokeOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
          <label htmlFor={`${id}-note`} className="mt-3 block text-sm font-medium text-slate-700">
            {copy.noteLabel}
          </label>
          <textarea
            id={`${id}-note`}
            rows={2}
            maxLength={120}
            value={note}
            placeholder={copy.notePlaceholder}
            onChange={(e) => {
              setNote(e.target.value);
              setError('');
            }}
            className={`${fieldClass} resize-none`}
          />
        </fieldset>

        <p role="alert" className="text-sm font-medium text-red-700 empty:hidden">
          {error}
        </p>

        <div className="flex flex-col gap-2 sm:flex-row-reverse sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row-reverse">
            <button type="submit" className={buttonStyles('primary', 'sm')}>
              {copy.save}
            </button>
            <button type="button" onClick={() => ref.current?.close()} className={buttonStyles('outline', 'sm')}>
              {copy.cancel}
            </button>
          </div>
          {hasExisting ? (
            <button
              type="button"
              onClick={() => finish({})}
              className="rounded-full px-3 py-2 text-sm font-bold text-red-700 hover:bg-red-50"
            >
              {copy.remove}
            </button>
          ) : null}
        </div>
      </form>
    </dialog>
  );
}
