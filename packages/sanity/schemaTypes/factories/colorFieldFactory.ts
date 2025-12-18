// packages/sanity/schemaTypes/factories/colorFieldFactory.ts

import {defineField} from 'sanity'
import type {ObjectRule} from 'sanity'
import React from 'react'
import {DEFAULT_COLORS} from '@hammercreative/ui'
import {addRequiredLabel} from '../utils/fieldHelpers'

interface ColorFieldConfig {
  name?: string
  title?: string
  required?: boolean
  includeLabel?: string
  initialValue?: {
    enabled: boolean
    name?: string
  }
}

/**
 * Creates a color selection field using predefined palette options
 * Supports toggling background/text color inclusion
 */
export const createColorField = (config: ColorFieldConfig = {}) => {
  const {
    name = 'backgroundColor',
    title = 'Background Color',
    required = false,
    includeLabel,
    initialValue,
  } = config

  const isTextColor = name === 'textColor'

  return defineField({
    name,
    title,
    type: 'object',
    description: addRequiredLabel('', required),
    fields: [
      {
        name: 'enabled',
        title: includeLabel || (isTextColor ? 'Include text color?' : 'Include background color?'),
        type: 'boolean',
        initialValue: initialValue?.enabled ?? false,
      },
      {
        name: 'name',
        title: 'Color',
        type: 'string',
        initialValue: initialValue?.name,
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
        hidden: ({parent}: any) => !parent?.enabled,
      },
    ],
    validation: required
      ? (rule: ObjectRule) => rule.required().error(`${title} is required`)
      : undefined,
  })
}
