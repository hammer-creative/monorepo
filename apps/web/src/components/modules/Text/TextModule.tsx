// apps/web/src/components/modules/TextImage/TextModule.tsx
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModuleType } from '@/types/sanity';

const LAYOUT_CLASS_MAP = {
  headlineLeft: 'headline-left',
  headlineMiddle: 'headline-middle',
  homePage: 'home-page',
} as const;

export function TextModule({ data }: { data: TextModuleType }) {
  const { title, body, layout, tag } = data;
  const layoutClass =
    LAYOUT_CLASS_MAP[layout as keyof typeof LAYOUT_CLASS_MAP] || '';

  return (
    <>
      <div className={`flex ${layoutClass}`}>
        {layout === 'headlineLeft' && (
          <div className="flex-item headline">
            {tag && <div className="tag">{tag}</div>}
            {title && <h2>{title}</h2>}
          </div>
        )}

        {layout === 'homePage' && (
          <div className="flex-item home-page-content">
            {tag && <div className="tag">{tag}</div>}
            {title && <h2>{title}</h2>}
            {body && <TextBlock body={body} className="text medium" />}
          </div>
        )}

        {(layout === 'headlineLeft' || layout === 'headlineMiddle') && body && (
          <div className="flex-item copy">
            <TextBlock body={body} className="text medium" />
            {layout === 'headlineMiddle' && tag && (
              <div className="tag">{tag}</div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
