// packages/sanity/schemaTypes/modules/textModule.ts

import {TextIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createTextField, createColorField} from '../factories'

export const textModule = defineType({
  name: 'textModule',
  title: 'Text Module',
  type: 'object',
  icon: TextIcon,
  fields: [
    {
      name: 'layout',
      title: 'Layout',
      type: 'string',
      options: {
        list: [
          {title: 'Headline Left + Copy Right', value: 'headlineLeft'},
          {title: 'Headline Middle', value: 'headlineMiddle'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      ...createTextField({
        name: 'tag',
        title: 'Tag',
        maxLength: 50,
      }),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.layout === 'headlineLeft' && !value) {
            return 'Tag is required for Headline Left layout'
          }
          return true
        }),
      hidden: ({parent}) => !parent?.layout || parent?.layout === 'headlineMiddle',
    },
    {
      ...titleField(),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.layout === 'headlineLeft' && !value) {
            return 'Title is required for Headline Left layout'
          }
          return true
        }),
      hidden: ({parent}) => !parent?.layout || parent?.layout === 'headlineMiddle',
    },
    {
      ...portableTextField(),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (!value) {
            return 'Body is required'
          }
          return true
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
      tag: 'tag',
      layout: 'layout',
      backgroundColor: 'backgroundColor',
    },
    prepare({title, tag, layout, backgroundColor}) {
      const layoutLabels: Record<string, string> = {
        headlineLeft: 'Headline Left + Copy Right',
        headlineMiddle: 'Headline Middle',
      }
      return {
        title: title || 'Text Module',
        subtitle: [
          tag,
          layoutLabels[layout],
          backgroundColor?.enabled ? `Background color: ${backgroundColor.name}` : null,
        ]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
