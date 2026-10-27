'use client';

import { useMemo, useState } from 'react';
import { board, challenge } from '@/content/landing';
import {
  buildSampleLogs,
  formatShortDate,
  getDayLogs,
  getWeekDates,
  rankByWeek,
  replaceDayLogs,
  summarizeWeek,
  type DayLogs,
} from '@/lib/board';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { SwimLog } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { EntryDialog } from '@/components/ui/EntryDialog';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Row = { id: string; name: string; isMe: boolean; logs: readonly SwimLog[] };

const ME_ID = 'me';

function DayContent({ day }: { day: DayLogs }) {
  if (!day.distance && !day.learning) return null;
  return (
    <span className="flex flex-col gap-1 text-left">
      {day.distance ? (
        <span className="inline-flex w-fit items-center gap-1 rounded-md bg-sky-100 px-1.5 py-0.5 text-xs font-bold text-sky-900">
          <Icon name="ruler" className="size-3.5" />
          {formatMeters(getTotalDistance(day.distance))}
        </span>
      ) : null}
      {day.learning ? (
        <span className="flex items-start gap-1 rounded-md bg-teal-50 px-1.5 py-1 text-xs leading-snug text-teal-950">
          <Icon name="bulb" className="mt-px size-3.5 shrink-0 text-teal-700" />
          <span className="line-clamp-3">
            {day.learning.stroke ? <strong className="font-bold">{day.learning.stroke} </strong> : null}
            {day.learning.note}
          </span>
        </span>
      ) : null}
    </span>
  );
}

export function WeeklyBoard() {
  const [weekIndex, setWeekIndex] = useState(0);
  const [myLogs, setMyLogs] = useState<SwimLog[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const samples = useMemo<Row[]>(
    () =>
      board.participants.map((p, i) => ({
        id: p.id,
        name: p.name,
        isMe: false,
        logs: buildSampleLogs(p.weeks, challenge.startDate, board.samplePools, i * 3),
      })),
    [],
  );

  const dates = useMemo(() => getWeekDates(challenge.startDate, weekIndex), [weekIndex]);
  const rows = useMemo(
    () => rankByWeek([...samples, { id: ME_ID, name: board.meName, isMe: true, logs: myLogs }], dates),
    [samples, myLogs, dates],
  );

  const editingDay = useMemo(() => (editingDate ? getDayLogs(myLogs, editingDate) : {}), [editingDate, myLogs]);
  const editingIndex = editingDate ? dates.indexOf(editingDate) : -1;
  const editingLabel = editingDate
    ? `${board.weekdayHeaders[editingIndex] ?? ''}요일 ${formatShortDate(editingDate)}`
    : '';

  const saveDay = (next: DayLogs) => {
    if (!editingDate) return;
    setMyLogs((prev) => replaceDayLogs(prev, editingDate, next));
    setEditingDate(null);
  };

  return (
    <section id="board" aria-labelledby="board-title" className="scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="board-title"
          eyebrow={board.eyebrow}
          title={board.title}
          description={board.description}
          badge={<Badge tone="sample">{board.sampleBadge}</Badge>}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div role="group" aria-label={board.weekTabsLabel} className="flex gap-1 rounded-2xl bg-slate-100 p-1">
            {Array.from({ length: challenge.weeks }, (_, i) => {
              const weekDates = getWeekDates(challenge.startDate, i);
              const selected = i === weekIndex;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setWeekIndex(i)}
                  className={`min-w-0 flex-1 rounded-xl px-2 py-2 text-sm font-bold sm:flex-none sm:px-3 ${
                    selected ? 'bg-white text-teal-800 shadow' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {board.weekLabel(i + 1)}
                  <span className="block text-xs font-medium text-slate-600">
                    {formatShortDate(weekDates[0] ?? '')}~{formatShortDate(weekDates[4] ?? '')}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="flex items-center gap-2 text-sm text-slate-700">
            <Icon name="check" className="size-4 shrink-0 text-emerald-700" />
            {board.goalHint}
          </p>
        </div>

        <p className="mt-4 text-xs text-slate-500 md:hidden">{board.scrollHint}</p>
        <div className="relative mt-2 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-lg shadow-sky-900/5 md:mt-4">
          <table className="w-full min-w-[640px] table-fixed border-collapse text-sm">
            <caption className="sr-only">{board.tableCaption(weekIndex + 1)}</caption>
            <colgroup>
              <col className="w-32 sm:w-44" />
              {dates.map((date) => (
                <col key={date} />
              ))}
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-3 py-3 text-left font-bold text-slate-700">
                  {board.participantHeader}
                </th>
                {dates.map((date, i) => (
                  <th key={date} scope="col" className="px-2 py-3 text-center font-bold text-slate-700">
                    {board.weekdayHeaders[i]}
                    <span className="ml-1 text-xs font-medium text-slate-500">{formatShortDate(date)}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rank) => {
                const summary = summarizeWeek(row.logs, dates);
                const goalMet = summary.days >= challenge.weeklyMin;
                return (
                  <tr
                    key={row.id}
                    className={`border-b border-slate-100 last:border-0 ${row.isMe ? 'bg-amber-50/60' : ''}`}
                  >
                    <th
                      scope="row"
                      className={`sticky left-0 z-10 px-3 py-3 text-left align-top font-normal ${
                        row.isMe ? 'bg-amber-50' : 'bg-white'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500">{board.rankLabel(rank + 1)}</span>
                        <span className="font-bold text-slate-900">{row.name}</span>
                        {row.isMe ? (
                          <span className="rounded-full bg-amber-200 px-2 py-0.5 text-xs font-bold text-amber-900">
                            {board.meTag}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1 flex flex-wrap items-center gap-1.5">
                        <span className="text-xs font-medium text-slate-600">{board.weeklyCount(summary.days)}</span>
                        {goalMet ? <Badge tone="success">{board.goalMet}</Badge> : null}
                      </span>
                    </th>
                    {dates.map((date, i) => {
                      const day = getDayLogs(row.logs, date);
                      const filled = Boolean(day.distance || day.learning);
                      const label = board.cellLabel(row.name, board.weekdayHeaders[i] ?? '', formatShortDate(date));
                      return (
                        <td key={date} className="h-24 px-1.5 py-2 align-top">
                          {row.isMe ? (
                            <button
                              type="button"
                              onClick={() => setEditingDate(date)}
                              aria-label={`${label}: ${filled ? board.editHint : board.addLabel}`}
                              className={`flex h-full min-h-20 w-full rounded-xl p-1.5 transition ${
                                filled
                                  ? 'border-2 border-amber-300 bg-white hover:border-amber-500'
                                  : 'items-center justify-center border-2 border-dashed border-amber-400 font-bold text-amber-900 hover:bg-amber-100'
                              }`}
                            >
                              {filled ? <DayContent day={day} /> : `+ ${board.addLabel}`}
                            </button>
                          ) : filled ? (
                            <DayContent day={day} />
                          ) : (
                            <span className="flex h-full min-h-20 items-center justify-center rounded-xl bg-slate-50 text-xs text-slate-500">
                              <span className="sr-only">{board.emptyCell}</span>
                              <span aria-hidden="true">–</span>
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-center text-xs text-slate-500">{board.sampleNotice}</p>
      </div>

      <EntryDialog
        date={editingDate}
        dateLabel={editingLabel}
        initial={editingDay}
        onSave={saveDay}
        onClose={() => setEditingDate(null)}
      />
    </section>
  );
}
