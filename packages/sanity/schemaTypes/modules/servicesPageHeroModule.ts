// packages/sanity/schemaTypes/modules/servicesPageHeroModule.ts

import {AsteriskIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'
import {createImageDimensionValidation, applyRequired} from '../utils/validation'

export const servicesPageHeroModule = defineType({
  name: 'servicesPageHeroModule',
  title: 'Services Page Hero Module',
  type: 'object',
  icon: AsteriskIcon,
  fields: [
    (() => {
      const {validation: _, ...field} = titleField({required: false, rows: 3, maxLength: 150})
      return field
    })(),
    portableTextField({maxLength: 300}),
    (() => {
      const {validation: _, ...imageField} = createSingleImageField({
        name: 'image',
        title: 'Hero Image',
        required: true,
        description: 'Minimum dimensions 3840 px × 2160 px, maximum file size 10 MB.',
        imageOptions: {
          hotspot: {
            previews: [{title: '16:9 Landscape', aspectRatio: 16 / 9}],
          },
        },
      })
      return {
        ...imageField,
        validation: (Rule) =>
          applyRequired(Rule, true, 'Hero Image is required').custom(
            createImageDimensionValidation({
              minWidth: 3840,
              minHeight: 2160,
              maxFileSize: 10,
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
      title: 'title',
      backgroundColor: 'backgroundColor',
      media: 'image',
    },
    prepare({title, backgroundColor, media}) {
      return {
        title: title || 'Hero Module',
        subtitle: backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero',
        media,
      }
    },
  },
})
