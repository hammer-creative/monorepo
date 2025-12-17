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
  quality = 90,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: SanityImageProps) {
  if (!image?.asset) return null;

  const baseUrl = urlFor(image).url();

  // Check if image is PNG
  const isPng =
    typeof image.asset === 'object' &&
    '_ref' in image.asset &&
    typeof image.asset._ref === 'string' &&
    image.asset._ref.includes('-png');

  // If width and height provided, use them (overrides fill)
  const useFill = fill && !width && !height;

  const imageProps = {
    src: baseUrl,
    alt: image.alt ?? '',
    sizes,
    priority,
    quality,
    placeholder,
    blurDataURL,
    className,
    onLoad,
    onError,
    unoptimized: isPng, // Skip Next.js optimization for PNGs
    ...(useFill ? { fill, style: { objectFit } } : { width, height }),
  };

  // Only error if no dimensions AND not using fill
  if (!useFill && (!width || !height)) return null;

  return <Image {...imageProps} />;
}

// Specific implementations just set defaults
export const SanityHeroImage = (
  props: Partial<SanityImageProps> & { image: ProjectedImage | null },
) => <SanityImage fill sizes="100vw" priority quality={90} {...props} />;

export const SanityHomePageCard = (
  props: Partial<SanityImageProps> & { image: ProjectedImage | null },
) => <SanityImage fill sizes="100vw" quality={80} {...props} />;
