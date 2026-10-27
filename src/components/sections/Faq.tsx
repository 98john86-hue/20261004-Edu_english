'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { faq } from '@/content/landing';
import { Icon } from '@/components/ui/Icon';
import { SectionHeading } from '@/components/ui/SectionHeading';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);

  // WAI-ARIA 아코디언 패턴: 위/아래 방향키, Home/End로 질문 사이 이동
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const count = faq.items.length;
    const targets: Record<string, number> = {
      ArrowDown: (index + 1) % count,
      ArrowUp: (index - 1 + count) % count,
      Home: 0,
      End: count - 1,
    };
    const next = targets[e.key];
    if (next === undefined) return;
    e.preventDefault();
    buttonsRef.current[next]?.focus();
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-16 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHeading id="faq-title" eyebrow={faq.eyebrow} title={faq.title} />
        <div className="divide-y divide-slate-200 rounded-3xl border border-slate-200 bg-white">
          {faq.items.map((item, i) => {
            const open = openIndex === i;
            const buttonId = `${baseId}-q${i}`;
            const panelId = `${baseId}-a${i}`;
            return (
              <div key={item.question}>
                <h3>
                  <button
                    ref={(el) => {
                      buttonsRef.current[i] = el;
                    }}
                    id={buttonId}
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left font-bold text-slate-900 hover:bg-sky-50 sm:px-6"
                  >
                    {item.question}
                    <Icon
                      name="chevron"
                      className={`size-5 shrink-0 text-teal-700 transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  hidden={!open}
                  className="px-5 pb-5 leading-relaxed text-slate-700 sm:px-6"
                >
                  {item.answer}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
