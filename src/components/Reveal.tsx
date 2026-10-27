'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * 화면에 들어올 때 부드럽게 나타나는 래퍼.
 * 서버 렌더링 시에는 그대로 보이고, 마운트 후 뷰포트 아래에 있는 요소만 숨겼다가 보여 준다.
 * (JS가 없거나 모션 축소 설정이면 효과 없음)
 */
export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    el.classList.add('reveal-hidden');
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          el.classList.add('reveal-shown');
          el.classList.remove('reveal-hidden');
          observer.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
