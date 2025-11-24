// TODO: add common title component, add common text component
// apps/web/src/components/modules/TextImage/TextModule.ts
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModuleType } from '@/types/sanity';

export function TextModule({ data, clientName }: { data: TextModuleType }) {
  const bgColor =
    data.backgroundColor?.enabled && data.backgroundColor?.hex
      ? data.backgroundColor.hex
      : 'transparent';

  console.log(clientName);

  const layoutClass =
    data.layout === 'headlineLeft' ? 'headline-left' : 'headline-middle';

  return (
    <>
      <div className={`flex ${layoutClass}`}>
        {data.layout === 'headlineLeft' && (
          <div className="flex-item headline">
            {data.tag && <div className="tag">{data.tag}</div>}
            {data.title && data.layout === 'headlineLeft' && (
              <h2>{data.title}</h2>
            )}
          </div>
        )}

        {data.body && (
          <div className="flex-item copy">
            <TextBlock body={data.body} className="text medium" />
            {data.layout === 'headlineMiddle' && (
              <div className="tag">{clientName}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
