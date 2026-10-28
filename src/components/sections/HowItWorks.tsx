import { howItWorks } from '@/content/landing';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-16 px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-xl">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
        <ol className="grid gap-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3 rounded-2xl bg-sky-50 p-4">
              <span className="grid size-8 shrink-0 place-items-center rounded-full bg-teal-700 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div>
                <h3 className="font-bold text-slate-900">{step.title}</h3>
                <p className="mt-0.5 text-slate-700">{step.description}</p>
                {'examples' in step ? (
                  <ul className="mt-2 grid gap-1">
                    {step.examples.map((example) => (
                      <li key={example} className="rounded-lg bg-white px-3 py-1.5 text-sm text-slate-800">
                        {example}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-3 text-center text-sm text-slate-600">{howItWorks.lapNote}</p>
      </div>
    </section>
  );
}
