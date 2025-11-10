// apps/web/src/components/modules/TextImage/TextImageModule.ts
// components/modules/TextImageModule.tsx
import { PortableTextRenderer } from '@/components/common/PortableTextRenderer';
import type { TextImageModuleType } from '@/types/sanity';
import Image from 'next/image';

export function TextImageModule({ data }: { data: TextImageModuleType }) {
  const bgColor =
    data.backgroundColor?.enabled && data.backgroundColor?.hex
      ? data.backgroundColor.hex
      : 'transparent';

  const { width, height } = data.image.metadata?.dimensions || {
    width: 800,
    height: 600,
  };

  return (
    <section style={{ backgroundColor: bgColor }}>
      <div>
        <div>
          <div>
            <h2>{data.title}</h2>
            <PortableTextRenderer value={data.bodyText} />
          </div>
          <div>
            <Image
              src={data.image.url}
              alt={data.image.alt}
              width={width}
              height={height}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
