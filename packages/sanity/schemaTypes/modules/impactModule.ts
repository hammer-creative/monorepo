// packages/sanity/schemaTypes/modules/impactModule.ts

import {VersionsIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createSingleImageField, createColorField} from '../factories'

/**
 * Impact Module
 *
 * Flexible layout supporting:
 * - 3 text blocks (thirds)
 * - 2 text blocks + 1 image (thirds)
 * - 1 text block + 1 image (50/50)
 */
export const impactModule = defineType({
  name: 'impactModule',
  title: 'Impact Module',
  type: 'object',
  icon: VersionsIcon,
  fields: [
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: '3 Text Blocks', value: 'threeText'},
          {title: '2 Text Blocks + 1 Image', value: 'twoTextOneImage'},
          {title: '1 Text Block + 1 Image', value: 'oneTextOneImage'},
        ],
        layout: 'radio',
      },
      initialValue: 'threeText',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'textBlock1',
      title: 'Text Block 1',
      type: 'textBlock',
    },
    {
      name: 'textBlock2',
      title: 'Text Block 2',
      type: 'textBlock',
      hidden: ({parent}: any) => parent?.layout === 'oneTextOneImage',
    },
    {
      name: 'textBlock3',
      title: 'Text Block 3',
      type: 'textBlock',
      hidden: ({parent}: any) => parent?.layout !== 'threeText',
    },
    {
      ...createSingleImageField({
        name: 'image',
        title: 'Image',
        required: true,
      }),
      hidden: ({parent}: any) => parent?.layout === 'threeText',
    },
    createColorField({
      name: 'backgroundColor',
      title: 'Background Color',
      required: true,
    }),
    createColorField({
      name: 'textColor',
      title: 'Text Color',
      required: true,
      initialValue: {
        enabled: true,
        name: 'nightshade',
      },
    }),
  ],
  validation: (Rule) =>
    Rule.custom((fields: any) => {
      const layout = fields?.layout

      if (layout === 'threeText') {
        if (!fields?.textBlock1 || !fields?.textBlock2 || !fields?.textBlock3) {
          return 'All 3 text blocks are required for this layout'
        }
      }

      if (layout === 'twoTextOneImage') {
        if (!fields?.textBlock1 || !fields?.textBlock2 || !fields?.image) {
          return '2 text blocks and 1 image are required for this layout'
        }
      }

      if (layout === 'oneTextOneImage') {
        if (!fields?.textBlock1 || !fields?.image) {
          return '1 text block and 1 image are required for this layout'
        }
      }

      return true
    }),
  preview: {
    select: {
      layout: 'layout',
      title: 'textBlock1.title',
      media: 'image',
      backgroundColor: 'backgroundColor',
    },
    prepare({layout, title, media, backgroundColor}) {
      const layoutLabels = {
        threeText: '3 Text Blocks',
        twoTextOneImage: '2 Text + 1 Image',
        oneTextOneImage: '1 Text + 1 Image',
      }

      return {
        title: title || 'Impact Module',
        subtitle: [
          layoutLabels[layout as keyof typeof layoutLabels],
          backgroundColor?.enabled ? backgroundColor.name : undefined,
        ]
          .filter(Boolean)
          .join(' • '),
        media,
      }
    },
  },
})
