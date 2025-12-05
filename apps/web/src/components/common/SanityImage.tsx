// apps/web/src/components/common/SanityImage.tsx
import { urlFor } from '@/lib/sanity/image';
import type { ProjectedImage } from '@/types/sanity';
import Image from 'next/image';

interface SanityImageProps {
  image: ProjectedImage | null;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function SanityImage({
  image,
  width,
  height,
  fill = false,
  sizes = '100vw',
  priority = false,
  className = '',
}: SanityImageProps) {
  if (!image?.asset) return null;

  if (fill) {
    return (
      <Image
        src={urlFor(image).url()}
        alt={image.alt ?? ''}
        fill
        sizes={sizes}
        priority={priority}
        className={className}
        style={{ objectFit: 'cover' }}
      />
    );
  }

  // STRICT: require explicit width + height
  if (!width || !height) return null;

  return (
    <Image
      src={urlFor(image).width(width).height(height).fit('crop').url()}
      alt={image.alt ?? ''}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
