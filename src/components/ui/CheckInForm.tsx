'use client';

import { useState, type FormEvent } from 'react';
import { board, challenge, strokeOptions } from '@/content/landing';
import { getDayLogs, getWeekDates, type DayLogs } from '@/lib/board';
import { formatLogDate } from '@/lib/date';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { Stroke, SwimLog } from '@/lib/types';
import { buttonStyles } from '@/components/ui/Button';

type CheckInFormProps = {
  myLogs: readonly SwimLog[];
  name: string;
  onNameChange: (name: string) => void;
  goal: number;
  onGoalChange: (goal: number) => void;
  onSave: (date: string, next: DayLogs) => void;
};

const copy = board.form;

const dateOptions = Array.from({ length: challenge.weeks }, (_, week) =>
  getWeekDates(challenge.startDate, week).map((date) => ({ date, label: copy.dateOption(week + 1, formatLogDate(date)) })),
).flat();

const labelClass = 'block font-bold text-slate-900';
const hintClass = 'mt-0.5 text-sm text-slate-600';
const fieldClass =
  'mt-2 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 placeholder:text-slate-500 focus:border-teal-600';

const goalOptions = Array.from(
  { length: challenge.weeklyMax - challenge.weeklyMin + 1 },
  (_, i) => challenge.weeklyMin + i,
);

const isStroke = (value: string): value is Stroke => (strokeOptions as readonly string[]).includes(value);

