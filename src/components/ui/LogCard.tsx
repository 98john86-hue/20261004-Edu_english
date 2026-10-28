import type { ReactNode } from 'react';
import { logCard } from '@/content/landing';
import { formatLogDate } from '@/lib/date';
import { formatMeters, getTotalDistance } from '@/lib/distance';
import type { DistanceLog, LearningLog } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Icon } from '@/components/ui/Icon';

function CardShell({ title, date, icon, children }: { title: string; date: string; icon: 'ruler' | 'bulb'; children: ReactNode }) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center gap-2">
        <Icon name={icon} className="size-5 text-teal-700" />
        <h4 className="font-bold text-slate-900">{title}</h4>
        <p className="ml-auto text-sm text-slate-600">
          <time dateTime={date}>{formatLogDate(date)}</time>
        </p>
      </header>
      {children}
    </article>
  );
}

export function DistanceLogCard({ log }: { log: DistanceLog }) {
  return (
    <CardShell title={logCard.distanceTitle} date={log.date} icon="ruler">
      <p className="flex flex-wrap items-baseline gap-x-2 text-slate-700">
        <span>
          {formatMeters(log.laneLength)} × {log.laps}
          {logCard.lapsUnit} =
        </span>
        <strong className="text-2xl font-extrabold text-teal-800">{formatMeters(getTotalDistance(log))}</strong>
      </p>
    </CardShell>
  );
}

export function LearningLogCard({ log }: { log: LearningLog }) {
  return (
    <CardShell title={logCard.learningTitle} date={log.date} icon="bulb">
      <p className="text-slate-800">
        {log.stroke ? (
          <span className="mr-2 align-middle">
            <span className="sr-only">{logCard.strokeLabel}: </span>
            <Badge tone="tag">{log.stroke}</Badge>
          </span>
        ) : null}
        “{log.note}”
      </p>
    </CardShell>
  );
}
