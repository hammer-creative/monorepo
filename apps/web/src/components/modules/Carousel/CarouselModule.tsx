// apps/web/src/components/modules/Carousel/CarouselModule.tsx
import { SanityImage } from '@/components/common/SanityImage';
import type { CarouselModuleType } from '@/types/sanity';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { Navigation, Pagination } from 'swiper/modules';
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
        modules={[Navigation, Pagination]}
        navigation
        pagination={{ clickable: true }}
        spaceBetween={0}
        slidesPerView={1}
      >
        {images.map((item) => (
          <SwiperSlide key={item._key}>
            {item.image && (
              <SanityImage
                image={item.image}
                width={1920}
                height={1080}
                sizes="100vw"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
