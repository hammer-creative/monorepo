// packages/sanity/schemaTypes/utils/fieldHelpers.ts

/**
 * Adds "Required" prefix to field description if field is required
 * and description doesn't already contain "required"
 */
export const addRequiredLabel = (description: string = '', required: boolean = false): string => {
  if (!required) return description
  if (description.toLowerCase().includes('required')) return description
  return description ? `Required • ${description}` : 'Required'
}
