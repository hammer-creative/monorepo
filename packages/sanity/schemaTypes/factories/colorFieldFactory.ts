// packages/sanity/schemaTypes/factories/colorFieldFactory.ts

import {defineField} from 'sanity'
import type {Rule} from 'sanity'
import React from 'react'

const COLORS = {
  nightshade: '#141515',
  sandstorm: '#778888',
  aircutter: '#C7D3D3',
  hyperbeam: '#FFCC98',
  hydroblast: '#35808D',
  vinewhip: '#274040',
} as const

interface ColorFieldConfig {
  name?: string
  title?: string
  required?: boolean
}

export const createColorField = (config: ColorFieldConfig = {}) => {
  const {name = 'backgroundColor', title = 'Background Color', required = false} = config

  return defineField({
    name,
    title,
    type: 'object',
    fields: [
      {
        name: 'enabled',
        title: 'Include background color?',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'name',
        title: 'Color',
        type: 'string',
        options: {
          layout: 'radio',
          direction: 'vertical',
          list: Object.entries(COLORS).map(([key, hex]) => ({
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
            value: key, // Just store the name
          })),
        },
        hidden: ({parent}: any) => !parent?.enabled,
        validation: (Rule: Rule) =>
          Rule.custom((value, context: any) => {
            const parent = context.parent
            if (parent?.enabled && !value) {
              return 'Please select a color'
            }
            return true
          }),
      },
      {
        name: 'hex',
        title: 'Hex',
        type: 'string',
        readOnly: true,
        hidden: true,
      },
    ],
    preview: {
      select: {
        enabled: 'enabled',
        name: 'name',
      },
      prepare({enabled, name}) {
        if (!enabled || !name) {
          return {title: 'No background color'}
        }

        const hex = COLORS[name as keyof typeof COLORS]
        return {
          title: name.charAt(0).toUpperCase() + name.slice(1),
          subtitle: hex,
          media: () =>
            React.createElement('div', {
              style: {
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                backgroundColor: hex,
                border: '1px solid #ccc',
              },
            }),
        }
      },
    },
    validation: required ? (Rule: Rule) => Rule.required() : undefined,
  })
}
