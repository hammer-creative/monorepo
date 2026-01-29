// apps/web/src/components/modules/Impact/ImpactModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImpactImage } from '@/components/common/SanityImage';
import type { ImpactModule as ImpactModuleType } from '@/types/sanity.generated';
import type { PortableTextBlock } from '@portabletext/types';

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

  const { layout } = data;

  // Three text blocks
  if (layout === 'threeText') {
    const blocks = [data.textBlock1, data.textBlock2, data.textBlock3].filter(
      isValidTextBlock,
    );

    if (blocks.length === 0) return null;

    return (
      <div className="wrapper impact-three-text">
        {blocks.map((item, i) => (
          <div key={i} className="row">
            <div className="content">
              {item.title && <h3>{item.title}</h3>}
              {item.body && (
                <div className="text">
                  <PortableTextRenderer
                    value={item.body as PortableTextBlock[]}
                    className="small"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Two text blocks + one image
  if (layout === 'twoTextOneImage') {
    const blocks = [data.textBlock1, data.textBlock2].filter(isValidTextBlock);

    return (
      <div className="wrapper impact-two-text-one-image">
        {blocks.map((item, i) => (
          <div key={i} className="row">
            <div className="content">
              {item.title && <h3>{item.title}</h3>}
              {item.body && (
                <div className="text">
                  <PortableTextRenderer
                    value={item.body as PortableTextBlock[]}
                    className="small"
                  />
                </div>
              )}
            </div>
          </div>
        ))}
        {data.image && (
          <div className="row">
            <div className="image">
              <SanityImpactImage image={data.image} />
            </div>
          </div>
        )}
      </div>
    );
  }

  // One text block + one image
  if (layout === 'oneTextOneImage') {
    return (
      <div className="wrapper impact-one-text-one-image">
        {isValidTextBlock(data.textBlock1) && (
          <div className="row">
            <div className="content">
              {data.textBlock1.title && <h3>{data.textBlock1.title}</h3>}
              {data.textBlock1.body && (
                <div className="text">
                  <PortableTextRenderer
                    value={data.textBlock1.body as PortableTextBlock[]}
                    className="small"
                  />
                </div>
              )}
            </div>
          </div>
        )}
        {data.image && (
          <div className="row">
            <div className="image">
              <SanityImpactImage image={data.image} />
            </div>
          </div>
        )}
      </div>
    );
  }

  return null;
}