/** 첨부된 인증 화면처럼 날짜 → 아이디 → 거리 → 습득한 기술 순서의 한 장짜리 폼 */
export function CheckInForm({ myLogs, name, onNameChange, goal, onGoalChange, onSave }: CheckInFormProps) {
  const [date, setDate] = useState(dateOptions[0]?.date ?? challenge.startDate);
  const [laneLength, setLaneLength] = useState<number>(copy.laneOptions[0]);
  const [laps, setLaps] = useState('');
  const [stroke, setStroke] = useState<Stroke>('자유형');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const existing = getDayLogs(myLogs, date);
  const hasExisting = Boolean(existing.distance || existing.learning);

  // 날짜를 바꾸면 그날 이미 낸 인증으로 입력칸을 채운다
  const changeDate = (next: string) => {
    const day = getDayLogs(myLogs, next);
    setDate(next);
    setLaneLength(day.distance?.laneLength ?? copy.laneOptions[0]);
    setLaps(day.distance ? String(day.distance.laps) : '');
    setStroke(day.learning?.stroke ?? '자유형');
    setNote(day.learning?.note ?? '');
    setError('');
    setMessage('');
  };

  const lapCount = Number.parseInt(laps, 10);
  const hasDistance = Number.isFinite(lapCount) && lapCount > 0;
  const trimmedNote = note.trim();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!hasDistance && !trimmedNote) {
      setError(copy.emptyError);
      setMessage('');
      return;
    }
    onSave(date, {
      ...(hasDistance ? { distance: { type: 'distance', date, laneLength, laps: lapCount } } : {}),
      ...(trimmedNote ? { learning: { type: 'learning', date, stroke, note: trimmedNote } } : {}),
    });
    setError('');
    setMessage(copy.success(formatLogDate(date)));
  };

  const handleRemove = () => {
    onSave(date, {});
    changeDate(date);
    setMessage(copy.removed(formatLogDate(date)));
  };

  return (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-6 rounded-3xl bg-white p-5 shadow-sm sm:p-7">
      <div>
        <label htmlFor="checkin-date" className={labelClass}>
          {copy.dateLabel}
        </label>
        <select id="checkin-date" value={date} onChange={(e) => changeDate(e.target.value)} className={fieldClass}>
          {dateOptions.map((option) => (
            <option key={option.date} value={option.date}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="checkin-name" className={labelClass}>
          {copy.nameLabel}
        </label>
        <p id="checkin-name-hint" className={hintClass}>
          {copy.nameHint}
        </p>
        <input
          id="checkin-name"
          type="text"
          maxLength={12}
          autoComplete="nickname"
          value={name}
          placeholder={copy.namePlaceholder}
          onChange={(e) => onNameChange(e.target.value)}
          aria-describedby="checkin-name-hint"
          className={fieldClass}
        />
      </div>

      <fieldset aria-describedby="checkin-goal-hint">
        <legend className={labelClass}>{copy.goalLabel}</legend>
        <p id="checkin-goal-hint" className={hintClass}>
          {copy.goalHint}
        </p>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {goalOptions.map((n) => (
            <label
              key={n}
              className="cursor-pointer rounded-xl border-2 border-slate-300 bg-white py-2.5 text-center font-bold text-slate-800 has-checked:border-teal-700 has-checked:bg-teal-700 has-checked:text-white has-focus-visible:outline-3 has-focus-visible:outline-offset-2 has-focus-visible:outline-accent"
            >
              <input
                type="radio"
                name="checkin-goal"
                value={n}
                checked={goal === n}
                onChange={() => onGoalChange(n)}
                className="sr-only"
              />
              {copy.goalOption(n)}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={labelClass}>{copy.distanceLabel}</legend>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="checkin-lane" className="mt-2 block text-sm text-slate-700">
              {copy.laneLabel}
            </label>
            <select
              id="checkin-lane"
              value={laneLength}
              onChange={(e) => setLaneLength(Number(e.target.value))}
              className={`${fieldClass} mt-1`}
            >
              {copy.laneOptions.map((len) => (
                <option key={len} value={len}>
                  {len}m
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="checkin-laps" className="mt-2 block text-sm text-slate-700">
              {copy.lapsLabel}
            </label>
            <input
              id="checkin-laps"
              type="number"
              inputMode="numeric"
              min={0}
              max={200}
              value={laps}
              placeholder={copy.lapsPlaceholder}
              onChange={(e) => {
                setLaps(e.target.value);
                setError('');
              }}
              className={`${fieldClass} mt-1`}
            />
          </div>
        </div>
        {hasDistance ? (
          <p className="mt-2 font-bold text-teal-800" aria-live="polite">
            = {formatMeters(getTotalDistance({ laneLength, laps: lapCount }))}
          </p>
        ) : null}
      </fieldset>

      <fieldset>
        <legend className={labelClass}>{copy.skillLabel}</legend>
        <label htmlFor="checkin-stroke" className="mt-2 block text-sm text-slate-700">
          {copy.strokeLabel}
        </label>
        <select
          id="checkin-stroke"
          value={stroke}
          onChange={(e) => {
            if (isStroke(e.target.value)) setStroke(e.target.value);
          }}
          className={`${fieldClass} mt-1`}
        >
          {strokeOptions.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <label htmlFor="checkin-note" className="sr-only">
          {copy.skillLabel}
        </label>
        <textarea
          id="checkin-note"
          rows={4}
          maxLength={200}
          value={note}
          placeholder={copy.skillPlaceholder}
          onChange={(e) => {
            setNote(e.target.value);
            setError('');
          }}
          className={`${fieldClass} resize-none`}
        />
      </fieldset>

      <div className="flex flex-col gap-3">
        <p className="text-sm text-slate-600">{copy.oneIsEnough}</p>
        <p role="alert" className="text-sm font-medium text-red-700 empty:hidden">
          {error}
        </p>
        <button type="submit" className={`${buttonStyles()} w-full`}>
          {hasExisting ? copy.update : copy.submit}
        </button>
        {hasExisting ? (
          <button
            type="button"
            onClick={handleRemove}
            className="self-center rounded-full px-3 py-1.5 text-sm font-bold text-red-700 hover:bg-red-50"
          >
            {copy.remove}
          </button>
        ) : null}
        <p role="status" className="text-center font-bold text-emerald-800 empty:hidden">
          {message}
        </p>
        <p className="text-center text-xs text-slate-600">{copy.notSaved}</p>
      </div>
    </form>
  );
}
