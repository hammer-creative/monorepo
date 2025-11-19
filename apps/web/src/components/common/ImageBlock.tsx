// apps/web/src/components/common/ImageBlock.tsx
import { SanityImage } from './SanityImage';

interface Props {
  image: any;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function ImageBlock({
  image,
  className,
  width = 1200,
  height = 800,
  priority,
}: Props) {
  if (!image) return null;

  return (
    <SanityImage
      image={image}
      className={className}
      width={width}
      height={height}
      priority={priority}
    />
  );
}
