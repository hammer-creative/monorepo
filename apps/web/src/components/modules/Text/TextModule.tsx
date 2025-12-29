// apps/web/src/components/modules/Text/TextModule.tsx
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModuleType } from '@/types/sanity';

const LAYOUT_CLASS_MAP = {
  headlineLeft: 'headline-left',
  headlineMiddle: 'headline-middle',
  homePage: 'home-page',
} as const;

export function TextModule({ data }: { data: TextModuleType | null }) {
  if (!data) return null;

  const { title, body, layout, tag } = data;
  const layoutClass =
    LAYOUT_CLASS_MAP[layout as keyof typeof LAYOUT_CLASS_MAP] ?? '';

  return (
    <div className={`container ${layoutClass}`}>
      {layout === 'headlineLeft' && (
        <div className="row headline">
          {tag && <div className="tag">{tag}</div>}
          {title && <h2>{title}</h2>}
        </div>
      )}

      {layout === 'homePage' && (
        <div className="row">
          {tag && <div className="tag">{tag}</div>}
          {title && <h2>{title}</h2>}
          {body && <TextBlock body={body} className="medium" />}
        </div>
      )}

      {(layout === 'headlineLeft' || layout === 'headlineMiddle') && body && (
        <div className="row text">
          <TextBlock body={body} className="medium" />
          {layout === 'headlineMiddle' && tag && (
            <div className="tag">{tag}</div>
          )}
        </div>
      )}
    </div>
  );
}
