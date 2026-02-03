// packages/sanity/schemaTypes/modules/textImageModule.ts

import {ImageIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'
import {createImageDimensionValidation, applyRequired} from '../utils/validation'

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
      initialValue: 'textRight',
      validation: (Rule) => applyRequired(Rule, true, 'Layout is required'),
    },
    portableTextField({enableColorAnnotations: true, maxLength: 1000}),
    (() => {
      const {validation: _, ...imageField} = createSingleImageField({
        name: 'image',
        title: 'Image',
        required: true,
        description: 'Minimum dimensions 1960 px × 1400 px, maximum file size 3 MB.',
        imageOptions: {
          hotspot: {
            previews: [{title: '14:10 Rectangle', aspectRatio: 14 / 10}],
          },
        },
      })
      return {
        ...imageField,
        validation: (Rule) =>
          applyRequired(Rule, true, 'Image is required').custom(
            createImageDimensionValidation({
              minWidth: 1960,
              minHeight: 1400,
              maxFileSize: 3,
            }),
          ),
      }
    })(),
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
  preview: {
    select: {
      body: 'body',
      layout: 'layout',
      media: 'image',
    },
    prepare({layout, body, media}) {
      const layoutLabels: Record<string, string> = {
        textRight: 'Text Right → Image Left',
        textLeft: 'Text Left → Image Right',
      }

      const bodyText = body
        ?.map((block: any) =>
          block._type === 'block' && block.children
            ? block.children.map((child: any) => child.text).join('')
            : '',
        )
        .join(' ')

      const words = bodyText?.split(/\s+/).filter(Boolean).slice(0, 10).join(' ')

      return {
        title: 'Text + Image Module',
        subtitle: words ? `${words}...` : layoutLabels[layout] || undefined,
        media,
      }
    },
  },
})
