// apps/web/src/components/modules/Carousel/CaseStudyCarousel.tsx
'use client';

import { ClientNames, SanityImageCarousel, Title } from '@/components/common';
import type { CaseStudy } from '@/types/sanity.generated';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import type { Swiper as SwiperType } from 'swiper';
import { Autoplay } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';

interface CaseStudyCarouselData {
  _type: 'caseStudyCarousel';
  caseStudies: any[];
}

interface CaseStudyCarouselProps {
  data: CaseStudyCarouselData | null;
}

function getTeaserImage(caseStudy: any) {
  if (caseStudy.teaserImage) {
    return caseStudy.teaserImage;
  }
  return null;
}

export function CaseStudyCarousel({ data }: CaseStudyCarouselProps) {
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

  if (!data || !data.caseStudies) return null;

  const validCaseStudies = data.caseStudies.filter(
    (cs) => getTeaserImage(cs) !== null,
  );

  if (validCaseStudies.length === 0) return null;

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
          disableOnInteraction: false,
          reverseDirection: true,
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
        className="swiper-container all-case-studies"
      >
        {validCaseStudies.map((caseStudy) => {
          const teaserImage = getTeaserImage(caseStudy);

          const clientNames = Array.isArray(caseStudy.clients)
            ? caseStudy.clients
                .map((c: any) => c?.name)
                .filter((name: any): name is string => typeof name === 'string')
            : [];

          const hasClients = clientNames.length > 0;

          return (
            <SwiperSlide key={caseStudy._id}>
              <Link href={`/work/${caseStudy.slug}`}>
                {teaserImage && <SanityImageCarousel image={teaserImage} />}
                <div className="meta">
                  {hasClients && (
                    <div className="clients">
                      <ClientNames clientNames={clientNames} />
                    </div>
                  )}
                  {caseStudy.title && (
                    <Title as="h3" variant="tertiary">
                      {caseStudy.title}
                    </Title>
                  )}
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </div>
  );
}
