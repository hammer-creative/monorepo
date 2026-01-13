// apps/web/src/components/modules/Carousel/CarouselModule.tsx
'use client';

import { SanityCarouselImage } from '@/components/common/SanityImage';
import type { CarouselModule as CarouselModuleType } from '@/types/sanity.generated';
import { useEffect, useRef, useState } from 'react';

import 'swiper/css';

import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
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
              const swiper = swiperRef.current;

              swiper.params.autoplay = {
                delay: 500,
                disableOnInteraction: false,
              };
              swiper.autoplay.start();

              const delays = [500, 700, 1000, 1500, 2000, 2500];
              delays.forEach((delay, index) => {
                setTimeout(() => {
                  if (
                    swiper.params.autoplay &&
                    typeof swiper.params.autoplay !== 'boolean'
                  ) {
                    swiper.params.autoplay.delay = delay;
                  }
                }, index * delay);
              });
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
        spaceBetween={20} // Add this
        loop={true}
        autoplay={{
          disableOnInteraction: false,
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
        modules={[Autoplay, Pagination]}
        className="swiper-container"
      >
        {images.map((item: CarouselImageItem) => (
          <SwiperSlide key={item._key}>
            <SanityCarouselImage image={item.image ?? null} />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
