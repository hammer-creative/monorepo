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
  className?: string;
  variant?:
    | 'hero'
    | 'full-width'
    | 'half-width'
    | 'carousel'
    | 'case-study-card'
    | 'video-poster'
    | 'impact';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * SanityImage renders a Next.js Image component with Sanity image data.
 * Handles hotspot/focal point cropping, fill vs fixed dimensions, and BEM class output.
 * Variant classes are composed with className for BEM element targeting from parent modules.
 *
 * @param image - Sanity image object with optional hotspot data
 * @param width - Fixed width (use with height for fixed dimensions)
 * @param height - Fixed height (use with width for fixed dimensions)
 * @param fill - Fill parent container (default: false)
 * @param sizes - Responsive sizes attribute for the img element
 * @param priority - Preload the image (default: false)
 * @param className - BEM element class from parent (e.g. text-image-card__image)
 * @param variant - Style variant drives the BEM modifier class
 * @param objectFit - CSS object-fit value (default: cover)
 * @param quality - Image quality 1-100 (default: 90)
 * @param placeholder - Placeholder style while loading (default: empty)
 * @param blurDataURL - Base64 blur placeholder image
 * @param onLoad - Callback when image loads
 * @param onError - Callback when image errors
 */
export function SanityImage({
  image,
  width,
  height,
  fill = false,
  sizes = '100vw',
  priority = false,
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

  const src = image.hotspot
    ? urlFor(image).fit('crop').crop('focalpoint').url()
    : urlFor(image).fit('crop').url();

  const objectPosition = image.hotspot
    ? `${image.hotspot.x * 100}% ${image.hotspot.y * 100}%`
    : 'center';

  const useFill = fill && !width && !height;

  const sharedProps = {
    src,
    alt: image.alt ?? '',
    sizes,
    priority,
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

/**
 * Hero image — full viewport width, high priority, maximum quality.
 */
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

/**
 * Full width image — spans full viewport width.
 */
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

/**
 * Home page card image.
 */
export const SanityImageCaseStudyCard = (
  props: Partial<SanityImageProps> & { image: SanityImageType | null },
) => (
  <SanityImage
    fill
    sizes="(max-width: 640px) 100vw, 1280px"
    quality={90}
    variant="case-study-card"
    {...props}
  />
);

/**
 * Video poster image — used as a cover image behind video players.
 */
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

/**
 * Carousel image — responsive sizes optimized for multi-item carousels.
 */
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

/**
 * Half width image — 100vw on mobile, 50vw on wider viewports.
 */
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

/**
 * Impact image — large format editorial image.
 */
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
