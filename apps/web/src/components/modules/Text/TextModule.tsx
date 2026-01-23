// apps/web/src/components/modules/Text/TextModule.tsx
import { ClientNames } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

// Layout type from generated schema
type Layout = NonNullable<TextModuleType['layout']>;

// Map layout values to CSS class names
const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  challenge: 'challenge',
  headlineLeft: 'headline-left',
  testimonial: 'testimonial',
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

  // Destructure module data
  const { title, body, layout, tag } = data;

  // Guard: Early return if no layout or no content
  if (!layout || (!body && !tag && !title)) return null;

  // Extract valid client names
  const clientNames = clients
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  // Derive layout class and helper flags
  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasBody = body != null;
  const hasTag = tag != null;
  const hasTitle = title != null;
  const hasClients = clientNames.length > 0;

  return (
    <div className={`wrapper ${layoutClass}`}>
      {/* Challenge Layout: Body with tag below */}
      {layout === 'challenge' && (
        <>
          {hasTag && <div className="tag">{tag}</div>}
          {hasBody && (
            <div className="row text">
              <TextBlock body={body} className="medium" />
            </div>
          )}
        </>
      )}

      {/* Headline Left Layout: Tag + Title row, then body row */}
      {layout === 'headlineLeft' && (
        <>
          <div className="row headline">
            {hasTag && <div className="tag">{tag}</div>}
            {hasTitle && <h2>{title}</h2>}
          </div>
          {hasBody && (
            <div className="row text">
              <TextBlock body={body} className="medium" />
            </div>
          )}
        </>
      )}

      {/* Testimonial Layout: Tag and clients above, body below */}
      {layout === 'testimonial' && (
        <>
          {hasBody && (
            <div className="row text">
              <TextBlock body={body} className="medium" />
            </div>
          )}
          {hasClients && (
            <div className="clients">
              <ClientNames clientNames={clientNames} showTag={false} />
            </div>
          )}
        </>
      )}

      {/* Home Page Layout: Tag, title, and body all in one row */}
      {layout === 'homePage' && (
        <div className="row">
          {hasTag && <div className="tag">{tag}</div>}
          {hasTitle && <h2>{title}</h2>}
          {hasBody && <TextBlock body={body} className="medium" />}
        </div>
      )}
    </div>
  );
}
