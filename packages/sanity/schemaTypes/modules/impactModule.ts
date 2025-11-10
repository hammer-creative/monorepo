// packages/sanity/schemaTypes/modules/impactModule.ts

import {VersionsIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {createSingleImageField} from '../factories/imageFieldFactory'

/**
 * Impact Module
 * Flexible layout supporting:
 * - 3 text blocks (thirds)
 * - 2 text blocks + 1 image (thirds)
 * - 1 text block + 1 image (50/50)
 */
export const impactModule = defineType({
  name: 'impactModule',
  title: 'Impact',
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
      type: 'object',
      fields: [
        createTextField({
          name: 'heading',
          title: 'Heading',
          required: true,
          maxLength: 60,
        }),
        createPortableTextField({
          name: 'description',
          title: 'Description',
          required: true,
          maxLength: 300,
          blocks: [
            {
              type: 'block',
              styles: [{title: 'Blockquote', value: 'blockquote'}],
              lists: [],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{name: 'href', type: 'url', title: 'URL'}],
                  },
                ],
              },
            },
          ],
        }),
      ],
    },
    {
      name: 'textBlock2',
      title: 'Text Block 2',
      type: 'object',
      fields: [
        createTextField({
          name: 'heading',
          title: 'Heading',
          required: true,
          maxLength: 60,
        }),
        createPortableTextField({
          name: 'description',
          title: 'Description',
          required: true,
          maxLength: 300,
          blocks: [
            {
              type: 'block',
              styles: [{title: 'Blockquote', value: 'blockquote'}],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{name: 'href', type: 'url', title: 'URL'}],
                  },
                ],
              },
            },
          ],
        }),
      ],
      hidden: ({parent}) => parent?.layout === 'oneTextOneImage',
    },
    {
      name: 'textBlock3',
      title: 'Text Block 3',
      type: 'object',
      fields: [
        createTextField({
          name: 'heading',
          title: 'Heading',
          required: true,
          maxLength: 60,
        }),
        createPortableTextField({
          name: 'description',
          title: 'Description',
          required: true,
          maxLength: 300,
          blocks: [
            {
              type: 'block',
              styles: [{title: 'Blockquote', value: 'blockquote'}],
              marks: {
                decorators: [
                  {title: 'Bold', value: 'strong'},
                  {title: 'Italic', value: 'em'},
                ],
                annotations: [
                  {
                    name: 'link',
                    type: 'object',
                    title: 'Link',
                    fields: [{name: 'href', type: 'url', title: 'URL'}],
                  },
                ],
              },
            },
          ],
        }),
      ],
      hidden: ({parent}) => parent?.layout !== 'threeText',
    },
    {
      ...createSingleImageField({
        name: 'image',
        title: 'Image',
        required: true,
      }),
      // Hidden unless layout needs image
      hidden: ({parent}) => parent?.layout === 'threeText',
    },
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
      heading: 'textBlock1.heading',
      media: 'image',
    },
    prepare({layout, heading, media}) {
      const layoutLabels = {
        threeText: '3 Text Blocks',
        twoTextOneImage: '2 Text + 1 Image',
        oneTextOneImage: '1 Text + 1 Image (50/50)',
      }

      return {
        title: heading || 'Untitled',
        subtitle: `Impact Module • ${layoutLabels[layout as keyof typeof layoutLabels] || layout}`,
        media,
      }
    },
  },
})
