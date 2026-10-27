'use client';

import { useId, useState } from 'react';
import { demo, strokeOptions } from '@/content/landing';
import type { DistanceLog, LearningLog, Stroke } from '@/types';
import { DistanceLogCard, LearningLogCard } from '@/components/ui/LogCards';
import { SectionHeading } from '@/components/ui/SectionHeading';

type Mode = 'distance' | 'learning';

const isStroke = (value: string): value is Stroke => (strokeOptions as readonly string[]).includes(value);

const fieldClass =
  'mt-2 w-full rounded-xl border-2 border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-teal-600';

export function LogDemo() {
  const id = useId();
  const [mode, setMode] = useState<Mode>('distance');
  const [laneLength, setLaneLength] = useState<number>(demo.laneOptions[0]);
  const [laps, setLaps] = useState(8);
  const [stroke, setStroke] = useState<Stroke>('자유형');
  const [note, setNote] = useState('');

  const distanceLog: DistanceLog = { type: 'distance', date: demo.defaultDate, laneLength, laps };
  const learningLog: LearningLog = { type: 'learning', date: demo.defaultDate, stroke, note };

  return (
    <section aria-labelledby="demo-title" className="bg-linear-to-b from-white to-cyan-50 py-16 sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <SectionHeading id="demo-title" eyebrow={demo.eyebrow} title={demo.title} description={demo.description} />
        <div className="grid items-start gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <fieldset>
              <legend className="font-bold text-slate-900">{demo.modeLabel}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 rounded-2xl bg-slate-100 p-1">
                {(Object.keys(demo.modes) as Mode[]).map((key) => (
                  <label
                    key={key}
                    className={`cursor-pointer rounded-xl px-3 py-2 text-center text-sm font-bold has-focus-visible:outline-3 has-focus-visible:outline-accent ${
                      mode === key ? 'bg-white text-teal-800 shadow' : 'text-slate-600'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`${id}-mode`}
                      value={key}
                      checked={mode === key}
                      onChange={() => setMode(key)}
                      className="sr-only"
                    />
                    {demo.modes[key]}
                  </label>
                ))}
              </div>
            </fieldset>

            {mode === 'distance' ? (
              <div className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`${id}-lane`} className="text-sm font-bold text-slate-800">
                    {demo.laneLabel}
                  </label>
                  <select
                    id={`${id}-lane`}
                    value={laneLength}
                    onChange={(e) => setLaneLength(Number(e.target.value))}
                    className={fieldClass}
                  >
                    {demo.laneOptions.map((len) => (
                      <option key={len} value={len}>
                        {len}m
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${id}-laps`} className="text-sm font-bold text-slate-800">
                    {demo.lapsLabel}
                  </label>
                  <input
                    id={`${id}-laps`}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={200}
                    value={Number.isNaN(laps) ? '' : laps}
                    onChange={(e) => setLaps(Math.min(200, Math.max(0, e.target.valueAsNumber)))}
                    className={fieldClass}
                  />
                </div>
              </div>
            ) : (
              <div className="mt-5 flex flex-col gap-4">
                <div>
                  <label htmlFor={`${id}-stroke`} className="text-sm font-bold text-slate-800">
                    {demo.strokeLabel}
                  </label>
                  <select
                    id={`${id}-stroke`}
                    value={stroke}
                    onChange={(e) => {
                      if (isStroke(e.target.value)) setStroke(e.target.value);
                    }}
                    className={fieldClass}
                  >
                    {strokeOptions.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor={`${id}-note`} className="text-sm font-bold text-slate-800">
                    {demo.noteLabel}
                  </label>
                  <textarea
                    id={`${id}-note`}
                    rows={3}
                    maxLength={120}
                    value={note}
                    placeholder={demo.notePlaceholder}
                    onChange={(e) => setNote(e.target.value)}
                    className={`${fieldClass} resize-none placeholder:text-slate-500`}
                  />
                </div>
              </div>
            )}
          </div>

          <div aria-live="polite">
            <p className="mb-3 text-sm font-bold text-slate-600">{demo.previewLabel}</p>
            {mode === 'distance' ? <DistanceLogCard log={distanceLog} /> : <LearningLogCard log={learningLog} />}
          </div>
        </div>
      </div>
    </section>
  );
}
