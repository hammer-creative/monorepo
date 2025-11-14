// apps/web/src/components/modules/Impact/ImpactModule.ts
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { ImpactModuleType, TextBlock } from '@/types/sanity';
import { ImpactModuleItem } from './ImpactModuleItem';

export function ImpactModule({ data }: { data: ImpactModuleType }) {
  const bgColor =
    data.backgroundColor?.enabled && data.backgroundColor?.hex
      ? data.backgroundColor.hex
      : 'transparent';

  console.log('ImpactModule data:', data);

  const blocks: TextBlock[] = [
    data.textBlock1,
    data.textBlock2,
    data.textBlock3,
  ].filter((b): b is TextBlock => Boolean(b));

  return (
    <>
      Impact
      {/* your original commented code */}
      {/* <div className="flow">
        <h2>{data.title}</h2>
        <div className="rubric">{data.tag}</div>
        <PortableTextRenderer value={data.body} className="medium" />
      </div> */}
      {blocks.map((block, i) => (
        <ImpactModuleItem key={i} item={block} />
      ))}
    </>
  );
}
