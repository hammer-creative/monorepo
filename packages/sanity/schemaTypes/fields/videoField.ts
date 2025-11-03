// apps/packages/sanity/schemaTypes/fields/videoField.ts
import {defineField} from 'sanity'

export const createVideoField = (overrides = {}) =>
  defineField({
    name: 'video',
    title: 'Video',
    type: 'mux.video', // Using the Mux video type
    options: {
      hotspot: true, // Enable hotspot for better cropping
    },
    ...overrides,
  })

export const videoFields = {
  createVideoField,
}

export const optionalVideoField = createVideoField({
  title: 'Optional Video',
})
