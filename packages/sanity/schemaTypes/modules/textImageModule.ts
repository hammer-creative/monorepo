// packages/sanity/schemaTypes/modules/textImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
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
      ...titleField(),
      hidden: ({parent}) => !parent?.layout,
    },
    {
      ...portableTextField(),
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
      title: 'title',
      layout: 'layout',
      media: 'image',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, layout, media, backgroundColor}) {
      const layoutLabels: Record<string, string> = {
        textRight: 'Text Right + Image Left',
        textLeft: 'Text Left + Image Right',
      }
      return {
        title: title || 'Text + Image Module',
        subtitle: [
          layoutLabels[layout],
          backgroundColor?.enabled ? `Background color: ${backgroundColor.name}` : null,
        ]
          .filter(Boolean)
          .join(' • '),
        media,
      }
    },
  },
})
