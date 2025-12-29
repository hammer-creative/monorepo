// apps/web/src/components/modules/Impact/ImpactModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type {
  ImpactModule as ImpactModuleType,
  TextBlock,
} from '@/types/sanity.generated';

export function ImpactModule({ data }: { data: ImpactModuleType | null }) {
  if (!data) return null;

  const blocks = [data.textBlock1, data.textBlock2, data.textBlock3].filter(
    Boolean,
  ) as TextBlock[];

  if (!blocks.length) return null;

  return (
    <div className="flex">
      {blocks.map((item: TextBlock, i: number) => (
        <div key={i} className="flex-item">
          {item.title && <h3>{item.title}</h3>}
          {item.body && (
            <PortableTextRenderer value={item.body as any} className="small" />
          )}
        </div>
      ))}
    </div>
  );
}
