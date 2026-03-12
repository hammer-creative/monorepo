// apps/web/src/components/common/SanityImage.tsx

// TODO: typechecking error and evaluate sizes for each component

import { urlFor } from '@/lib/sanity/image';
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
  loading?: 'lazy' | 'eager';
  className?: string;
  variant?:
    | 'hero'
    | 'full-width'
    | 'half-width'
    | 'carousel'
    | 'case-study-card'
    | 'teaser'
    | 'video-poster'
    | 'impact';
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
  loading,
  className,
  variant,
  objectFit = 'cover',
  quality = 90,
  placeholder = 'empty',
  blurDataURL,
  onLoad,
  onError,
}: SanityImageProps) {
  if (!image?.asset) return null;

  const src = (() => {
    const base = image.hotspot
      ? urlFor(image).crop('focalpoint')
      : urlFor(image);

    if (width && height) {
      return base.fit('crop').width(width).height(height).url();
    }

    return base.url();
  })();

  const objectPosition =
    image.hotspot?.x != null && image.hotspot?.y != null
      ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
      : 'center';

  const useFill = fill && !width && !height;

  const sharedProps = {
    src,
    alt: image.alt ?? '',
    sizes,
    priority,
    ...(!priority && { loading }),
    quality,
    placeholder,
    blurDataURL,
    onLoad,
    onError,
    style: { objectFit, objectPosition },
  };

  const img = useFill ? (
    <Image {...sharedProps} fill />
  ) : width && height ? (
    <Image {...sharedProps} width={width} height={height} />
  ) : null;

  if (!img) return null;

  const modifier =
    className && variant
      ? `${className}--${variant}`
      : (className ?? (variant ? `image--${variant}` : null));

  const classes = ['image', modifier].filter(Boolean).join(' ');

  return <div className={classes}>{img}</div>;
}

export const SanityImageHero = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="100vw"
    priority
    quality={100}
    variant="hero"
    {...props}
  />
);

export const SanityImageFullWidth = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="100vw"
    quality={85}
    variant="full-width"
    {...props}
  />
);

export const SanityImageTeaser = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    loading="lazy"
    sizes="(max-width: 640px) 100vw, 1280px"
    quality={90}
    variant="teaser"
    {...props}
  />
);

export const SanityImageVideoPoster = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="100vw"
    quality={90}
    objectFit="cover"
    variant="video-poster"
    {...props}
  />
);

export const SanityImageCarousel = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
    quality={85}
    objectFit="cover"
    variant="carousel"
    {...props}
  />
);

export const SanityImageHalfWidth = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="(max-width: 50em) 100vw, 50vw"
    quality={85}
    objectFit="cover"
    variant="half-width"
    {...props}
  />
);

export const SanityImpactImage = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    quality={85}
    objectFit="cover"
    variant="impact"
    {...props}
  />
);

export type { SanityImageType };
