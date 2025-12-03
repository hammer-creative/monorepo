// packages/sanity/schemaTypes/modules/caseStudyReferenceModule.ts

import {DocumentsIcon} from '@sanity/icons'
import {defineType} from 'sanity'

export const caseStudyCardModule = defineType({
  name: 'caseStudyCardModule',
  title: 'Case Study Card Module',
  type: 'object',
  icon: DocumentsIcon,
  fields: [
    {
      name: 'caseStudies',
      title: 'Case Studies',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'caseStudy'}]}],
      validation: (Rule) => Rule.required().min(1),
      description: 'Select case studies to display',
    },
  ],
  preview: {
    select: {
      caseStudies: 'caseStudies',
    },
    prepare({caseStudies}) {
      const count = caseStudies?.length || 0
      return {
        title: 'Case Study List',
        subtitle: `${count} case stud${count !== 1 ? 'ies' : 'y'}`,
      }
    },
  },
})
