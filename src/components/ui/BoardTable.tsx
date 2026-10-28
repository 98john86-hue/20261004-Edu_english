'use client';

import { useMemo, useState } from 'react';
import { board, challenge } from '@/content/landing';
import { formatShortDate, getDayLogs, getWeekDates, rankByWeek, summarizeWeek, type DayLogs } from '@/lib/board';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { SwimLog } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';

export type BoardRow = { id: string; name: string; isMe: boolean; goal: number; logs: readonly SwimLog[] };

type BoardTableProps = {
  rows: readonly BoardRow[];
  weekIndex: number;
  onWeekChange: (week: number) => void;
};

// 글자 크기 단계: 표 전체 글자 크기와 칸 너비를 함께 키운다
const zoomStyles = [
  { text: 'text-xs', table: 'min-w-[560px]', clamp: 'line-clamp-3' },
  { text: 'text-sm', table: 'min-w-[680px]', clamp: 'line-clamp-4' },
  { text: 'text-base', table: 'min-w-[860px]', clamp: '' },
] as const;

function DayCell({ day, clamp }: { day: DayLogs; clamp: string }) {
  if (!day.distance && !day.learning) {
    return (
      <span className="block text-slate-500">
        <span className="sr-only">{board.emptyCell}</span>
        <span aria-hidden="true">–</span>
      </span>
    );
  }
  return (
    <span className="flex flex-col gap-1">
      {day.distance ? (
        <span className="font-extrabold text-sky-800">{formatMeters(getTotalDistance(day.distance))}</span>
      ) : null}
      {day.learning ? (
        <span className={`text-slate-800 ${clamp}`}>
          {day.learning.stroke ? <strong className="font-bold text-teal-800">{day.learning.stroke} </strong> : null}
          {day.learning.note}
        </span>
      ) : null}
    </span>
  );
}

/** 전체 진행판: 가로 월~금, 세로 참여자. 그 주에 기록이 많은 순으로 정렬 */
export function BoardTable({ rows, weekIndex, onWeekChange }: BoardTableProps) {
  // 모바일에서 월~금이 더 많이 보이도록 기본은 작은 글자
  const [zoom, setZoom] = useState(0);
  const dates = useMemo(() => getWeekDates(challenge.startDate, weekIndex), [weekIndex]);
  const ranked = useMemo(() => rankByWeek(rows, dates), [rows, dates]);
  const style = zoomStyles[zoom] ?? zoomStyles[1];

  return (
    <div>
      <div className="px-4 text-center">
        <h3 className="text-xl font-extrabold text-slate-900 sm:text-2xl">{board.boardTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{board.boardDescription}</p>
        <div className="mt-2 flex justify-center">
          <Badge tone="sample">{board.sampleNotice}</Badge>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div role="group" aria-label={board.weekTabsLabel} className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {Array.from({ length: challenge.weeks }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === weekIndex}
              onClick={() => onWeekChange(i)}
              className={`rounded-xl px-3 py-2 text-sm font-bold ${
                i === weekIndex ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {board.weekLabel(i + 1)}
            </button>
          ))}
        </div>
        <div role="group" aria-label={board.zoomLabel} className="flex items-center justify-end gap-1">
          <span className="mr-1 text-sm font-bold text-slate-700" aria-hidden="true">
            {board.zoomLabel}
          </span>
          {board.zoomOptions.map((label, i) => (
            <button
              key={label}
              type="button"
              aria-pressed={i === zoom}
              onClick={() => setZoom(i)}
              className={`rounded-full border-2 px-3 py-1 font-bold ${['text-xs', 'text-sm', 'text-base'][i]} ${
                i === zoom ? 'border-teal-700 bg-teal-700 text-white' : 'border-slate-300 bg-white text-slate-700'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <p className="mt-2 px-4 text-xs text-slate-600">
        {formatShortDate(dates[0] ?? '')}~{formatShortDate(dates[4] ?? '')} · {board.goalHint}
      </p>

      <div className="relative mx-4 mt-3 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className={`w-full table-fixed border-collapse ${style.text} ${style.table}`}>
          <caption className="sr-only">{board.tableCaption(weekIndex + 1)}</caption>
          <colgroup>
            <col className="w-[7.5em]" />
            {dates.map((date) => (
              <col key={date} />
            ))}
          </colgroup>
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th scope="col" className="sticky left-0 z-10 bg-slate-50 px-3 py-2.5 text-left font-bold text-slate-700">
                {board.participantHeader}
              </th>
              {dates.map((date, i) => (
                <th key={date} scope="col" className="px-2 py-2.5 text-left font-bold text-slate-700">
                  {board.weekdayHeaders[i]} <span className="font-medium text-slate-500">{formatShortDate(date)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ranked.map((row) => {
              const summary = summarizeWeek(row.logs, dates);
              return (
                <tr key={row.id} className={`border-b border-slate-100 last:border-0 ${row.isMe ? 'bg-amber-50' : ''}`}>
                  <th
                    scope="row"
                    className={`sticky left-0 z-10 px-3 py-3 text-left align-top font-normal ${row.isMe ? 'bg-amber-50' : 'bg-white'}`}
                  >
                    <span className="block font-bold break-all text-slate-900">
                      {row.name}
                      {row.isMe && row.name !== board.meName ? (
                        <span className="ml-1 font-medium text-amber-800">({board.meTag})</span>
                      ) : null}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-1">
                      <span className="text-slate-600" aria-label={board.goalProgressLabel(summary.days, row.goal)}>
                        {board.weeklyCount(summary.days, row.goal)}
                      </span>
                      {summary.days >= row.goal ? (
                        <span role="img" aria-label={board.goalMetLabel} className="text-lg leading-none">
                          {board.goalMedal}
                        </span>
                      ) : null}
                    </span>
                  </th>
                  {dates.map((date) => (
                    <td key={date} className="px-2 py-3 align-top leading-snug">
                      <DayCell day={getDayLogs(row.logs, date)} clamp={style.clamp} />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="mt-2 px-4 text-xs text-slate-600">{board.zoomHint}</p>
    </div>
  );
}
