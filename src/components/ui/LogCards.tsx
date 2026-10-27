import type { ReactNode } from 'react';
import { logCard } from '@/content/landing';
import { formatLogDate } from '@/lib/date';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { DistanceLog, LearningLog } from '@/types';
import { Icon } from '@/components/ui/Icon';

function CardShell({ title, date, icon, tone, children }: {
  title: string;
  date: string;
  icon: 'ruler' | 'bulb';
  tone: 'sky' | 'teal';
  children: ReactNode;
}) {
  const toneClass = tone === 'sky' ? 'bg-sky-100 text-sky-800' : 'bg-teal-100 text-teal-800';
  return (
    <article className="w-full rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-sky-900/10 sm:p-6">
      <header className="mb-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`grid size-10 place-items-center rounded-2xl ${toneClass}`}>
            <Icon name={icon} className="size-5" />
          </span>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-600">
              <time dateTime={date}>{formatLogDate(date)}</time>
            </p>
          </div>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
          <Icon name="check" className="size-3.5" />
          {logCard.successBadge}
        </span>
      </header>
      {children}
    </article>
  );
}

export function DistanceLogCard({ log }: { log: DistanceLog }) {
  const total = getTotalDistance(log);
  return (
    <CardShell title={logCard.distanceTitle} date={log.date} icon="ruler" tone="sky">
      <dl className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-600">{logCard.laneLabel}</dt>
          <dd className="mt-1 text-xl font-bold text-slate-900">{formatMeters(log.laneLength)}</dd>
        </div>
        <div className="rounded-2xl bg-slate-50 p-3">
          <dt className="text-xs font-medium text-slate-600">{logCard.lapsLabel}</dt>
          <dd className="mt-1 text-xl font-bold text-slate-900">
            {log.laps}
            {logCard.lapsUnit}
            <span className="ml-1 text-xs font-medium text-slate-600">({logCard.lapsHint})</span>
          </dd>
        </div>
        <div className="col-span-2 rounded-2xl bg-linear-to-r from-sky-600 to-teal-600 p-4 text-white">
          <dt className="text-xs font-medium text-sky-50">{logCard.totalLabel}</dt>
          <dd className="mt-1 flex flex-wrap items-baseline gap-x-2 text-sm text-sky-50">
            <span>
              {formatMeters(log.laneLength)} × {log.laps}
              {logCard.lapsUnit} =
            </span>
            <strong className="text-3xl font-extrabold text-white">{formatMeters(total)}</strong>
          </dd>
        </div>
      </dl>
    </CardShell>
  );
}

export function LearningLogCard({ log }: { log: LearningLog }) {
  const note = log.note.trim();
  return (
    <CardShell title={logCard.learningTitle} date={log.date} icon="bulb" tone="teal">
      {log.stroke ? (
        <p className="mb-3">
          <span className="sr-only">{logCard.strokeLabel}: </span>
          <span className="inline-block rounded-full bg-teal-700 px-3 py-1 text-xs font-bold text-white">
            #{log.stroke}
          </span>
        </p>
      ) : null}
      <div className="rounded-2xl border-l-4 border-teal-500 bg-teal-50 p-4">
        <p className="text-xs font-medium text-teal-800">{logCard.noteLabel}</p>
        <p className={`mt-1 text-lg leading-relaxed font-semibold ${note ? 'text-slate-900' : 'text-slate-500'}`}>
          {note ? `“${note}”` : logCard.emptyNote}
        </p>
      </div>
    </CardShell>
  );
}
