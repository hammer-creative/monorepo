// apps/web/src/types/sanity.ts
import type { PortableTextBlock } from '@portabletext/types';

// --------------------
// Base video type
// --------------------
export type MuxVideo = {
  playbackId: string;
  aspectRatio: string;
  thumbTime?: number;
};

// --------------------
// Enum for module types
// --------------------
export enum ModuleType {
  CaseStudyCard = 'caseStudyCardModule',
  Hero = 'heroModule',
  ServicesPageHero = 'servicesPageHeroModule',
  ServicesPageCard = 'servicesPageCardModule',
  Video = 'videoModule',
  Text = 'textModule',
  TextImage = 'textImageModule',
  Impact = 'impactModule',
  SingleImage = 'singleImageModule',
  MultiImage = 'multiImageModule',
  Carousel = 'carouselModule',
  Services = 'servicesModule',
  Deliverables = 'deliverablesModule',
}

// --------------------
// Common helpers
// --------------------
export type ColorValue = {
  enabled: boolean;
  name: string;
  hex?: string;
};

export type ProjectedImage = {
  asset?: {
    _ref: string;
    _type: string;
  };
  alt?: string;
  crop?: {
    _type: 'sanity.imageCrop';
    bottom: number;
    left: number;
    right: number;
    top: number;
  };
  hotspot?: {
    _type: 'sanity.imageHotspot';
    height: number;
    width: number;
    x: number;
    y: number;
  };
};

export type ClientReference = {
  _id: string;
  name: string;
  slug?: {
    current: string;
  };
};

export type ServiceReference = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  description?: string;
};

export type DeliverableReference = {
  _id: string;
  title: string;
  slug?: {
    current: string;
  };
  description?: string;
};

// --------------------
// Module definitions
// --------------------

export interface HeroModuleType {
  _type: ModuleType.Hero;
  _key: string;
  clients: ClientReference;
  title: string;
  body?: PortableTextBlock[];
  image: ProjectedImage;
  services?: ServiceReference[];
  deliverables?: DeliverableReference[];
  backgroundColor: ColorValue;
  textColor: ColorValue;
}

export interface ServicesPageHeroModuleType {
  _type: ModuleType.ServicesPageHero;
  _key: string;
  title: string;
  body?: PortableTextBlock[];
  image: ProjectedImage;
  backgroundColor: ColorValue;
  textColor: ColorValue;
}

export interface ServicesPageCardModuleType {
  _type: ModuleType.ServicesPageCard;
  _key: string;
  title: string;
  body?: PortableTextBlock[];
  image: ProjectedImage;
  services?: ServiceReference[];
  backgroundColor: ColorValue;
  textColor: ColorValue;
}

export type VideoItem = {
  _key: string;
  _type: 'videoItemFullWidth' | 'videoItem50' | 'videoItem33';
  title: string;
  video: MuxVideo;
  poster?: ProjectedImage;
};

export type VideoModuleType = {
  _type: ModuleType.Video;
  _key: string;
  videos: VideoItem[];
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
};

export type TextModuleType = {
  _type: ModuleType.Text;
  _key: string;
  tag?: string;
  title?: string;
  body?: PortableTextBlock[];
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  layout?: string;
  data: TextModuleType;
  client?: string;
};

export type TextImageModuleType = {
  _type: ModuleType.TextImage;
  _key: string;
  title?: string;
  body?: PortableTextBlock[];
  image?: ProjectedImage;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  layout?: string;
};

export type TextBlock = {
  title?: string;
  body?: PortableTextBlock[];
};

export type ImpactModuleType = {
  _type: ModuleType.Impact;
  _key: string;
  layout?: 'threeText' | 'twoTextOneImage' | 'oneTextOneImage';
  textBlock1?: TextBlock;
  textBlock2?: TextBlock;
  textBlock3?: TextBlock;
  image?: ProjectedImage;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
};

export type ImpactTextBlocks = (TextBlock | undefined)[];

export type SingleImageModuleType = {
  _type: ModuleType.SingleImage;
  _key: string;
  title?: string;
  image?: ProjectedImage;
  body?: PortableTextBlock[];
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
};

export type MultiImageModuleType = {
  _type: ModuleType.MultiImage;
  _key: string;
  images?: ProjectedImage[];
  backgroundColor?: ColorValue;
};

export type ImageItem = {
  _key: string;
  _type: 'imageItem';
  image?: ProjectedImage;
};

export type CarouselModuleType = {
  _type: ModuleType.Carousel;
  _key: string;
  images?: ImageItem[];
  backgroundColor?: ColorValue;
};

export type ServicesModuleType = {
  _type: ModuleType.Services;
  _key: string;
  services?: ServiceReference[];
  backgroundColor?: ColorValue;
};

export type DeliverablesModuleType = {
  _type: ModuleType.Deliverables;
  _key: string;
  deliverables?: DeliverableReference[];
  backgroundColor?: ColorValue;
};

// --------------------
// Union of all modules
// --------------------
export type Module =
  | CaseStudyCardModuleType
  | HeroModuleType
  | ServicesPageHeroModuleType
  | ServicesPageCardModuleType
  | VideoModuleType
  | TextModuleType
  | TextImageModuleType
  | ImpactModuleType
  | SingleImageModuleType
  | MultiImageModuleType
  | CarouselModuleType
  | ServicesModuleType
  | DeliverablesModuleType;

// ---------------------
// Case study structures
// ---------------------
export type CaseStudy = {
  _id: string;
  title: string;
  slug: string;
  services?: ServiceReference[];
  deliverables?: DeliverableReference[];
  modules: Module[];
};

export type CaseStudyListItem = {
  _id: string;
  title: string;
  slug: string;
};

// ---------------------
// Services page structure
// ---------------------
export type ServicesPageType = {
  _id: string;
  title: string;
  slug: string;
  modules: Module[];
};

// ---------------------
// Services page structure
// ---------------------
export type HomePageType = {
  _id: string;
  title: string;
  slug: string;
  modules: Module[];
};

// FIX CaseStudyCardModuleType.modules (OBJECT, NOT ARRAY)
export type CaseStudyCardModuleType = {
  _type: ModuleType.CaseStudyCard;
  _key: string;
  caseStudies?: {
    _id: string;
    title: string;
    slug: string;
    modules: {
      client: ClientReference;
      title: string;
      image: ProjectedImage;
    };
  }[];
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
};
