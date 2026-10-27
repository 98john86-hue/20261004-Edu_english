import { hero } from '@/content/landing';
import { Icon } from '@/components/ui/Icon';

const wavePath =
  'M0 40 C 120 10 240 10 360 40 S 600 70 720 40 S 960 10 1080 40 S 1320 70 1440 40 V120 H0 Z';

/** 가로로 두 번 이어 붙인 물결을 -50%까지 이동시켜 끊김 없이 반복 */
function WaveLayer({ className, fill, animation }: { className: string; fill: string; animation: string }) {
  return (
    <div className={`absolute inset-x-0 bottom-0 overflow-hidden ${className}`} aria-hidden="true">
      <svg viewBox="0 0 2880 120" preserveAspectRatio="none" className={`h-full w-[200%] ${animation}`}>
        <path d={wavePath} fill={fill} />
        <path d={wavePath} fill={fill} transform="translate(1440 0)" />
      </svg>
    </div>
  );
}

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
          <a
            href="#signup"
            className="w-full rounded-full bg-accent px-8 py-4 text-lg font-bold text-white shadow-lg shadow-orange-900/20 transition hover:-translate-y-0.5 hover:bg-accent-strong sm:w-auto"
          >
            {hero.primaryCta}
          </a>
          <a
            href="#examples"
            className="w-full rounded-full border-2 border-teal-700 bg-white px-8 py-3.5 text-lg font-bold text-teal-800 hover:bg-teal-50 sm:w-auto"
          >
            {hero.secondaryCta}
          </a>
        </div>
        <ul className="mt-8 flex flex-wrap justify-center gap-2">
          {hero.chips.map((chip) => (
            <li key={chip} className="rounded-full bg-white/70 px-3 py-1 text-sm font-medium text-slate-700">
              {chip}
            </li>
          ))}
        </ul>
      </div>

      <WaveLayer className="h-28 opacity-60 sm:h-36" fill="#7dd3fc" animation="animate-wave-slow" />
      <WaveLayer className="h-20 opacity-70 sm:h-28" fill="#5eead4" animation="animate-wave" />
      <WaveLayer className="h-12 sm:h-16" fill="#ffffff" animation="animate-wave-slow" />
    </section>
  );
}
