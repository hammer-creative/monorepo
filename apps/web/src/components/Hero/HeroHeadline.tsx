// web/src/components/Hero/HeroHeadline.tsx
import type React from 'react';

export const HeroHeadline: React.FC<{ data: string }> = ({ data }) => {
  return <h1>{data}</h1>;
};
