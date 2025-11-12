// packages/sanity/schemaTypes/fields/textField.ts

import {defineField} from 'sanity'
import {SlugInputWithCounter} from '../components/SlugInputWithCounter'
import {createTextField} from '../factories/textFieldFactory'
import {createPortableTextField} from '../factories/portableTextFactory'
import {addRequiredLabel} from '../utils/fieldHelpers'

/**
 * Standard title text field with character counter
 */
export const titleField = () =>
  createTextField({
    name: 'title',
    title: 'Title',
    required: true,
    maxLength: 100,
    withCounter: true,
  })

/**
 * Rich text body field with optional length limit
 */
export const portableTextField = () =>
  createPortableTextField({
    name: 'body',
    title: 'Body',
    required: true,
    maxLength: 600,
  })

/**
 * Optional image/video caption text field
 */
export const captionField = () =>
  createTextField({
    name: 'caption',
    title: 'Caption',
    multiline: true,
    rows: 2,
    maxLength: 200,
    withCounter: true,
  })

/**
 * Standard slug field, auto-generated from title
 */
export const slugField = () =>
  defineField({
    name: 'slug',
    title: 'Slug',
    type: 'slug',
    description: addRequiredLabel('Auto-generated from title', true),
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
    validation: (rule) => rule.required().error('Slug is required'),
  })
