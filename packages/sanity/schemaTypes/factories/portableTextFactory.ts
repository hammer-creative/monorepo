// packages/sanity/schemaTypes/factories/portableTextFactory.ts

import {defineField} from 'sanity'
import {PortableTextWithCounter} from '../components/PortableTextWithCounter'
import {addRequiredLabel} from '../utils/fieldHelpers'
import type {ArrayRule} from 'sanity'

interface PortableTextConfig {
  name?: string
  title?: string
  required?: boolean
  maxLength?: number
  description?: string
  blocks?: any[] // allow caller to override the `of` config
}

export const createPortableTextField = (config: PortableTextConfig = {}) => {
  const {
    name = 'content',
    title = 'Content',
    required = false,
    maxLength = 1000,
    description = '',
    blocks,
  } = config

  // Default Sanity block definition (default toolbar)
  const defaultBlocks = [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'H2', value: 'h2'},
        {title: 'H3', value: 'h3'},
      ],
      lists: [{title: 'Bullet', value: 'bullet'}],
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
            fields: [
              {
                name: 'href',
                type: 'url',
                title: 'URL',
              },
            ],
          },
        ],
      },
    },
  ]

  return defineField({
    name,
    title,
    type: 'array',
    of: blocks || defaultBlocks, // <- use override if passed
    description: addRequiredLabel(description, required),
    components: {
      input: PortableTextWithCounter,
    },
    validation: (Rule: ArrayRule) => {
      let rule = Rule
      if (required) rule = rule.required()
      if (maxLength) rule = rule.max(maxLength)
      return rule
    },
  })
}
