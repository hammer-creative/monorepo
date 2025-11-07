// apps/web/src/types/sanity.ts

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
  TextImage = 'textImageModule',
  Impact = 'impactModule',
}

// --------------------
// Common helpers
// --------------------
export type BackgroundColor = {
  color: string;
  enabled: boolean;
};

// --------------------
// Module definitions
// --------------------
export type HeroModuleType = {
  _type: ModuleType.Hero;
  _key: string;
  heading: string;
  backgroundColor?: BackgroundColor;
  description?: Array<{ _type: string; children?: any[] }>;
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

export type TextImageModuleType = {
  _type: ModuleType.TextImage;
  _key: string;
  heading?: string;
  bodyText?: Array<{ _type: string; children?: any[] }>;
  image?: {
    _type: 'image';
    alt?: string;
    asset?: { _ref?: string; _type?: string };
  };
  backgroundColor?: BackgroundColor;
};

export type ImpactModuleType = {
  _type: ModuleType.Impact;
  _key: string;
  heading?: string;
  layout?: string;
  image?: {
    _type: 'image';
    alt?: string;
    asset?: { _ref?: string; _type?: string };
  };
  textBlock1?: {
    heading?: string;
    description?: Array<{ _type: string; children?: any[] }>;
  };
  textBlock2?: {
    heading?: string;
    description?: Array<{ _type: string; children?: any[] }>;
  };
};

// --------------------
// Union of all modules
// --------------------
export type Module =
  | HeroModuleType
  | VideoModuleType
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
