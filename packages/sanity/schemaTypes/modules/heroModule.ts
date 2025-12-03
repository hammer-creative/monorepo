// packages/sanity/schemaTypes/modules/heroModule.ts

import {StarIcon} from '@sanity/icons'
import {defineType} from 'sanity'
import {titleField, portableTextField} from '../fields/textField'
import {createClientField, createSingleImageField, createColorField} from '../factories'

export const heroModule = defineType({
  name: 'heroModule',
  title: 'Hero Module',
  type: 'object',
  icon: StarIcon,
  fields: [
    createClientField({
      name: 'client',
      title: 'Client',
      required: true,
    }),
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
      backgroundColor: 'backgroundColor',
      services: 'services',
      deliverables: 'deliverables',
    },
    prepare({title, backgroundColor, services, deliverables}) {
      const serviceCount = services?.length || 0
      const deliverableCount = deliverables?.length || 0
      const counts = [
        serviceCount > 0 && `${serviceCount} service${serviceCount !== 1 ? 's' : ''}`,
        deliverableCount > 0 &&
          `${deliverableCount} deliverable${deliverableCount !== 1 ? 's' : ''}`,
      ]
        .filter(Boolean)
        .join(' • ')

      return {
        title: title || 'Hero Module',
        subtitle:
          counts || (backgroundColor?.enabled ? `Background: ${backgroundColor.name}` : 'Hero'),
      }
    },
  },
})
