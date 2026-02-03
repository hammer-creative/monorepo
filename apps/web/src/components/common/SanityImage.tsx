// components/common/SanityImage.tsx
import type { ImageItem } from '@/types/sanity.generated';
import Image from 'next/image';

type SanityImageType = ImageItem['image'];

interface SanityImageProps {
  image: SanityImageType | null;
  width?: number;
  height?: number;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export function SanityImage({
  image,
  width,
  height,
  fill = false,
  sizes = '100vw',
  priority = false,
  className = '',
  objectFit = 'cover',
  quality = 90, // fallback if quality param is empty
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: SanityImageProps) {
  if (!image?.asset) return null;

  // Extract asset reference for loader
  const assetRef =
    typeof image.asset === 'object' && '_ref' in image.asset
      ? image.asset._ref
      : image.asset;

  const useFill = fill && !width && !height;

  const imageProps = {
    src: assetRef, // Pass reference to custom loader
    alt: image.alt ?? '',
    sizes,
    priority,
    quality, // This gets passed to loader for each srcset variant
    placeholder,
    blurDataURL,
    className,
    onLoad,
    onError,
    ...(useFill ? { fill, style: { objectFit } } : { width, height }),
  };

  if (!useFill && (!width || !height)) return null;

  return <Image {...imageProps} />;
}

// Each component sets its own quality level
export const SanityHeroImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => <SanityImage fill sizes="100vw" priority quality={85} {...props} />;

export const SanityHomePageCardImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => <SanityImage fill quality={80} {...props} />;

export const SanityVideoPosterImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage fill sizes="100vw" quality={90} objectFit="cover" {...props} />
);

export const SanityCarouselImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => <SanityImage fill quality={85} objectFit="cover" {...props} />;

export const SanityImpactImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => <SanityImage fill quality={85} objectFit="cover" {...props} />;

export type { SanityImageType };
