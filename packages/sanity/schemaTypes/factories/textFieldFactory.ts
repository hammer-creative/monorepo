// packages/sanity/schemaTypes/factories/textFieldFactory.ts

import {defineField} from 'sanity'
import {TextInputWithCounter} from '../components/TextInputWithCounter'
import {TextAreaWithCounter} from '../components/TextAreaWithCounter'
import {addRequiredLabel} from '../utils/fieldHelpers'
import type {StringRule, TextRule} from 'sanity'

interface TextFieldConfig {
  name?: string
  title?: string
  required?: boolean
  maxLength?: number
  rows?: number
  multiline?: boolean
  withCounter?: boolean
  description?: string
}

export const createTextField = (config: TextFieldConfig = {}) => {
  const {
    name = 'text',
    title = 'Text',
    required = false,
    maxLength = 120,
    rows = 3,
    multiline = false,
    withCounter = true,
    description = '',
  } = config

  return defineField({
    name,
    title,
    type: multiline ? 'text' : 'string',
    description: addRequiredLabel(description, required),
    components: withCounter
      ? {
          input: multiline ? TextAreaWithCounter : TextInputWithCounter,
        }
      : undefined,
    rows: multiline ? rows : undefined,
    validation: required
      ? (Rule: StringRule | TextRule) =>
          Rule.required().max(maxLength).error(`${title} is required`)
      : (Rule: StringRule | TextRule) => Rule.max(maxLength),
  })
}
