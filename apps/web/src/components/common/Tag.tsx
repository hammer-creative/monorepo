// apps/web/src/components/common/Tag.tsx
import type { ElementType, ReactNode } from 'react';

interface TagProps {
  title?: ReactNode | null;
  className?: string;
  as?: ElementType;
}

export function Tag({ title, className = '', as = 'span' }: TagProps) {
  if (!title) return null;

  const Component = as as any;

  return <Component className={className}>{title}</Component>;
}
