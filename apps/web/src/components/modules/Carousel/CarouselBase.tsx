// apps/web/src/components/modules/Carousel/CarouselBase.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper } from 'swiper/react';

import 'swiper/css';

interface CarouselBaseProps {
  children: React.ReactNode;
  reverseDirection?: boolean;
  className?: string;
}

export function CarouselBase({
  children,
  reverseDirection = false,
  className = '',
}: CarouselBaseProps) {
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

  return (
    <div ref={containerRef}>
      <Swiper
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        spaceBetween={5}
        speed={5000}
        loop={true}
        freeMode={true}
        autoplay={{
          delay: 0,
          reverseDirection,
        }}
        breakpoints={{
          480: {
            slidesPerView: 2,
          },
          768: {
            slidesPerView: 3,
          },
          1024: {
            slidesPerView: 3,
          },
        }}
        modules={[Autoplay, Pagination]}
        className={`swiper-container ${className}`}
      >
        {children}
      </Swiper>
    </div>
  );
}
