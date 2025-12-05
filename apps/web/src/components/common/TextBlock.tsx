// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';

interface Props {
  body?: any | null;
  className?: string;
}

export function TextBlock({ body, className }: Props) {
  if (!body) return null;

  return <PortableTextRenderer value={body} className={className} />;
}
