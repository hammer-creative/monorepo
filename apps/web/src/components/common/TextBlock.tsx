// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { PortableTextBlock } from '@portabletext/types';

interface TextBlockProps {
  body?: unknown;
  variant?:
    | 'dropquote'
    | 'has-headline'
    | 'hero'
    | 'impact'
    | 'small'
    | 'default';
}

export function TextBlock({ body, variant = 'default' }: TextBlockProps) {
  if (!body) return null;

  return (
    <PortableTextRenderer
      value={body as PortableTextBlock[]}
      className={`text-block ${variant}`}
    />
  );
}
