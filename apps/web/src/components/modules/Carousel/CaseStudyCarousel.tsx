// apps/web/src/components/modules/Carousel/CaseStudyCarousel.tsx
'use client';

import { SanityImageCarousel, Title } from '@/components/common';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
import Link from 'next/link';
import { SwiperSlide } from 'swiper/react';

import { CarouselBase } from './CarouselBase';

interface CaseStudyCarouselProps {
  data: {
    _type: 'caseStudyCarousel';
    caseStudies: CaseStudyTeaserItem[];
  } | null;
}

export function CaseStudyCarousel({ data }: CaseStudyCarouselProps) {
  if (!data?.caseStudies || data.caseStudies.length === 0) return null;

  return (
    <CarouselBase reverseDirection={true} className="case-study-carousel">
      {data.caseStudies.map((caseStudy) => {
        const { teaserImage, title, slug, _id } = caseStudy;

        if (!teaserImage) return null;

        return (
          <SwiperSlide key={_id} className="case-study-card">
            <Link href={`/work/${slug ?? ''}`}>
              <SanityImageCarousel image={teaserImage} />
              <div className="meta">
                {title && (
                  <Title as="h3" variant="tertiary">
                    {title}
                  </Title>
                )}
              </div>
            </Link>
          </SwiperSlide>
        );
      })}
    </CarouselBase>
  );
}
