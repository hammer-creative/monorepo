// schemaTypes/modules/heroModule.ts

import {headingField} from '../fields/textField'
import {defineType} from 'sanity'

export const heroModule = defineType({
  name: 'heroModule',
  type: 'object',
  fields: [headingField],
})
