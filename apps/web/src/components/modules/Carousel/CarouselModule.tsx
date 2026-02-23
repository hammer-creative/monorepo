// apps/web/src/components/modules/Carousel/CarouselModule.tsx
'use client';

import { SanityImageCarousel } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';
import { SwiperSlide } from 'swiper/react';

import { CarouselBase } from './CarouselBase';

type CarouselImageItem = NonNullable<CarouselModuleType['images']>[number];

function isValidCarouselModule(
  data: CarouselModuleType | null,
): data is CarouselModuleType {
  return data !== null;
}

export function CarouselModule({ data }: { data: CarouselModuleType | null }) {
  if (!isValidCarouselModule(data)) return null;

  const { images } = data;
  if (!images || images.length === 0) return null;

  return (
    <CarouselBase>
      {images.map((item: CarouselImageItem) => (
        <>
          <SwiperSlide key={item._key}>
            <SanityImageCarousel image={item.image ?? null} />
          </SwiperSlide>
        </>
      ))}
    </CarouselBase>
  );
}
