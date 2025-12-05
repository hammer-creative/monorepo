// packages/sanity/schemaTypes/factories/clientReferenceFactory.ts

import {defineField} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {addRequiredLabel} from '../utils/fieldHelpers'
import type {ReferenceRule} from 'sanity'

interface ClientFieldConfig {
  name?: string
  title?: string
  required?: boolean
  description?: string
}

/**
 * Creates a reference field for linking to a Client document
 * Supports optional required validation and label annotation
 */
export const createClientField = (config: ClientFieldConfig & {hidden?: any} = {}) => {
  const {name = 'client', title = 'Client', required = false, description = '', hidden} = config

  return defineField({
    name,
    title,
    type: 'reference',
    icon: UsersIcon,
    to: [{type: 'client'}],
    description: addRequiredLabel(description, required),
    options: {
      disableNew: false,
    },
    validation: required
      ? (rule: ReferenceRule) => rule.required().error(`${title} is required`)
      : undefined,
    ...(hidden && {hidden}),
  })
}
