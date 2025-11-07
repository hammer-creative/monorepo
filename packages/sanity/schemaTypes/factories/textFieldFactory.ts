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

  const field = defineField({
    name,
    title,
    type: multiline ? 'text' : 'string',
    description: addRequiredLabel(description, required),
    components: withCounter
      ? {
          input: multiline ? TextAreaWithCounter : TextInputWithCounter,
        }
      : undefined,
    options: multiline ? {rows} : undefined,
    validation: (Rule: StringRule | TextRule) => {
      let rule = Rule
      if (required) rule = rule.required().error(`${title} is required`)
      if (maxLength) rule = rule.max(maxLength)
      return rule
    },
  })

  // ✅ forcibly tag the schema so Sanity always shows the required badge
  if (required) {
    ;(field as any).validation = (Rule: StringRule | TextRule) =>
      Rule.required().error(`${title} is required`).max(maxLength)
  }

  return field
}
