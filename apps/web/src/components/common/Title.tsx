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

  const baseClasses = 'title';

  return (
    <Component className={`${baseClasses} ${variant} ${className}`}>
      {children}
    </Component>
  );
}
