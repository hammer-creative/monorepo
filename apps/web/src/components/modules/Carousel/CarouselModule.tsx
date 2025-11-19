// apps/web/src/components/modules/Carousel/CarouselModule.tsx
import { SanityImage } from '@/components/common/SanityImage';
import type { CarouselModuleType } from '@/types/sanity';
import 'swiper/css';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

interface Props {
  data: CarouselModuleType;
}

export function CarouselModule({ data }: Props) {
  const { images } = data;

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="carousel-module">
      <Swiper
        modules={[Autoplay]}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={images.length >= 6}
        loopAdditionalSlides={3}
        spaceBetween={20}
        slidesPerView={1}
        breakpoints={{
          600: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="h-[680px]"
      >
        {images.map((item) => (
          <SwiperSlide key={item._key} className="h-full">
            {item.image && (
              <SanityImage
                image={item.image}
                width={680}
                height={680}
                sizes="(max-width: 600px) 100vw, 33vw"
                className="h-full w-full object-cover"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
