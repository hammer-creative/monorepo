// packages/sanity/schemaTypes/modules/textModule.ts

import {TextIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createTextField, createColorField, createClientField} from '../factories'

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
          {title: 'Homepage', value: 'homePage'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    },
    createClientField({
      name: 'client',
      title: 'Client',
      required: false,
      hidden: ({parent}: any) => !parent?.layout || parent?.layout !== 'headlineMiddle',
    }),
    {
      ...createTextField({
        name: 'tag',
        title: 'Tag',
        maxLength: 50,
      }),
      hidden: ({parent}) => !parent?.layout || parent?.layout === 'headlineMiddle',
    },
    {
      ...titleField({required: false}),
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
      ...portableTextField({enableColorAnnotations: true}),
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const parent = context.parent as any
          if (parent?.layout === 'homePage') {
            return true // body is optional for homepage layout
          }
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
      backgroundColor: 'backgroundColor',
      layout: 'layout',
      title: 'title',
      tag: 'tag',
      body: 'body',
    },
    prepare({title, layout, body}) {
      const layoutLabels: Record<string, string> = {
        headlineLeft: 'Headline Left + Copy Right',
        headlineMiddle: 'Headline Middle',
        homePage: 'Homepage',
      }

      let subtitle = 'Text Module'

      if (layout === 'headlineLeft' || layout === 'headlineMiddle') {
        subtitle = title || 'Text Module'
      } else if (layout === 'homePage') {
        const bodyText = body
          ?.map((block: any) =>
            block._type === 'block' && block.children
              ? block.children.map((child: any) => child.text).join('')
              : '',
          )
          .join(' ')

        const words = bodyText?.split(/\s+/).filter(Boolean).slice(0, 20).join(' ')
        subtitle = words ? `${words}...` : 'Text Module'
      }

      return {
        title: ['Text Module', layoutLabels[layout]].filter(Boolean).join(' • '),
        subtitle,
      }
    },
  },
})
