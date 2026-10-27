import { hero } from '@/content/landing';
import { ButtonLink } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { WaveBackground } from '@/components/ui/WaveBackground';

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden bg-linear-to-b from-sky-100 via-cyan-50 to-teal-50 pt-14 pb-36 sm:pt-20 sm:pb-44"
    >
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6">
        <p className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-1.5 text-sm font-bold text-teal-800 shadow-sm">
          <Icon name="wave" className="size-4" />
          {hero.eyebrow}
        </p>
        <h1
          id="hero-title"
          className="mt-6 text-4xl leading-tight font-black tracking-tight text-slate-900 sm:text-6xl"
        >
          {hero.headlineLines.map((line, i) => (
            <span key={line} className={`block ${i === 1 ? 'text-teal-700' : ''}`}>
              {line}
            </span>
          ))}
        </h1>
        <p className="mt-6 text-lg font-bold text-slate-800 sm:text-2xl">{hero.subcopy}</p>
        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-700 sm:text-lg">{hero.body}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href="#signup" className="w-full sm:w-auto">
            {hero.primaryCta}
          </ButtonLink>
          <ButtonLink href="#examples" variant="outline" className="w-full sm:w-auto">
            {hero.secondaryCta}
          </ButtonLink>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {hero.chips.map((chip) => (
            <li key={chip} className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-slate-700">
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <WaveBackground />
    </section>
  );
}
