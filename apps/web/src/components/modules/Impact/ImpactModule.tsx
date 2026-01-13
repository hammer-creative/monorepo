// apps/web/src/components/modules/Impact/ImpactModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { ImpactModule as ImpactModuleType } from '@/types/sanity.generated';
import type { PortableTextBlock } from '@portabletext/types';

// Type guard: Check if module data exists and is valid
function isValidImpactModule(
  data: ImpactModuleType | null,
): data is ImpactModuleType {
  return data !== null;
}

// Type guard: Check if a text block has content
function isValidTextBlock(
  block: ImpactModuleType['textBlock1'] | undefined,
): block is NonNullable<ImpactModuleType['textBlock1']> {
  return block !== undefined && (Boolean(block.title) || Boolean(block.body));
}

export function ImpactModule({ data }: { data: ImpactModuleType | null }) {
  // Guard: Early return if no valid data
  if (!isValidImpactModule(data)) return null;

  // Collect all text blocks and filter out empty ones
  const blocks = [data.textBlock1, data.textBlock2, data.textBlock3].filter(
    isValidTextBlock,
  );

  // Guard: Early return if no blocks with content
  if (blocks.length === 0) return null;

  return (
    <div className="wrapper">
      {blocks.map((item, i: number) => (
        <div key={i} className="row">
          <div className="content">
            {/* Block Title */}
            {item.title && <h3>{item.title}</h3>}

            {/* Block Body (Portable Text) */}
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
