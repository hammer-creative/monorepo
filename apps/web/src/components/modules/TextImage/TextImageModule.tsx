// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import { SanityImage } from '@/components/common/SanityImage';
import type { TextImageModuleType } from '@/types/sanity';

export function TextImageModule({ data }: { data: TextImageModuleType }) {
  // console.log('TextImageModule data:', data);

  return (
    <div className="flow">
      <PortableTextRenderer value={data.body} className="small" />
      {data.image && (
        <SanityImage
          image={data.image}
          width={1200}
          height={800}
          className="hero-image"
          priority
        />
      )}
    </div>
  );
}
