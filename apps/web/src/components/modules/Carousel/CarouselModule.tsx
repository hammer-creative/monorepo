// apps/web/src/components/modules/Carousel/CarouselModule.tsx
'use client';

import { SanityImage } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';

import 'swiper/css';

import { Autoplay, Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Extract image item type from generated schema
type CarouselImageItem = NonNullable<CarouselModuleType['images']>[number];

// Type guard: Check if module data exists and is valid
function isValidCarouselModule(
  data: CarouselModuleType | null,
): data is CarouselModuleType {
  return data !== null;
}

export function CarouselModule({ data }: { data: CarouselModuleType | null }) {
  // Guard: Early return if no valid data
  if (!isValidCarouselModule(data)) return null;

  const { images } = data;

  // Guard: Early return if no images
  if (!images || images.length === 0) return null;

  return (
    <div className="carousel-module">
      <Swiper
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {images.map((item: CarouselImageItem) => (
          <SwiperSlide key={item._key}>
            <SanityImage
              image={item.image ?? null}
              width={100}
              height={100}
              fill
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
