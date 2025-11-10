// apps/web/src/components/common/SanityImage.tsx
// apps/web/src/components/common/SanityImage.tsx
import Image from 'next/image';

interface SanityImageProps {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain';
  sizes?: string;
  priority?: boolean;
  className?: string; // ✅ optional class
}

export function SanityImage({
  url,
  alt = '',
  width = 800,
  height = 600,
  fit = 'cover',
  sizes = '(max-width: 768px) 100vw, 50vw',
  priority = false,
  className = '',
}: SanityImageProps) {
  return (
    <div
      className={`sanity-image-wrapper ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        aspectRatio: `${width} / ${height}`,
      }}
    >
      <Image
        src={url}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        style={{ objectFit: fit }}
      />
    </div>
  );
}
