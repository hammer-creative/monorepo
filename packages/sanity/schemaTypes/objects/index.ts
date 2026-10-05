// packages/sanity/schemaTypes/documents/index.ts

import { imageItem } from './imageItem';
import { seo } from './seo';
import { textBlock } from './textBlock';
import { videoItem } from './videoItem';

export const objectTypes = [seo, imageItem, textBlock, videoItem];
