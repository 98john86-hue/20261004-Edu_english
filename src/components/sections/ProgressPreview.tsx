import { progress } from '@/content/landing';
import type { DayStatus } from '@/lib/types';
import { Icon } from '@/components/ui/Icon';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/Reveal';

// 색만으로 구분하지 않도록 아이콘도 함께 사용
const statusStyle: Record<DayStatus, string> = {
  distance: 'bg-sky-600 text-white',
  learning: 'bg-teal-700 text-white',
  both: 'bg-linear-to-br from-sky-600 to-teal-700 text-white ring-2 ring-amber-400',
  upcoming: 'border-2 border-dashed border-slate-300 bg-white text-slate-500',
};

function StatusMark({ status }: { status: DayStatus }) {
  if (status === 'distance') return <Icon name="ruler" className="size-4" />;
  if (status === 'learning') return <Icon name="bulb" className="size-4" />;
  if (status === 'both')
    return (
      <span className="flex">
        <Icon name="ruler" className="size-3.5" />
        <Icon name="bulb" className="size-3.5" />
      </span>
    );
  return null;
}

const legendOrder: DayStatus[] = ['distance', 'learning', 'both', 'upcoming'];

export function ProgressPreview() {
  const done = progress.days.filter((d) => d !== 'upcoming').length;

  return (
    <section aria-labelledby="progress-title" className="py-16 sm:py-24">
      <Reveal className="mx-auto max-w-4xl px-4 sm:px-6">
        <SectionHeading
          id="progress-title"
          eyebrow={progress.eyebrow}
          title={progress.title}
          description={progress.description}
          badge={<Badge tone="sample">{progress.sampleBadge}</Badge>}
        />
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-lg shadow-sky-900/5 sm:p-8">
          <p className="mb-4 text-center font-bold text-slate-800">{progress.summary(done, progress.days.length)}</p>
          <ol aria-label={progress.gridLabel} className="grid grid-cols-6 gap-2 sm:grid-cols-10 sm:gap-3">
            {progress.days.map((status, i) => (
              <li
                key={i}
                className={`flex aspect-square flex-col items-center justify-center gap-0.5 rounded-xl text-xs font-bold sm:text-sm ${statusStyle[status]}`}
              >
                <span className="sr-only">
                  {progress.dayLabel(i + 1)}: {progress.legend[status]}
                </span>
                <span aria-hidden="true">{i + 1}</span>
                <span aria-hidden="true">
                  <StatusMark status={status} />
                </span>
              </li>
            ))}
          </ol>
          <ul className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-slate-700">
            {legendOrder.map((status) => (
              <li key={status} className="flex items-center gap-2">
                <span className={`grid size-6 place-items-center rounded-md ${statusStyle[status]}`} aria-hidden="true">
                  <StatusMark status={status} />
                </span>
                {progress.legend[status]}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  );
}
