import { benefits } from '@/content/landing';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function Benefits() {
  return (
    <section aria-labelledby="benefits-title" className="py-16 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading id="benefits-title" eyebrow={benefits.eyebrow} title={benefits.title} />
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.items.map((item) => (
            <li key={item.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <span className="grid size-12 place-items-center rounded-2xl bg-cyan-100 text-cyan-800">
                <Icon name={item.icon} />
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-900">{item.title}</h3>
              <p className="mt-2 text-slate-600">{item.description}</p>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
