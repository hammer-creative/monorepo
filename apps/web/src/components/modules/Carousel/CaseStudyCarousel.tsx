// apps/web/src/components/modules/Carousel/CaseStudyCarousel.tsx
'use client';

import { SanityImageCarousel, Title } from '@/components/common';
import type { CaseStudyTeaserItem } from '@/types/caseStudy';
import Link from 'next/link';
import { SwiperSlide } from 'swiper/react';

import { CarouselBase } from './CarouselBase';

const bem = 'case-study';

/**
 * Props for `CaseStudyCarousel`.
 */
interface CaseStudyCarouselProps {
  data: {
    _type: 'caseStudyCarousel';
    caseStudies: CaseStudyTeaserItem[];
  } | null;
}

/**
 * Renders a horizontally scrolling carousel of case study cards using Swiper.
 * Each slide links to the case study detail page.
 */
export function CaseStudyCarousel({ data }: CaseStudyCarouselProps) {
  if (!data?.caseStudies?.length) return null;

  return (
    <CarouselBase reverseDirection={true} className={`${bem}__carousel`}>
      {data.caseStudies.map((caseStudy) => {
        const { teaserImage, title, slug, _id } = caseStudy;

        if (!teaserImage) return null;

        return (
          <SwiperSlide key={_id} className={`${bem}__card`}>
            <Link href={`/work/${slug ?? ''}`}>
              <SanityImageCarousel image={teaserImage} />
              <div className={`${bem}__details`}>
                {title && (
                  <Title as="h3" className={`${bem}__title`}>
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
