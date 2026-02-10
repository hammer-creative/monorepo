// apps/web/src/components/modules/Text/TextModule.tsx
import { Label, Title } from '@/components/common';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

type Layout = NonNullable<TextModuleType['layout']>;

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  challenge: 'challenge',
  headlineLeft: 'has-headline',
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
    <div className={`content ${layoutClass}`}>
      {layout === 'challenge' && (
        <>
          {hasTag && <Label as="div">{tag}</Label>}
          {hasBody && <TextBlock body={body} variant="dropquote" />}
        </>
      )}

      {layout === 'headlineLeft' && (
        <>
          <div className="header">
            {hasTag && <Label as="div">{tag}</Label>}
            {hasTitle && (
              <Title as="h2" variant="secondary">
                {title}
              </Title>
            )}
          </div>
          <div className="body">
            {hasBody && <TextBlock body={body} variant="has-headline" />}
          </div>
        </>
      )}

      {layout === 'testimonial' && (
        <>
          {hasBody && <TextBlock body={body} variant="dropquote" />}
          {hasAttribution && (
            <Label as="div" variant="centered">
              {attribution}
            </Label>
          )}
          {hasClients && (
            <Label as="div" variant="centered">
              {clientNames}
            </Label>
          )}
        </>
      )}

      {layout === 'homePage' && (
        <>
          {hasTag && <Label as="div">{tag}</Label>}
          {hasTitle && <Title>{title}</Title>}
          {hasBody && <TextBlock body={body} />}
        </>
      )}
    </div>
  );
}
