// apps/web/src/components/modules/TextImage/TextImageModule.tsx
import { ImageBlock } from '@/components/common/ImageBlock';
import { TextBlock } from '@/components/common/TextBlock';
import type { TextImageModuleType } from '@/types/sanity';

export function TextImageModule({ data }: { data: TextImageModuleType }) {
  return (
    <div className="flex">
      <div className="flex-item">
        <TextBlock body={data.body} className="text small" />
      </div>
      <div className="flex-item">
        <ImageBlock
          image={data.image}
          className="hero-image"
          width={1200}
          height={800}
          priority
        />
      </div>
    </div>
  );
}
