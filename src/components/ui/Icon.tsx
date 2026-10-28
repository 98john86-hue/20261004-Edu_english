import type { ReactNode } from 'react';

export type IconName = 'ruler' | 'bulb' | 'check' | 'chevron' | 'wave';

const paths: Record<IconName, ReactNode> = {
  ruler: (
    <>
      <rect x="2" y="8" width="20" height="8" rx="1.5" />
      <path d="M6 8v3M10 8v4M14 8v3M18 8v4" />
    </>
  ),
  bulb: (
    <>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3Z" />
    </>
  ),
  check: <path d="m5 12 5 5 9-10" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  wave: (
    <>
      <path d="M2 9c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
      <path d="M2 16c2.5 0 2.5-2 5-2s2.5 2 5 2 2.5-2 5-2 2.5 2 5 2" />
    </>
  ),
};

type IconProps = { name: IconName; className?: string };

/** 장식용 인라인 SVG 아이콘 (스크린리더에서는 숨김) */
export function Icon({ name, className = 'size-6' }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}
