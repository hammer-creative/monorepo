// apps/web/src/components/modules/Impact/ImpactModule.tsx
import { Title } from '@/components/common';
import { SanityImpactImage } from '@/components/common/SanityImage';
import { TextBlock } from '@/components/common/TextBlock';
import type { ImpactModule as ImpactModuleType } from '@/types/sanity.generated';

type Layout = NonNullable<ImpactModuleType['layout']>;
type TextBlock = ImpactModuleType['textBlock1'];

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  threeText: 'three-text',
  twoTextOneImage: 'two-text-one-image',
  oneTextOneImage: 'one-text-one-image',
} as const;

function isValidImpactModule(
  data: ImpactModuleType | null,
): data is ImpactModuleType {
  return data !== null && data.layout !== undefined;
}

function isValidTextBlock(
  block: TextBlock | undefined,
): block is NonNullable<TextBlock> {
  return block !== undefined && (Boolean(block.title) || Boolean(block.body));
}

/**
 * ImpactModule renders a flexible content block supporting three layout variants.
 * Layout differences are handled via CSS using the modifier on the wrapper.
 * Child components receive BEM element classes from the parent for layout targeting.
 * All layout variants are driven by LAYOUT_CLASS_MAP and the layoutClass modifier.
 *
 * @param data - ImpactModule data from Sanity
 * @param data.layout - Layout variant key (threeText, twoTextOneImage, oneTextOneImage)
 * @param data.textBlock1 - First text block with optional title and body
 * @param data.textBlock2 - Second text block with optional title and body
 * @param data.textBlock3 - Third text block (threeText layout only)
 * @param data.image - Optional image (twoTextOneImage and oneTextOneImage layouts)
 */
export function ImpactModule({ data }: { data: ImpactModuleType | null }) {
  if (!isValidImpactModule(data)) return null;

  const { layout, textBlock1, textBlock2, textBlock3, image } = data;

  if (!layout) return null;

  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const bemContainer = 'impact-cards';
  const bemWrapper = 'impact-card';

  const textBlocks = [textBlock1, textBlock2, textBlock3].filter(
    isValidTextBlock,
  );
  const hasImage = image?.asset != null && layout !== 'threeText';

  return (
    <div className={`${bemContainer} ${bemContainer}--${layoutClass}`}>
      {textBlocks.map((block, i) => (
        <div
          key={i}
          className={`${bemWrapper}__item ${bemWrapper}__item--text`}
        >
          {block.title && (
            <Title
              as="h3"
              variant="tertiary"
              className={`${bemWrapper}__title`}
            >
              {block.title}
            </Title>
          )}
          {block.body && (
            <TextBlock body={block.body} className={`${bemWrapper}__text`} />
          )}
        </div>
      ))}
      {hasImage && (
        <SanityImpactImage
          image={image}
          className={`${bemWrapper}__item ${bemWrapper}__item--image ${bemWrapper}__image`}
        />
      )}
    </div>
  );
}
