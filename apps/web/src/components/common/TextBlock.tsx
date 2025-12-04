// apps/web/src/components/common/TextBlock.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';

interface Props {
  body: any;
  className?: string;
}

export function TextBlock({ body, className }: Props) {
  console.log('this is the body ' + body);
  return <PortableTextRenderer value={body} className={className} />;
}
