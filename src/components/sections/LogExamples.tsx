import { distanceExample, learningExample, logExamples } from '@/content/landing';
import { DistanceLogCard, LearningLogCard } from '@/components/ui/LogCard';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function LogExamples() {
  return (
    <section
      id="examples"
      aria-labelledby="examples-title"
      className="scroll-mt-16 bg-linear-to-b from-cyan-50 to-sky-100 py-16 sm:py-24"
    >
      <Reveal className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading
          id="examples-title"
          eyebrow={logExamples.eyebrow}
          title={logExamples.title}
          description={logExamples.description}
        />
        <div className="flex flex-col items-stretch gap-4 md:flex-row md:items-center md:gap-6">
          <div className="md:flex-1">
            <DistanceLogCard log={distanceExample} />
          </div>
          <p className="self-center rounded-full bg-white px-4 py-1.5 text-sm font-bold text-teal-800 shadow-sm">
            {logExamples.orLabel}
          </p>
          <div className="md:flex-1">
            <LearningLogCard log={learningExample} />
          </div>
        </div>
        <p className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-2xl bg-white/80 p-4 text-slate-700">
          <Icon name="check" className="mt-0.5 size-5 shrink-0 text-teal-700" />
          <span>
            <strong className="font-bold text-slate-900">{logExamples.bothNote}</strong>
            <span className="mt-1 block text-sm text-slate-600">{logExamples.lapNote}</span>
          </span>
        </p>
      </Reveal>
    </section>
  );
}
