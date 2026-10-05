'use client';

import { useId, useState } from 'react';
import { parseLocalDate } from '@/lib/date';
import { niceMax, type DailyCount } from '@/lib/stats';

const PLOT_HEIGHT = 128;

function formatDay(day: DailyCount): string {
  const date = parseLocalDate(day.date);
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${day.label})`;
}

export function WeeklyChart({ days }: { days: readonly DailyCount[] }) {
  const titleId = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const total = days.reduce((sum, day) => sum + day.reviewedCount, 0);
  const max = niceMax(Math.max(...days.map((day) => day.reviewedCount), 0));
  const lastIndex = days.length - 1;

  return (
    <section aria-labelledby={titleId} className="rounded-3xl border border-slate-200 bg-white p-4">
      <div className="flex items-baseline justify-between">
        <h2 id={titleId} className="font-semibold">
          최근 7일 학습량
        </h2>
        <p className="text-sm text-slate-500">합계 {total}개</p>
      </div>

      <div className="mt-7 flex gap-2">
        <div aria-hidden="true" className="flex flex-col justify-between text-right text-xs text-slate-400" style={{ height: PLOT_HEIGHT }}>
          <span className="-translate-y-1/2">{max}</span>
          <span className="translate-y-1/2">0</span>
        </div>

        <div className="relative flex-1">
          <div aria-hidden="true" className="absolute inset-x-0 top-0 border-t border-slate-100" />
          <div aria-hidden="true" className="absolute inset-x-0 border-t border-slate-200" style={{ top: PLOT_HEIGHT }} />

          <ol className="relative flex items-end justify-between" style={{ height: PLOT_HEIGHT }}>
            {days.map((day, index) => {
              const height = (day.reviewedCount / max) * PLOT_HEIGHT;
              const isToday = index === lastIndex;
              const active = activeIndex === index;
              return (
                <li key={day.date} className="relative flex h-full flex-1 justify-center">
                  <button
                    type="button"
                    aria-label={`${formatDay(day)} ${day.reviewedCount}개 학습, 정답 ${day.correctCount}개`}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseLeave={() => setActiveIndex(null)}
                    onFocus={() => setActiveIndex(index)}
                    onBlur={() => setActiveIndex(null)}
                    className="flex h-full w-full items-end justify-center rounded-md focus-visible:outline-2 focus-visible:outline-indigo-500"
                  >
                    <span
                      className={`block w-full max-w-6 rounded-t ${active ? 'bg-indigo-700' : 'bg-indigo-600'}`}
                      style={{ height }}
                    />
                  </button>
                  {isToday && day.reviewedCount > 0 && !active && (
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute text-xs font-semibold text-slate-700"
                      style={{ bottom: height + 4 }}
                    >
                      {day.reviewedCount}
                    </span>
                  )}
                  {active && (
                    <span
                      role="tooltip"
                      className={`pointer-events-none absolute z-10 rounded-lg bg-slate-900 px-2 py-1 text-xs whitespace-nowrap text-white shadow ${
                        index === 0 ? 'left-0' : index === lastIndex ? 'right-0' : ''
                      }`}
                      style={{ bottom: Math.min(height, PLOT_HEIGHT - 36) + 8 }}
                    >
                      {formatDay(day)}
                      <br />
                      {day.reviewedCount}개 학습 · 정답 {day.correctCount}개
                    </span>
                  )}
                </li>
              );
            })}
          </ol>

          <ol aria-hidden="true" className="mt-1 flex justify-between text-xs text-slate-500">
            {days.map((day, index) => (
              <li key={day.date} className={`flex-1 text-center ${index === lastIndex ? 'font-semibold text-slate-900' : ''}`}>
                {index === lastIndex ? '오늘' : day.label}
              </li>
            ))}
          </ol>
        </div>
      </div>

      <details className="mt-3 text-sm">
        <summary className="flex min-h-11 cursor-pointer items-center text-slate-500">표로 보기</summary>
        <table className="w-full text-left">
          <thead className="text-slate-500">
            <tr>
              <th scope="col" className="py-1 font-medium">날짜</th>
              <th scope="col" className="py-1 text-right font-medium">학습</th>
              <th scope="col" className="py-1 text-right font-medium">정답</th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => (
              <tr key={day.date} className="border-t border-slate-100">
                <td className="py-1">{formatDay(day)}</td>
                <td className="py-1 text-right tabular-nums">{day.reviewedCount}</td>
                <td className="py-1 text-right tabular-nums">{day.correctCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </section>
  );
}
