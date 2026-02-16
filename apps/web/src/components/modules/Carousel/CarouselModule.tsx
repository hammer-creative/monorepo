// apps/web/src/components/modules/Carousel/CarouselModule.tsx
'use client';

import { SanityImageCarousel } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';
import { useEffect, useRef, useState } from 'react';

import 'swiper/css';

import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

type CarouselImageItem = NonNullable<CarouselModuleType['images']>[number];

function isValidCarouselModule(
  data: CarouselModuleType | null,
): data is CarouselModuleType {
  return data !== null;
}

export function CarouselModule({ data }: { data: CarouselModuleType | null }) {
  const swiperRef = useRef<SwiperType | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!hasEnteredViewport && swiperRef.current) {
              setHasEnteredViewport(true);
              swiperRef.current.autoplay.start();
            } else if (swiperRef.current) {
              swiperRef.current.autoplay.start();
            }
          } else {
            swiperRef.current?.autoplay.stop();
          }
        });
      },
      { threshold: 0.1 },
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [hasEnteredViewport]);

  if (!isValidCarouselModule(data)) return null;

  const { images } = data;
  if (!images || images.length === 0) return null;

  return (
    <div
      style={{ paddingLeft: '20px', paddingRight: '20px' }}
      ref={containerRef}
    >
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={20}
        speed={5000}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 0,
        }}
        breakpoints={{
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 4,
          },
        }}
        modules={[Autoplay]}
        className="swiper-container images"
      >
        {images.map((item: CarouselImageItem) => (
          <SwiperSlide key={item._key}>
            <SanityImageCarousel image={item.image ?? null} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
