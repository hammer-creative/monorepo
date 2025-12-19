// apps/web/src/components/common/Title.tsx
import type { ElementType, ReactNode } from 'react';

interface TitleProps {
  title?: ReactNode | null;
  className?: string;
  as?: ElementType;
}

export function Title({ title, className, as = 'div' }: TitleProps) {
  if (!title) return null;

  const Component = as as any;

  return className ? (
    <Component className={className}>{title}</Component>
  ) : (
    <Component>{title}</Component>
  );
}
