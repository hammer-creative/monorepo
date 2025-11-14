// apps/web/src/components/modules/Impact/ImpactModuleItem.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { TextBlock } from '@/types/sanity';

export function ImpactModuleItem({ item }: { item: TextBlock }) {
  return (
    <div className="impact-item">
      {item.title && <h3>{item.title}</h3>}
      {item.body && (
        <PortableTextRenderer value={item.body} className="medium" />
      )}
    </div>
  );
}
