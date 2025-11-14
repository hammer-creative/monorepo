// apps/web/src/components/common/SanityImage.tsx
import { urlFor } from '@/lib/sanity/image';
import type { ProjectedImage } from '@/types/sanity';
import Image from 'next/image';

interface SanityImageProps {
  image: ProjectedImage;
  width: number;
  height: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function SanityImage({
  image,
  width,
  height,
  sizes = '100vw',
  priority = false,
  className = '',
}: SanityImageProps) {
  if (!image?.asset) return null;

  return (
    <Image
      src={urlFor(image).width(width).height(height).fit('crop').url()}
      alt={image.alt || ''}
      width={width}
      height={height}
      sizes={sizes}
      priority={priority}
      className={className}
      style={{ width: '100%', height: 'auto' }}
    />
  );
}
