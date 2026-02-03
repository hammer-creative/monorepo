// packages/sanity/schemaTypes/factories/textFieldFactory.ts

import {defineField} from 'sanity'
import {TextInputWithCounter} from '../components/TextInputWithCounter'
import {TextAreaWithCounter} from '../components/TextAreaWithCounter'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {applyRequired} from '../utils/validation'
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

/**
 * Creates a text field with optional character counter and validation
 * Supports both single-line (string) and multi-line (text) input
 */
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
    validation: (Rule: StringRule | TextRule) =>
      applyRequired(Rule, required, `${title} is required`).max(maxLength),
  })
}
