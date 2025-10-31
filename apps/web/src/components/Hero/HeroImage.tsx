// web/src/components/Hero/HeroImage.tsx
import type React from 'react';

interface HeroImageProps {
  src: string;
  alt: string;
}

export const HeroImage: React.FC<HeroImageProps> = ({ src, alt }) => {
  return (
    <div className="hero-image-container">
      <img src={src} alt={alt} className="hero-image" />
      <style jsx>{`
        .hero-image-container {
          width: 100%;
          height: auto;
          overflow: hidden;
        }
        .hero-image {
          width: 100%;
          height: auto;
          object-fit: cover;
        }
      `}</style>
    </div>
  );
};
