// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { PortableTextBlock } from '@portabletext/types';

interface Props {
  body?: unknown;
  className?: string;
}

export function TextBlock({ body, className }: Props) {
  if (!body) return null;

  return (
    <PortableTextRenderer
      value={body as PortableTextBlock[]}
      className={className}
    />
  );
}
