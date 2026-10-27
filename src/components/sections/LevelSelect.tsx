'use client';

import { levelContent, levelOrder, levels } from '@/content/landing';
import { useLevel } from '@/components/LevelContext';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function LevelSelect() {
  const { level, setLevel } = useLevel();

  return (
    <section id="levels" aria-labelledby="levels-title" className="scroll-mt-16 bg-sky-50 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHeading
          id="levels-title"
          eyebrow={levels.eyebrow}
          title={levels.title}
          description={levels.description}
        />
        {/* 네이티브 라디오 버튼이라 방향키·Tab·Space로 조작 가능 */}
        <fieldset>
          <legend className="sr-only">{levels.legend}</legend>
          <div className="grid gap-5 md:grid-cols-3">
            {levelOrder.map((key, i) => {
              const content = levelContent[key];
              const selected = level === key;
              return (
                <label
                  key={key}
                  className={`relative flex cursor-pointer flex-col rounded-3xl border-2 bg-white p-6 transition has-focus-visible:outline-3 has-focus-visible:outline-offset-3 has-focus-visible:outline-accent ${
                    selected ? 'border-teal-600 shadow-xl shadow-teal-900/10' : 'border-slate-200 hover:border-teal-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="level-choice"
                    value={key}
                    checked={selected}
                    onChange={() => setLevel(key)}
                    className="sr-only"
                  />
                  <span className="flex items-center justify-between">
                    <span className="flex items-end gap-1" aria-hidden="true">
                      {[0, 1, 2].map((bar) => (
                        <span
                          key={bar}
                          className={`w-2 rounded-sm ${bar <= i ? 'bg-teal-600' : 'bg-slate-200'}`}
                          style={{ height: `${10 + bar * 6}px` }}
                        />
                      ))}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-bold ${
                        selected ? 'bg-teal-700 text-white' : 'invisible'
                      }`}
                      aria-hidden={!selected}
                    >
                      <Icon name="check" className="size-3.5" />
                      {levels.selectedLabel}
                    </span>
                  </span>
                  <span className="mt-4 text-2xl font-extrabold text-slate-900">{content.label}</span>
                  <span className="text-sm font-bold text-teal-700">{content.title}</span>
                  <span className="mt-4 text-xs font-bold text-slate-500">{levels.targetLabel}</span>
                  <span className="mt-1 text-slate-700">{content.target}</span>
                  <span className="mt-5 text-xs font-bold text-slate-500">{levels.examplesLabel}</span>
                  <span className="mt-2 flex flex-col gap-2 text-sm">
                    <span className="rounded-xl bg-sky-50 px-3 py-2 text-slate-800">
                      <strong className="mr-1 text-sky-800">{levels.distancePrefix}</strong>
                      {content.distanceExample}
                    </span>
                    <span className="rounded-xl bg-teal-50 px-3 py-2 text-slate-800">
                      <strong className="mr-1 text-teal-800">{levels.learningPrefix}</strong>
                      {content.learningExample}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>
    </section>
  );
}
