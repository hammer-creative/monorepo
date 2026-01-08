// apps/web/src/components/common/Title.tsx
import type { ReactNode } from 'react';

interface TitleProps {
  title?: ReactNode | null;
  className?: string;
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
}

export function Title({ title, className, as: Component = 'div' }: TitleProps) {
  if (!title) return null;

  return className ? (
    <Component className={className}>{title}</Component>
  ) : (
    <Component>{title}</Component>
  );
}
