// apps/web/src/components/modules/Carousel/CarouselModule.tsx

'use client';

import { SanityImage } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';
import 'swiper/css';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// apps/web/src/components/modules/Carousel/CarouselModule.tsx

export function CarouselModule({ data }: { data: CarouselModuleType | null }) {
  if (!data) return null;

  const { images } = data;

  if (!images || images.length === 0) {
    return null;
  }

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
        className="swiper-container"
      >
        {images.map(
          (item: NonNullable<CarouselModuleType['images']>[number]) => (
            <SwiperSlide key={item._key}>
              <SanityImage
                image={item.image ?? null}
                width={100}
                height={100}
                fill
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
    </div>
  );
}
