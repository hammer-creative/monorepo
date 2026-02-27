import type { ReactNode } from 'react';

interface RubricProps {
  children?: ReactNode;
  text?: string;
  variant?: 'primary' | 'secondary' | 'tertiary';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

export function Rubric({
  children,
  text,
  variant,
  as: Component = 'h2',
  className,
}: RubricProps) {
  const content = children ?? text;
  if (!content) return null;

  const classes = [
    'rubric',
    variant && `rubric--${variant}`,
    text && `rubric--${text.toLowerCase().replace(/\s+/g, '-')}`,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return <Component className={classes}>{content}</Component>;
}
