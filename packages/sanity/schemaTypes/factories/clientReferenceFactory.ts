// packages/sanity/schemaTypes/factories/clientReferenceFactory.ts

import {defineField} from 'sanity'
import {UsersIcon} from '@sanity/icons'
import {addRequiredLabel} from '../utils/fieldHelpers'
import {applyRequired} from '../utils/validation'
import type {ReferenceRule} from 'sanity'

interface ClientFieldConfig {
  name?: string
  title?: string
  required?: boolean
  description?: string
}

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
      filter: () => {
        return {
          filter: '_type == "client"',
          params: {},
        }
      },
      sort: [{field: 'name', direction: 'asc'}],
    },
    validation: (rule: ReferenceRule) => applyRequired(rule, required, `${title} is required`),
    ...(hidden && {hidden}),
  })
}
