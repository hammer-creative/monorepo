// apps/web/src/components/common/Title.tsx
import type { ElementType, ReactNode } from 'react';

interface TitleProps {
  title?: ReactNode | null;
  className?: string;
  as?: ElementType;
}

export function Title({ title, className, as: Tag = 'div' }: TitleProps) {
  // Guard: nothing to render if no title
  if (!title) return null;

  return className ? (
    <Tag className={className}>{title}</Tag>
  ) : (
    <Tag>{title}</Tag>
  );
}
