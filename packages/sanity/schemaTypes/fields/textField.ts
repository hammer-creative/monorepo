// packages/sanity/schemaTypes/fields/textField.ts

import {defineField} from 'sanity'
import {SlugInputWithCounter} from '../components/SlugInputWithCounter'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'

export const titleField = () =>
  createTextField({
    name: 'title',
    title: 'Title',
    required: true,
    maxLength: 100,
    withCounter: true,
  })

export const headingField = () =>
  createTextField({
    name: 'heading',
    title: 'Heading',
    required: true,
    maxLength: 80,
    withCounter: true,
  })

export const descriptionField = () =>
  createPortableTextField({
    name: 'description',
    title: 'Description',
    required: true,
    maxLength: 500,
  })

export const captionField = () =>
  createTextField({
    name: 'caption',
    title: 'Caption',
    multiline: true,
    rows: 2,
    maxLength: 200,
    withCounter: true,
  })

export const slugField = () =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    components: {
      input: SlugInputWithCounter,
    },
    options: {
      source: 'title',
      maxLength: 100,
      slugify: (input: string) =>
        input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, ''),
    },
    validation: (Rule) => Rule.required(),
  })
