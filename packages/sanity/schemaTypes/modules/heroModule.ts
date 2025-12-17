// packages/sanity/schemaTypes/modules/heroModule.ts

import {AsteriskIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createSingleImageField, createColorField} from '../factories'

export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero Module',
  type: 'object',
  icon: AsteriskIcon,
  fields: [
    {
      name: 'clients',
      title: 'Clients',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'client'}]}],
      validation: (Rule) => Rule.required().min(1),
    },
    titleField(),
    portableTextField(),
    createSingleImageField({
      name: 'image',
      title: 'Hero Image',
      required: true,
      minWidth: 3840,
      minHeight: 2160,
      maxFileSize: 10,
      description: 'Minimum dimensions 3840 px × 2160 px, maximum file size 10 MB.',
      imageOptions: {
        hotspot: {
          previews: [{title: '16:9 Landscape', aspectRatio: 16 / 9}],
        },
      },
    }),
    createSingleImageField({
      name: 'teaserImage',
      title: 'Teaser Image',
      required: true,
      minWidth: 1890,
      minHeight: 1130,
      maxFileSize: 2,
      description: 'Minimum dimensions 1890 px × 1130 px, maximum file size 2 MB.',
      imageOptions: {
        hotspot: {
          previews: [{title: '5:3 Landscape', aspectRatio: 5 / 3}],
        },
      },
    }),
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
    },
    prepare({title}) {
      return {
        title: 'Hero Module',
        subtitle: title || 'Missing Case Study Title',
      }
    },
  },
})
