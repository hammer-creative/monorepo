// apps/web/src/components/modules/Text/TextModule.tsx
import { ClientNames } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

// Layout type from generated schema
type Layout = NonNullable<TextModuleType['layout']>;

// Map layout values to CSS class names
const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  headlineLeft: 'headline-left',
  headlineMiddle: 'headline-middle',
  homePage: 'home-page',
} as const;

// Type guard: Check if module data exists and is valid
function isValidTextModule(
  data: TextModuleType | null,
): data is TextModuleType {
  return data !== null;
}

export function TextModule({
  data,
  clients = [],
}: {
  data: TextModuleType | null;
  clients?: Array<{ _id: string; name?: string }>;
}) {
  // Guard: Early return if no valid data
  if (!isValidTextModule(data)) return null;

  // Destructure with defaults for optional fields
  const {
    title = null,
    body = null,
    layout = 'headlineLeft',
    tag = null,
  } = data;

  // Extract client names
  const clientNames = (clients || [])
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  // Get CSS class for current layout
  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasClients = clientNames.length > 0;

  return (
    <div className={`wrapper ${layoutClass}`}>
      {/* Headline Left Layout: Tag + Title in separate row */}
      {layout === 'headlineLeft' && (
        <div className="row headline">
          {tag && <div className="tag">{tag}</div>}
          {title && <h2>{title}</h2>}
        </div>
      )}

      {/* Home Page Layout: Tag + Title + Body all together */}
      {layout === 'homePage' && (
        <div className="row">
          {tag && <div className="tag">{tag}</div>}
          {title && <h2>{title}</h2>}
          {body && <TextBlock body={body} className="medium" />}
        </div>
      )}

      {/* Body section for Headline Left and Headline Middle layouts */}
      {(layout === 'headlineLeft' || layout === 'headlineMiddle') && body && (
        <div className="row text">
          <TextBlock body={body} className="medium" />

          {/* Headline Middle puts tag and clients after body */}
          {layout === 'headlineMiddle' && (
            <>
              {tag && <div className="tag">{tag}</div>}
              {hasClients && (
                <div className="clients">
                  <ClientNames clientNames={clientNames} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
