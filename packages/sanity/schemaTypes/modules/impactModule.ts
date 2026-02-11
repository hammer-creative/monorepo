// packages/sanity/schemaTypes/modules/impactModule.ts

import {VersionsIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'
import {applyRequired, requireWhen} from '../utils/validation'

/**
 * Creates a text block field for impact module
 */
const createTextBlock = (blockNumber: number, hideCondition?: (parent: any) => boolean) => {
  return {
    name: `textBlock${blockNumber}`,
    title: `Text Block ${blockNumber}`,
    type: 'object',
    fields: [
      (() => {
        const {validation: _, ...field} = titleField({required: false, rows: 3, maxLength: 150})
        return field
      })(),
      portableTextField({enableColorAnnotations: true, maxLength: 600}),
    ],
    ...(hideCondition && {hidden: ({parent}: any) => hideCondition(parent)}),
  }
}

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
      validation: (Rule) => applyRequired(Rule, true, 'Layout is required'),
    },
    createTextBlock(1),
    createTextBlock(2, (parent) => parent?.layout === 'oneTextOneImage'),
    createTextBlock(3, (parent) => parent?.layout !== 'threeText'),
    {
      ...createSingleImageField({
        name: 'image',
        title: 'Image',
        required: false,
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
        return requireWhen(
          !fields?.textBlock1 || !fields?.textBlock2 || !fields?.textBlock3,
          'All 3 text blocks are required for this layout',
        )
      }

      if (layout === 'twoTextOneImage') {
        return requireWhen(
          !fields?.textBlock1 || !fields?.textBlock2 || !fields?.image,
          '2 text blocks and 1 image are required for this layout',
        )
      }

      if (layout === 'oneTextOneImage') {
        return requireWhen(
          !fields?.textBlock1 || !fields?.image,
          '1 text block and 1 image are required for this layout',
        )
      }

      return true
    }),
  preview: {
    select: {
      layout: 'layout',
    },
    prepare({layout}) {
      const layoutLabels: Record<string, string> = {
        threeText: '3 Text Blocks',
        twoTextOneImage: '2 Text + 1 Image',
        oneTextOneImage: '1 Text + 1 Image',
      }

      return {
        title: 'Impact Module',
        subtitle: layoutLabels[layout as keyof typeof layoutLabels],
      }
    },
  },
})
