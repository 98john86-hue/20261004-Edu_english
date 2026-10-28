'use client';

import dynamic from 'next/dynamic';
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
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

// 입력창은 처음 열 때만 불러온다 (초기 JS 줄이기)
const EntryDialog = dynamic(() => import('@/components/ui/EntryDialog').then((m) => m.EntryDialog), { ssr: false });

type Row = { id: string; name: string; isMe: boolean; logs: readonly SwimLog[] };

const ME_ID = 'me';

// 예시 참여자 기록은 고정값이라 모듈에서 한 번만 만든다
const sampleRows: Row[] = board.participants.map((p, i) => ({
  id: p.id,
  name: p.name,
  isMe: false,
  logs: buildSampleLogs(p.weeks, challenge.startDate, board.samplePools, i * 3),
}));

/** 요일 칸: 거리는 숫자로, 배운 점은 전구 아이콘으로 표시 */
function DayMark({ day }: { day: DayLogs }) {
  if (!day.distance && !day.learning) return <span aria-hidden="true">·</span>;
  return (
    <span className="flex flex-col items-center gap-0.5">
      {day.distance ? (
        <span className="text-[11px] leading-none font-bold tracking-tight">
          {formatMeters(getTotalDistance(day.distance))}
        </span>
      ) : null}
      {day.learning ? <Icon name="bulb" className="size-4" /> : null}
    </span>
  );
}

function srDayText(day: DayLogs): string {
  const parts: string[] = [];
  if (day.distance) parts.push(formatMeters(getTotalDistance(day.distance)));
  if (day.learning) parts.push(`${board.learningCell}: ${day.learning.note}`);
  return parts.length ? parts.join(', ') : board.emptyCell;
}

export function WeeklyBoard() {
  const [weekIndex, setWeekIndex] = useState(0);
  const [myLogs, setMyLogs] = useState<SwimLog[]>([]);
  const [editingDate, setEditingDate] = useState<string | null>(null);

  const dates = useMemo(() => getWeekDates(challenge.startDate, weekIndex), [weekIndex]);
  const rows = useMemo(
    () => rankByWeek([...sampleRows, { id: ME_ID, name: board.meName, isMe: true, logs: myLogs }], dates),
    [myLogs, dates],
  );

  const dayName = (date: string) => board.weekdayHeaders[dates.indexOf(date)] ?? '';

  return (
    <section id="board" aria-labelledby="board-title" className="scroll-mt-16 bg-sky-50 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="board-title"
          eyebrow={board.eyebrow}
          title={board.title}
          description={board.description}
          badge={<Badge tone="sample">{board.sampleBadge}</Badge>}
        />

        <div role="group" aria-label={board.weekTabsLabel} className="grid grid-cols-4 gap-1 rounded-2xl bg-white p-1 shadow-sm">
          {Array.from({ length: challenge.weeks }, (_, i) => (
            <button
              key={i}
              type="button"
              aria-pressed={i === weekIndex}
              onClick={() => setWeekIndex(i)}
              className={`rounded-xl py-2 text-sm font-bold ${
                i === weekIndex ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {board.weekLabel(i + 1)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-sm text-slate-600">
          {formatShortDate(dates[0] ?? '')}~{formatShortDate(dates[4] ?? '')} · {board.goalHint}
        </p>

        <ol aria-label={board.listLabel(weekIndex + 1)} className="mt-4 grid gap-3">
          {rows.map((row) => {
            const summary = summarizeWeek(row.logs, dates);
            const notes = dates.flatMap((date) => {
              const learning = getDayLogs(row.logs, date).learning;
              return learning ? [{ date, learning }] : [];
            });
            return (
              <li
                key={row.id}
                className={`rounded-2xl bg-white p-4 shadow-sm ${row.isMe ? 'ring-2 ring-amber-400' : ''}`}
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900">{row.name}</span>
                  {row.isMe ? (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-bold text-amber-900">
                      {board.meTag}
                    </span>
                  ) : null}
                  <span className="ml-auto text-sm text-slate-600">{board.weeklyCount(summary.days)}</span>
                  {summary.days >= challenge.weeklyMin ? <Badge tone="success">{board.goalMet}</Badge> : null}
                </div>

                {/* 가로: 월~금 */}
                <div className="mt-3 grid grid-cols-5 gap-1.5">
                  {dates.map((date, i) => {
                    const day = getDayLogs(row.logs, date);
                    const filled = Boolean(day.distance || day.learning);
                    const label = board.cellLabel(row.name, board.weekdayHeaders[i] ?? '', formatShortDate(date));
                    const base = 'flex h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs';
                    const tone = filled ? 'bg-teal-50 text-teal-900' : 'bg-slate-50 text-slate-500';
                    return row.isMe ? (
                      <button
                        key={date}
                        type="button"
                        onClick={() => setEditingDate(date)}
                        aria-label={`${label}: ${filled ? `${srDayText(day)}, ${board.editHint}` : board.addLabel}`}
                        className={`${base} ${
                          filled ? 'border-2 border-amber-300 bg-teal-50 text-teal-900' : 'border-2 border-dashed border-amber-400 text-amber-900'
                        }`}
                      >
                        <span className="font-bold" aria-hidden="true">
                          {board.weekdayHeaders[i]}
                        </span>
                        <span aria-hidden="true">{filled ? <DayMark day={day} /> : '+'}</span>
                      </button>
                    ) : (
                      <div key={date} className={`${base} ${tone}`}>
                        <span className="sr-only">
                          {label}: {srDayText(day)}
                        </span>
                        <span aria-hidden="true" className="font-bold">
                          {board.weekdayHeaders[i]}
                        </span>
                        <span aria-hidden="true">
                          <DayMark day={day} />
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* 배운 점은 따로 들어가지 않아도 바로 보이도록 한 줄씩 */}
                {notes.length > 0 ? (
                  <ul className="mt-3 grid gap-1 text-sm text-slate-700" aria-hidden="true">
                    {notes.map(({ date, learning }) => (
                      <li key={date} className="truncate">
                        <span className="mr-1.5 font-bold text-teal-800">{dayName(date)}</span>
                        {learning.stroke ? <span className="mr-1 text-slate-500">{learning.stroke}</span> : null}
                        {learning.note}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            );
          })}
        </ol>
        <p className="mt-4 text-center text-xs text-slate-600">{board.sampleNotice}</p>
      </div>

      {editingDate ? (
        <EntryDialog
          date={editingDate}
          dateLabel={`${dayName(editingDate)}요일 ${formatShortDate(editingDate)}`}
          initial={getDayLogs(myLogs, editingDate)}
          onSave={(next) => {
            setMyLogs((prev) => replaceDayLogs(prev, editingDate, next));
            setEditingDate(null);
          }}
          onClose={() => setEditingDate(null)}
        />
      ) : null}
    </section>
  );
}
