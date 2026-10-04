'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: '홈', icon: '🏠' },
  { href: '/study', label: '학습', icon: '🃏' },
  { href: '/words', label: '단어', icon: '📚' },
] as const;

export function BottomNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="주요 메뉴" className="sticky bottom-0 border-t border-slate-200 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-2xl">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href);
          return (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 flex-col items-center justify-center text-xs ${
                  active ? 'font-semibold text-indigo-600' : 'text-slate-500'
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  {item.icon}
                </span>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
