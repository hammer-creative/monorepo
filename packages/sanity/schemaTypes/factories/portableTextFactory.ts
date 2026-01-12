// packages/sanity/schemaTypes/factories/portableTextFactory.ts

import {defineField, type ArrayRule} from 'sanity'
import {PortableTextWithCounter} from '../components/PortableTextWithCounter'
import {addRequiredLabel} from '../utils/fieldHelpers'
import React from 'react'
import {DEFAULT_COLORS} from '@hammercreative/ui'

interface PortableTextConfig {
  name?: string
  title?: string
  required?: boolean
  maxLength?: number
  description?: string
  blocks?: any[]
  enableColorAnnotations?: boolean
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
    enableColorAnnotations = false,
  } = config

  const annotations = [
    {
      name: 'link',
      type: 'object',
      title: 'Link',
      fields: [{name: 'href', type: 'url', title: 'URL'}],
    },
  ]

  if (enableColorAnnotations) {
    annotations.push({
      name: 'color',
      type: 'object',
      title: 'Text Color',
      icon: () => '🎨',
      fields: [
        {
          name: 'name',
          title: 'Color',
          type: 'string',
          options: {
            layout: 'radio',
            direction: 'vertical',
            list: Object.entries(DEFAULT_COLORS).map(([key, hex]) => ({
              title: React.createElement(
                'div',
                {
                  style: {
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                  },
                },
                [
                  React.createElement('div', {
                    key: `${key}-swatch`,
                    style: {
                      width: '36px',
                      height: '36px',
                      borderRadius: '3px',
                      border: '1px solid #ccc',
                      backgroundColor: hex,
                    },
                  }),
                  React.createElement(
                    'span',
                    {key: `${key}-label`},
                    key.charAt(0).toUpperCase() + key.slice(1),
                  ),
                ],
              ),
              value: key,
            })),
          },
        },
      ],
    } as any)
  }

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
        annotations,
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
    validation: (rule: ArrayRule<any>) => {
      const baseRule = required ? rule.required().error(`${title} is required`) : rule

      return baseRule.max(maxLength).custom((value: any[] = []) => {
        const charCount = value
          .filter((block: any) => block._type === 'block')
          .map((block: any) => block.children?.map((child: any) => child.text || '').join('') || '')
          .join('').length

        if (charCount > maxLength) {
          return `Must be ${maxLength} characters or less (currently ${charCount})`
        }
        return true
      })
    },
  })
}
