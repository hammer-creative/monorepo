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
  Hero = 'heroModule',
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

// apps/web/src/types/sanity.ts
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
  slug: {
    current: string;
  };
};

// --------------------
// Module definitions
// --------------------
export type HeroModuleType = {
  _type: ModuleType.Hero;
  _key: string;
  title: string;
  body?: PortableTextBlock[];
  image?: ProjectedImage;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
  client?: ClientReference;
};

export type VideoItem = {
  _key: string;
  _type: 'videoItem';
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
};

export type TextImageModuleType = {
  _type: ModuleType.TextImage;
  _key: string;
  title?: string;
  body?: PortableTextBlock[];
  image?: ProjectedImage;
  backgroundColor?: ColorValue;
  textColor?: ColorValue;
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

export type ServiceReference = {
  _id: string;
  name: string;
};

export type DeliverableReference = {
  _id: string;
  name: string;
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
  | HeroModuleType
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
