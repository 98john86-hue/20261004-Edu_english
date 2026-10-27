import { testimonials } from '@/content/landing';
import { SampleBadge } from '@/components/ui/SampleBadge';
import { SectionHeading } from '@/components/ui/SectionHeading';
import { Reveal } from '@/components/Reveal';

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="bg-sky-50 py-16 sm:py-24">
      <Reveal className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="testimonials-title"
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          description={testimonials.notice}
        />
        <ul className="grid gap-5 md:grid-cols-3">
          {testimonials.items.map((item) => (
            <li key={item.name}>
              <figure className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <SampleBadge label={testimonials.badge} />
                <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-slate-800">“{item.quote}”</blockquote>
                <figcaption className="mt-5 flex items-center gap-3">
                  <span className="grid size-10 place-items-center rounded-full bg-slate-200 text-slate-600" aria-hidden="true">
                    ?
                  </span>
                  <span>
                    <span className="block font-bold text-slate-900">{item.name}</span>
                    <span className="block text-sm text-slate-600">{item.meta}</span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </Reveal>
    </section>
  );
}
