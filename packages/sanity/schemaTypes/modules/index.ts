// packages/sanity/schemaTypes/modules/index.ts

import { carouselModule } from './carouselModule';
import { caseStudyCardModule } from './caseStudyCardModule';
import { deliverablesModule } from './deliverablesModule';
// Modules (schemas in array)
import { heroModule } from './heroModule';
import { impactModule } from './impactModule';
import { servicesModule } from './servicesModule';
import { servicesPageCardModule } from './servicesPageCardModule';
import { servicesPageHeroModule } from './servicesPageHeroModule';
import { singleImageModule } from './singleImageModule';
import { textImageModule } from './textImageModule';
import { textModule } from './textModule';
import { videoModule } from './videoModule';

export const moduleTypes = [
  heroModule,
  impactModule,
  carouselModule,
  caseStudyCardModule,
  textModule,
  textImageModule,
  singleImageModule,
  servicesPageCardModule,
  servicesPageHeroModule,
  servicesModule,
  deliverablesModule,
  videoModule,
];
