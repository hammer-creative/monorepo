// apps/web/src/components/modules/Text/TextModule.tsx
import { Label, TextBlock, Title } from '@/components/common';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

const bem = 'text-card';

type Layout = NonNullable<TextModuleType['layout']>;

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  challenge: 'challenge',
  headlineLeft: 'has-headline',
  testimonial: 'testimonial',
  homePage: 'home',
} as const;

function isValidTextModule(
  data: TextModuleType | null,
): data is TextModuleType {
  return data !== null;
}

export function TextModule({ data }: { data: TextModuleType | null }) {
  if (!isValidTextModule(data)) return null;

  // const { title, body, layout, attribution, tag, clients } = data;

  const { title, body, layout, attribution, tag } = data;

  if (!layout || (layout !== 'challenge' && !body && !attribution && !title))
    return null;

  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasAttribution = attribution != null;
  const hasBody = body != null;
  const hasTag = tag != null;
  const hasTitle = title != null;
  // const hasClients = clients != null;

  return (
    <div className={`${bem} ${bem}--${layoutClass}`}>
      {(hasTag || hasTitle) && layout !== 'challenge' && (
        <div className={`${bem}__headline`}>
          {hasTag && <Label className="small-caps">{tag}</Label>}
          {hasTitle && <Title className={`${bem}__title`}>{title}</Title>}
        </div>
      )}
      {layout === 'challenge' && (
        <Label className="centered small-caps">Challenge</Label>
      )}
      {hasBody && <TextBlock body={body} className={`${bem}__text`} />}
      {hasAttribution && <Label className={`${bem}`}>{attribution}</Label>}
      {/* {hasClients && <Label clients={clients} className={`${bem}__clients`} />} */}
    </div>
  );
}
