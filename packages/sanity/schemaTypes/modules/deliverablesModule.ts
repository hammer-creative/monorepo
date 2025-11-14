// packages/sanity/schemaTypes/modules/deliverablesModule.ts

import {CaseIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const deliverablesModule = defineType({
  name: 'deliverablesModule',
  title: 'Deliverables Module',
  type: 'object',
  icon: CaseIcon,
  fields: [
    {
      name: 'deliverables',
      title: 'Deliverables',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'deliverable'}]}],
      validation: (Rule) => Rule.required().min(1),
    },
  ],
  preview: {
    select: {
      deliverables: 'deliverables',
    },
    prepare({deliverables}) {
      const deliverableCount = deliverables?.length || 0

      return {
        title: 'Deliverables Module',
        subtitle: [`${deliverableCount} deliverable${deliverableCount !== 1 ? 's' : ''}`]
          .filter(Boolean)
          .join(' • '),
      }
    },
  },
})
