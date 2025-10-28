// web/src/components/Hero/HeroHeadline.tsx
import React from 'react';

export const HeroHeadline: React.FC<{ data: string }> = ({ data }) => {
  return <h1 className="hero-headline">{data}</h1>;
};
