// packages/sanity/schemaTypes/modules/ServicesPageCardModule.ts

import {DocumentIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'
import {createImageDimensionValidation, applyRequired} from '../utils/validation'

export const servicesPageCardModule = defineType({
  name: 'servicesPageCardModule',
  title: 'Services Page Card Module',
  type: 'object',
  icon: DocumentIcon,
  fields: [
    titleField(),
    portableTextField({maxLength: 200}),
    (() => {
      const {validation: _, ...imageField} = createSingleImageField({
        name: 'image',
        title: 'Background Image',
        required: false,
        description: 'Minimum dimensions 3760 px × 1080 px, maximum file size 10 MB.',
        imageOptions: {
          hotspot: {
            previews: [{title: '32:9 Landscape', aspectRatio: 32 / 9}],
          },
        },
      })
      return {
        ...imageField,
        validation: (Rule) =>
          applyRequired(Rule, false, 'Background Image is required').custom(
            createImageDimensionValidation({
              minWidth: 3760,
              minHeight: 1080,
              maxFileSize: 10,
            }),
          ),
      }
    })(),
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      options: {
        filter: () => ({
          filter: '_type == "service"',
          params: {},
        }),
        sort: [{field: 'title', direction: 'asc'}],
      },
    },
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
    },
    prepare({title}) {
      return {
        title: title || 'Services Card Module',
      }
    },
  },
})
