import { story } from '@/content/landing';

/** 사전 등록 바로 앞에 두는 짧은 개인 이야기 */
export function Story() {
  return (
    <section aria-labelledby="story-title" className="px-4 py-14 sm:py-20">
      <div className="mx-auto max-w-xl text-center">
        <h2 id="story-title" className="text-sm font-bold tracking-wider text-teal-700">
          {story.eyebrow}
        </h2>
        <div className="mt-6 flex flex-col gap-5 text-lg leading-relaxed text-slate-700">
          {story.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <p className="mt-8 text-2xl font-extrabold text-teal-800 sm:text-3xl">{story.closing}</p>
        <p className="mt-2 text-sm text-slate-600">{story.gloss}</p>
      </div>
    </section>
  );
}
