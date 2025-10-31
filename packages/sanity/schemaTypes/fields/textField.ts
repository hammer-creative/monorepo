// packages/sanity/schemaTypes/fields/textField.ts

import {defineField} from 'sanity'
import {TextInputWithCounter} from '../components/TextInputWithCounter'
import {SlugInputWithCounter} from '../components/SlugInputWithCounter'

export const createTextField = (overrides = {}) =>
  defineField({
    name: 'text',
    title: 'Text',
    type: 'string',
    components: {
      input: TextInputWithCounter,
    },
    validation: (Rule) => Rule.max(200),
    ...overrides,
  })

export const titleField = createTextField({
  name: 'title',
  title: 'Title',
  validation: (Rule) => Rule.required().max(100),
})

export const headingField = createTextField({
  name: 'heading',
  title: 'Heading',
  validation: (Rule) => Rule.required().max(80),
})

export const slugField = defineField({
  name: 'slug',
  title: 'Slug',
  type: 'slug',
  components: {
    input: SlugInputWithCounter,
  },
  options: {
    source: 'title',
    maxLength: 100,
    slugify: (input) => {
      const withoutArticles = input.replace(/^(a|an|the)\s+/i, '')

      return withoutArticles
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '')
    },
  },
  validation: (Rule) => Rule.required(), // ← Removed .max(100)
})
