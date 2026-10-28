import { testimonials } from '@/content/landing';
import { Badge } from '@/components/ui/Badge';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-title" className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          id="testimonials-title"
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          description={testimonials.notice}
        />
        <ul className="grid gap-3 sm:grid-cols-3">
          {testimonials.items.map((item) => (
            <li key={item.name}>
              <figure className="flex h-full flex-col rounded-2xl border border-slate-200 p-4">
                <Badge tone="sample">{testimonials.badge}</Badge>
                <blockquote className="mt-3 flex-1 text-slate-800">“{item.quote}”</blockquote>
                <figcaption className="mt-3 text-sm">
                  <span className="font-bold text-slate-900">{item.name}</span>
                  <span className="ml-1.5 text-slate-600">{item.meta}</span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
