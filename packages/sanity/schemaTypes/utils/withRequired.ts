// packages/sanity/schemaTypes/utils/withRequired.ts
import type {Rule} from 'sanity'

export const withRequired = (isRequired: boolean, title?: string) => (Rule: Rule) =>
  isRequired ? Rule.required().error(`${title || 'Field'} is required`) : Rule
