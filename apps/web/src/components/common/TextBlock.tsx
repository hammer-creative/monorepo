// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { PortableTextBlock } from '@portabletext/types';

interface TextBlockProps {
  body?: unknown;
  variant?: 'dropquote' | 'has-headline' | 'hero' | 'impact' | 'small';
  className?: string;
}

export function TextBlock({ body, variant, className }: TextBlockProps) {
  if (!body) return null;

  const classes = ['text', variant && `text--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <PortableTextRenderer value={body as PortableTextBlock[]} />
    </div>
  );
}
