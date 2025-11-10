// apps/web/src/components/modules/TextImage/TextModule.ts
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { TextModuleType } from '@/types/sanity';

export function TextModule({ data }: { data: TextModuleType }) {
  const bgColor =
    data.backgroundColor?.enabled && data.backgroundColor?.hex
      ? data.backgroundColor.hex
      : 'transparent';

  console.log('TextModule data:', data);

  return (
    <>
      <div className="flow">
        <h2>{data.title}</h2>
        <div className="rubric">{data.tag}</div>
        <PortableTextRenderer value={data.bodyText} className="medium" />
      </div>
    </>
  );
}
