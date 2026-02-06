// apps/web/src/components/modules/Impact/ImpactModule.tsx
import { Title } from '@/components/common';
import { SanityImpactImage } from '@/components/common/SanityImage';
import { TextBlock } from '@/components/common/TextBlock';
import type { ImpactModule as ImpactModuleType } from '@/types/sanity.generated';

type Layout = NonNullable<ImpactModuleType['layout']>;

const LAYOUT_CLASS_MAP: Record<Layout, string> = {
  threeText: 'three-texts',
  twoTextOneImage: 'two-texts',
  oneTextOneImage: 'one-text',
} as const;

function isValidImpactModule(
  data: ImpactModuleType | null,
): data is ImpactModuleType {
  return data !== null && data.layout !== undefined;
}

function isValidTextBlock(
  block: ImpactModuleType['textBlock1'] | undefined,
): block is NonNullable<ImpactModuleType['textBlock1']> {
  return block !== undefined && (Boolean(block.title) || Boolean(block.body));
}

export function ImpactModule({ data }: { data: ImpactModuleType | null }) {
  if (!isValidImpactModule(data)) return null;

  const { layout, textBlock1, textBlock2, textBlock3, image } = data;

  if (!layout) return null;

  const layoutClass = LAYOUT_CLASS_MAP[layout] ?? '';
  const hasTextBlock1 = isValidTextBlock(textBlock1);
  const hasTextBlock2 = isValidTextBlock(textBlock2);
  const hasTextBlock3 = isValidTextBlock(textBlock3);
  const hasImage = image != null;

  return (
    <div className={`${layoutClass} flex flex-col md:flex-row`}>
      {[
        { block: textBlock1, has: hasTextBlock1 },
        { block: textBlock2, has: hasTextBlock2 },
        { block: textBlock3, has: hasTextBlock3 },
      ]
        .filter(({ has, block }) => has && block !== undefined)
        .map(({ block }, i) => (
          <div key={i} className="flex-item flex-1">
            <div className="wrapper px-fluid-20-40 py-fluid-20-40">
              {block!.title && (
                <Title as="h3" variant="tertiary">
                  {block!.title}
                </Title>
              )}
              {block!.body && <TextBlock body={block!.body} />}
            </div>
          </div>
        ))}
      {(layout === 'twoTextOneImage' || layout === 'oneTextOneImage') &&
        hasImage && (
          <div className="image">
            <SanityImpactImage image={image} />
          </div>
        )}
    </div>
  );
}
