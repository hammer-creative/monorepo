// apps/web/src/components/common/Tag.tsx
import type { ReactNode } from 'react';

interface TagProps {
  title?: ReactNode | null;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export function Tag({
  title,
  className = '',
  as: Component = 'span',
}: TagProps) {
  if (!title) return null;

  return <Component className={className}>{title}</Component>;
}
