// apps/web/src/components/modules/Text/TextModule.tsx
import { Label, Title } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

type Layout = NonNullable<TextModuleType['layout']>;

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  challenge: 'challenge',
  headlineLeft: 'headline-left',
  testimonial: 'testimonial',
  homePage: 'home-page',
} as const;

function isValidTextModule(
  data: TextModuleType | null,
): data is TextModuleType {
  return data !== null;
}

export function TextModule({ data }: { data: TextModuleType | null }) {
  if (!isValidTextModule(data)) return null;

  const { title, body, layout, attribution, tag } = data;

  if (!layout || (!body && !attribution && !title)) return null;

  const clientNames = (
    (data.clients ?? []) as unknown as Array<{ _id: string; name?: string }>
  )
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasAttribution = attribution != null;
  const hasBody = body != null;
  const hasTag = tag != null;
  const hasTitle = title != null;
  const hasClients = clientNames.length > 0;

  return (
    <div className={`px-fluid-20-60 ${layoutClass}`}>
      {layout === 'challenge' && (
        <div className="align-center flex flex-col gap-20 justify-center py-fluid-40-120">
          {hasTag && <Label as="div">{tag}</Label>}
          {hasBody && <TextBlock body={body} variant="dropquote" />}
        </div>
      )}

      {layout === 'headlineLeft' && (
        <div className="grid py-fluid-20-60">
          <div className="grid-item mb-20 md:mb-0">
            {hasTag && <Label as="div">{tag}</Label>}
          </div>
          <div className="grid-item mb-20 md:mb-0 self-end">
            {hasTitle && (
              <Title as="h2" variant="secondary">
                {title}
              </Title>
            )}
          </div>
          <div className="grid-item">
            {hasBody && <TextBlock body={body} variant="left-right" />}
          </div>
        </div>
      )}

      {layout === 'testimonial' && (
        <div className="align-center challenge-text flex flex-col gap-30 items-center py-fluid-40-120">
          {hasBody && <TextBlock body={body} variant="dropquote" />}
          {hasAttribution ? (
            <Label variant="centered">{attribution}</Label>
          ) : hasClients ? (
            <Label variant="centered" clients={clientNames} />
          ) : null}
        </div>
      )}

      {layout === 'homePage' && (
        <>
          {hasAttribution && <div className="tag">{tag}</div>}
          {hasTitle && <Title>{title}</Title>}
          {hasBody && <TextBlock body={body} />}
        </>
      )}
    </div>
  );
}
