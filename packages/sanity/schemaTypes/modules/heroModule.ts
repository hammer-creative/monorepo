// packages/sanity/schemaTypes/modules/heroModule.ts

import {AsteriskIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'
import {createImageDimensionValidation, applyRequired} from '../utils/validation'

export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero Module',
  type: 'object',
  icon: AsteriskIcon,
  fields: [
    titleField(),
    portableTextField(),
    (() => {
      const {validation: _, ...imageField} = createSingleImageField({
        name: 'image',
        title: 'Hero Image',
        required: true,
        description: 'Minimum dimensions 3840 px × 2160 px, maximum file size 20 MB.',
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
              maxFileSize: 20,
            }),
          ),
      }
    })(),
    (() => {
      const {validation: _, ...imageField} = createSingleImageField({
        name: 'teaserImage',
        title: 'Teaser Image',
        required: true,
        description: 'Minimum dimensions 1380 px × 800 px, maximum file size 2 MB.',
        imageOptions: {
          hotspot: {
            previews: [{title: '5:3 Landscape', aspectRatio: 5 / 3}],
          },
        },
      })
      return {
        ...imageField,
        validation: (Rule) =>
          applyRequired(Rule, true, 'Teaser Image is required').custom(
            createImageDimensionValidation({
              minWidth: 1380,
              minHeight: 800,
              maxFileSize: 2,
            }),
          ),
      }
    })(),
    {
      name: 'services',
      title: 'Services',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'service'}]}],
      description: 'Services provided for this project',
    },
    {
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'deliverable'}]}],
      description: 'Deliverables for this project',
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
      media: 'image',
    },
    prepare({title, media}) {
      return {
        title: 'Hero Module',
        subtitle: title || undefined,
        media,
      }
    },
  },
})
