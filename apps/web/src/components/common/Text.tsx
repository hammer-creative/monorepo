// apps/web/src/components/common/Text.tsx

import type { ReactNode } from 'react';

interface TextProps {
  children?: ReactNode;
  text?: string;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'tagline';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

const headings = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export function Text({
  children,
  text,
  variant,
  as: Component = 'div',
  className,
}: TextProps) {
  const content = children ?? text;
  if (!content) return null;

  const classes = [
    headings.has(Component) && 'title',
    'text',
    variant && `text--${variant}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{content}</Component>;
}
