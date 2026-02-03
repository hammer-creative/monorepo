// packages/sanity/schemaTypes/modules/textModule.ts

import {TextIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createTextField, createColorField} from '../factories'
import {applyRequired, requireWhen} from '../utils/validation'

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
          {title: 'Challenge', value: 'challenge'},
          {title: 'Headline Left + Copy Right', value: 'headlineLeft'},
          {title: 'Testimonial', value: 'testimonial'},
          {title: 'Homepage', value: 'homePage'},
        ],
        layout: 'radio',
      },
      initialValue: 'headlineLeft',
      validation: (Rule) => applyRequired(Rule, true, 'Layout is required'),
    },
    {
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [
        {
          type: 'reference',
          to: [{type: 'client'}],
          options: {
            filter: () => ({
              filter: '_type == "client"',
              params: {},
            }),
            sort: [{field: 'name', direction: 'asc'}],
          },
        },
      ],
      hidden: ({parent}: any) => !parent?.layout || parent?.layout !== 'testimonial',
    },
    {
      ...createTextField({
        name: 'attribution',
        title: 'Attribution',
        maxLength: 100,
        description: 'Alternative to Client reference (e.g., "John Doe, CEO")',
      }),
      hidden: ({parent}: any) => !parent?.layout || parent?.layout !== 'testimonial',
    },
    {
      ...createTextField({
        name: 'tag',
        title: 'Tag',
        maxLength: 50,
      }),
      hidden: ({parent}) => !parent?.layout || parent?.layout === 'testimonial',
    },
    (() => {
      const {validation: _, ...field} = titleField({required: false, rows: 3, maxLength: 150})
      return {
        ...field,
        hidden: ({parent}) => !parent?.layout || parent?.layout === 'testimonial',
      }
    })(),
    portableTextField({
      enableColorAnnotations: true,
      maxLength: 800,
    }),
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

      if (layout === 'testimonial') {
        return requireWhen(
          (!fields?.clients || fields.clients.length === 0) && !fields?.attribution,
          'Testimonial requires either Client references or Attribution text',
        )
      }

      return true
    }),
  preview: {
    select: {
      backgroundColor: 'backgroundColor',
      layout: 'layout',
      title: 'title',
      tag: 'tag',
      body: 'body',
      client: 'clients[0].name',
      attribution: 'attribution',
    },
    prepare({title, layout, tag, body, client, attribution}) {
      const layoutLabels: Record<string, string> = {
        challenge: 'Challenge',
        headlineLeft: 'Headline Left + Copy Right',
        testimonial: 'Testimonial',
        homePage: 'Homepage',
      }

      let subtitle = 'Text Module'

      if (layout === 'challenge') {
        const bodyText = body
          ?.map((block: any) =>
            block._type === 'block' && block.children
              ? block.children.map((child: any) => child.text).join('')
              : '',
          )
          .join(' ')

        const words = bodyText?.split(/\s+/).filter(Boolean).slice(0, 20).join(' ')
        subtitle = words ? `${words}...` : 'Text Module'
      } else if (layout === 'testimonial') {
        const bodyText = body
          ?.map((block: any) =>
            block._type === 'block' && block.children
              ? block.children.map((child: any) => child.text).join('')
              : '',
          )
          .join(' ')

        const words = bodyText?.split(/\s+/).filter(Boolean).slice(0, 20).join(' ')
        const attributionPart = client || attribution
        const prefix = attributionPart ? `${attributionPart} • ` : ''
        subtitle = words ? `${prefix}${words}...` : prefix || 'Text Module'
      } else if (layout === 'headlineLeft') {
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
