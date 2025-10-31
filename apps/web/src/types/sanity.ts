// apps/web/src/types/sanity.ts

export type HeroModule = {
  _type: 'heroModule';
  _key: string;
  heading: string;
};

export type Module = HeroModule;

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
