import { howItWorks } from '@/content/landing';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function HowItWorks() {
  return (
    <section id="how" aria-labelledby="how-title" className="scroll-mt-16 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="how-title" eyebrow={howItWorks.eyebrow} title={howItWorks.title} />
        <ol className="grid gap-5 md:grid-cols-3">
          {howItWorks.steps.map((step, i) => (
            <li key={step.title} className="relative rounded-3xl border border-sky-100 bg-sky-50/60 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                <span className="grid size-14 place-items-center rounded-2xl bg-teal-700 text-white">
                  <Icon name={step.icon} className="size-7" />
                </span>
                <span className="text-4xl font-black text-sky-600" aria-hidden="true">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">
                <span className="sr-only">{i + 1}. </span>
                {step.title}
              </h3>
              <p className="mt-2 text-slate-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
