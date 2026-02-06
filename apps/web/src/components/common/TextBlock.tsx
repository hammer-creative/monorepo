// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { PortableTextBlock } from '@portabletext/types';

interface TextBlockProps {
  body?: unknown;
  className?: string;
  variant?: 'dropquote' | 'hero' | 'impact' | 'left-right' | 'default';
}

export function TextBlock({ body, variant = 'default' }: TextBlockProps) {
  if (!body) return null;

  // const baseClasses = undefined;

  const variantClasses = {
    dropquote: 'font-sans line-height-loose text-md-fluid',
    hero: 'font-sans line-height-loose text-lg-fluid',
    impact: 'font-sans text-md-fluid',
    'left-right': 'font-sans line-height-loose text-md-fluid',
    default: 'font-sans',
  };

  return (
    <PortableTextRenderer
      value={body as PortableTextBlock[]}
      className={`${variantClasses[variant]}`}
    />
  );
}
