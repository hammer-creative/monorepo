// apps/web/src/components/modules/Impact/ImpactModule.ts
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { ImpactModuleType, TextBlock } from '@/types/sanity';
import { ImpactModuleItem } from './ImpactModuleItem';

export function ImpactModule({ data }: { data: ImpactModuleType }) {
  // console.log('ImpactModule data:', data);

  const blocks: TextBlock[] = [
    data.textBlock1,
    data.textBlock2,
    data.textBlock3,
  ].filter((b): b is TextBlock => Boolean(b));

  return (
    <>
      <div className="flex">
        {blocks.map((block, i) => (
          <ImpactModuleItem key={i} item={block} />
        ))}
      </div>
    </>
  );
}
