// apps/web/src/components/modules/Text/TextModule.tsx
import { Label, TextBlock, Title } from '@/components/common';
import type { TextModule as TextModuleType } from '@/types/sanity.generated';

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

/**
 * TextModule renders a content block with a layout-driven modifier class.
 * Layout differences are handled via CSS using the modifier on the wrapper.
 * Child components receive BEM element classes from the parent for layout targeting.
 * All layout variants are driven by LAYOUT_CLASS_MAP and the layoutClass modifier.
 *
 * @param data - TextModule data from Sanity
 * @param data.title - Optional title text
 * @param data.body - Optional body content as PortableText
 * @param data.layout - Layout variant key (challenge, headlineLeft, testimonial, homePage)
 * @param data.attribution - Optional attribution text for testimonial layout
 * @param data.tag - Optional tag/label text
 * @param data.clients - Optional array of client objects to render via Label
 */
export function TextModule({ data }: { data: TextModuleType | null }) {
  if (!isValidTextModule(data)) return null;

  const { title, body, layout, attribution, tag, clients } = data;

  if (!layout || (!body && !attribution && !title)) return null;

  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const bem = 'text-card';
  const hasAttribution = attribution != null;
  const hasBody = body != null;
  const hasTag = tag != null;
  const hasTitle = title != null && layout !== 'challenge'; // TODO: temporary workaround, title field should not be populated for challenge layout in Sanity
  const hasClients = clients != null;

  return (
    <div className={`${bem} ${bem}--${layoutClass}`}>
      {(hasTag || hasTitle) && (
        <div className={`${bem}__headline`}>
          {hasTag && (
            <Label as="div" className={`${bem}__label`}>
              {tag}
            </Label>
          )}
          {hasTitle && <Title className={`${bem}__title`}>{title}</Title>}
        </div>
      )}
      {hasBody && <TextBlock body={body} className={`${bem}__text`} />}
      {hasAttribution && (
        <Label as="div" className={`${bem}__attribution`}>
          {attribution}
        </Label>
      )}
      {hasClients && (
        <Label
          as="div"
          clients={clients as unknown as Array<{ _id: string; name?: string }>}
          className={`${bem}__clients`}
        />
      )}
    </div>
  );
}
