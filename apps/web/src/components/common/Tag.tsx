// apps/web/src/components/common/Tag.tsx
import type { ElementType, ReactNode } from 'react';

interface TagProps {
  title?: ReactNode | null;
  className?: string;
  as?: ElementType;
}

export function Tag({ title, className = '', as: Tag = 'span' }: TagProps) {
  if (!title) return null;

  return <Tag className={className}>{title}</Tag>;
}
