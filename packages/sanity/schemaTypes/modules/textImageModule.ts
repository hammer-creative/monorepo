// packages/sanity/schemaTypes/modules/textImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'

export const textImageModule = defineType({
  name: 'textImageModule',
  title: 'Text + Image Module',
  type: 'object',
  icon: ImageIcon,
  fields: [
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Text Right + Image Left', value: 'textRight'},
          {title: 'Text Left + Image Right', value: 'textLeft'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      ...portableTextField({enableColorAnnotations: true}),
      validation: (Rule) => Rule.required(),
      hidden: ({parent}) => !parent?.layout,
    },
    {
      ...createSingleImageField({
        name: 'image',
        title: 'Hero Image',
        required: true,
        minWidth: 1960,
        minHeight: 1400,
        maxFileSize: 3,
        description: 'Minimum dimensions 1960 px × 1400 px, maximum filze size 3 MB.',
        imageOptions: {
          hotspot: {
            previews: [{title: '14:10 Rectangle', aspectRatio: 14 / 10}],
          },
        },
      }),
      hidden: ({parent}) => !parent?.layout,
    },
    {
      ...createColorField({
        name: 'backgroundColor',
        title: 'Background Color',
        required: true,
      }),
      hidden: ({parent}) => !parent?.layout,
    },
    {
      ...createColorField({
        name: 'textColor',
        title: 'Text Color',
        required: true,
        initialValue: {
          enabled: true,
          name: 'nightshade',
        },
      }),
      hidden: ({parent}) => !parent?.layout,
    },
  ],
  preview: {
    select: {
      body: 'body',
      title: 'title',
      layout: 'layout',
    },
    prepare({layout, body}) {
      const layoutLabels: Record<string, string> = {
        textRight: 'Text Right + Image Left',
        textLeft: 'Text Left + Image Right',
      }
      // Extract text from portable text body
      const bodyText = body
        ?.map((block: any) =>
          block._type === 'block' && block.children
            ? block.children.map((child: any) => child.text).join('')
            : '',
        )
        .join(' ')

      const words = bodyText?.split(/\s+/).filter(Boolean).slice(0, 10).join(' ')

      return {
        title: ['Text + Image', layoutLabels[layout]].filter(Boolean).join(' · ') || 'Text + Image',
        subtitle: words ? `${words}...` : layoutLabels[layout] || 'Text + Image Module',
      }
    },
  },
})
