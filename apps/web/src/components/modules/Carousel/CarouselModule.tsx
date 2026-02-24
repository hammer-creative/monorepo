// apps/web/src/components/modules/Carousel/CarouselModule.tsx

// TODO: is this correct?

'use client';

import { SanityImageCarousel } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';
import { SwiperSlide } from 'swiper/react';

import { CarouselBase } from './CarouselBase';

const bem = 'image';

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
    <CarouselBase reverseDirection={false} className={`${bem}__carousel`}>
      {images.map((item: CarouselImageItem) => (
        <>
          <SwiperSlide key={item._key} className={`${bem}__card`}>
            <SanityImageCarousel image={item.image ?? null} />
          </SwiperSlide>
        </>
      ))}
    </CarouselBase>
  );
}
