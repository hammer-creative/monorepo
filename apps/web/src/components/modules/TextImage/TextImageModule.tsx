// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImage } from '@/components/common/SanityImage';
import type { TextImageModuleType } from '@/types/sanity';

export function TextImageModule({ data }: { data: TextImageModuleType }) {
  const image = data.image;
  const width = image?.metadata?.dimensions?.width ?? 800;
  const height = image?.metadata?.dimensions?.height ?? 600;

  console.log('TextImageModule data:', data);

  return (
    <div className="flow">
      <PortableTextRenderer value={data.bodyText} className="small" />
      {image?.url && (
        <SanityImage
          url={image.url}
          alt={image.alt || ''}
          width={width}
          height={height}
        />
      )}
    </div>
  );
}
