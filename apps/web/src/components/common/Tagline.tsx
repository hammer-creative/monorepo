// apps/web/src/components/common/Tagline.tsx

import type { ReactNode } from 'react';

interface TaglineProps {
  children?: ReactNode;
  text?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

export function Tagline({
  children,
  text,
  variant,
  as: Component = 'div',
  className,
}: TaglineProps) {
  const content = children ?? text;
  if (!content) return null;

  const classes = ['tagline', variant && `tagline--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{content}</Component>;
}
