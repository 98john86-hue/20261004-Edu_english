import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'outline';
type ButtonSize = 'sm' | 'lg';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-white hover:bg-accent-strong shadow-lg shadow-orange-900/20',
  outline: 'border-2 border-teal-700 bg-white text-teal-800 hover:bg-teal-50',
};

const sizeClass: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  lg: 'px-8 py-4 text-lg',
};

export function buttonStyles(variant: ButtonVariant = 'primary', size: ButtonSize = 'lg'): string {
  return `inline-flex items-center justify-center gap-2 rounded-full font-bold whitespace-nowrap transition hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-wait disabled:opacity-80 ${variantClass[variant]} ${sizeClass[size]}`;
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

/** 페이지 내 앵커로 이동하는 버튼 모양 링크 */
export function ButtonLink({ href, variant, size, className = '', children }: ButtonLinkProps) {
  return (
    <a href={href} className={`${buttonStyles(variant, size)} ${className}`}>
      {children}
    </a>
  );
}
