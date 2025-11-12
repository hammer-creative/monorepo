// packages/sanity/schemaTypes/factories/portableTextFactory.ts

import {defineField, type ArrayRule} from 'sanity'
import {PortableTextWithCounter} from '../components/PortableTextWithCounter'
import {addRequiredLabel} from '../utils/fieldHelpers'

interface PortableTextConfig {
  name?: string
  title?: string
  required?: boolean
  maxLength?: number
  description?: string
  blocks?: any[]
}

/**
 * Creates a Portable Text field with optional character counter and validation
 * Supports custom block sets or defaults to basic text, blockquote, and link annotations
 */
export const createPortableTextField = (config: PortableTextConfig = {}) => {
  const {
    name = 'content',
    title = 'Content',
    required = false,
    maxLength = 1000,
    description = '',
    blocks,
  } = config

  const defaultBlocks = [
    {
      type: 'block',
      styles: [
        {title: 'Normal', value: 'normal'},
        {title: 'Blockquote', value: 'blockquote'},
      ],
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
  ]

  return defineField({
    name,
    title,
    type: 'array',
    of: blocks || defaultBlocks,
    description: addRequiredLabel(description, required),
    components: {input: PortableTextWithCounter},
    // Change both ArrayRule to ArrayRule<any> to avoid generic type issues
    validation: required
      ? (rule: ArrayRule<any>) => rule.required().max(maxLength).error(`${title} is required`)
      : (rule: ArrayRule<any>) => rule.max(maxLength),
  })
}
