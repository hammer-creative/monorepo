// TODO: add common title component, add common text component
// apps/web/src/components/modules/TextImage/TextModule.ts
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModuleType } from '@/types/sanity';

export function TextModule({ data }: { data: TextModuleType }) {
  const bgColor =
    data.backgroundColor?.enabled && data.backgroundColor?.hex
      ? data.backgroundColor.hex
      : 'transparent';

  // console.log('TextModule data:', data);

  return (
    <>
      <div className="flex">
        <div className="flex-item">
          {data.tag && <div className="tag">{data.tag}</div>}
          <h2>{data.title}</h2>
        </div>
        <div className="flex-item">
          <TextBlock body={data.body} className="text medium" />
        </div>
      </div>
    </>
  );
}
