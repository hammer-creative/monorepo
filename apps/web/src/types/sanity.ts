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
}

// --------------------
// Common helpers
// --------------------
export type BackgroundColor = {
  enabled: boolean;
  name: string;
  hex?: string;
};

export type ProjectedImage = {
  url: string;
  alt?: string;
  metadata?: {
    dimensions?: {
      width: number;
      height: number;
    };
  };
};

// --------------------
// Module definitions
// --------------------
export type HeroModuleType = {
  _type: ModuleType.Hero;
  _key: string;
  backgroundColor?: BackgroundColor;
  description?: PortableTextBlock[];
  title: string;
  image?: ProjectedImage;
};

export type VideoItem = {
  title: string;
  description?: string;
  video: MuxVideo;
};

export type VideoModuleType = {
  _type: ModuleType.Video;
  _key: string;
  videos: VideoItem[];
};

export type TextModuleType = {
  _type: ModuleType.Text;
  _key: string;
  title?: string;
  tag?: string;
  bodyText?: PortableTextBlock[];
  backgroundColor?: BackgroundColor;
};

export type TextImageModuleType = {
  _type: ModuleType.TextImage;
  _key: string;
  heading?: string;
  bodyText?: PortableTextBlock[];
  image?: ProjectedImage;
  backgroundColor?: BackgroundColor;
};

export type ImpactModuleType = {
  _type: ModuleType.Impact;
  _key: string;
  heading?: string;
  layout?: string;
  image?: ProjectedImage;
  textBlock1?: {
    heading?: string;
    description?: PortableTextBlock[];
  };
  textBlock2?: {
    heading?: string;
    description?: PortableTextBlock[];
  };
};

// --------------------
// Union of all modules
// --------------------
export type Module =
  | HeroModuleType
  | VideoModuleType
  | TextModuleType
  | TextImageModuleType
  | ImpactModuleType;

// ---------------------
// Case study structures
// ---------------------
export type CaseStudy = {
  _id: string;
  title: string;
  slug: string;
  modules: Module[];
};

export type CaseStudyListItem = {
  _id: string;
  title: string;
  slug: string;
};
