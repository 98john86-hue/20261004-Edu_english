import { distanceExample, howItWorks, learningExample } from '@/content/landing';
import { DistanceLogCard, LearningLogCard } from '@/components/ui/LogCard';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-16 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
        <ol className="grid gap-3 sm:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-sky-50 p-4 sm:flex-col">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{step.title}</h3>
                <p className="mt-0.5 text-sm text-slate-600">{step.description}</p>
              </div>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 text-center text-xl font-extrabold text-slate-900">{howItWorks.examplesTitle}</h3>
        <div className="mt-5 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
          <DistanceLogCard log={distanceExample} />
          <p className="text-center text-sm font-bold text-slate-500">{howItWorks.orLabel}</p>
          <LearningLogCard log={learningExample} />
        </div>
        <p className="mt-4 text-center text-sm text-slate-600">{howItWorks.examplesNote}</p>
      </div>
    </section>
  );
}
