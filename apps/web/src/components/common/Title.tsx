// apps/web/src/components/common/Title.tsx

import type { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'default';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

export function Title({
  children,
  variant = 'default',
  as: Component = 'h2',
  className = '',
}: TitleProps) {
  if (!children) return null;

  const baseClasses = 'title line-height-tight';

  const variantClasses = {
    primary: 'font-serif text-xl-fluid',
    secondary:
      'font-serif font-weight-900 letter-spacing-tight mb-3 mr-5p pt-4 text-lg-fluid ws-pre-line',
    tertiary: 'font-sans text-lg-fluid',
    default: 'font-sans text-default',
  };

  return (
    <Component
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Component>
  );
}
