// packages/sanity/schemaTypes/utils/fieldHelpers.ts

const DISABLE_REQUIRED = process.env.SANITY_STUDIO_DISABLE_REQUIRED === 'true'

/**
 * Adds "Required" prefix to field description if field is required
 * and description doesn't contain "required"
 */
export const addRequiredLabel = (description: string = '', required: boolean = false): string => {
  if (DISABLE_REQUIRED || !required) return description
  if (description.toLowerCase().includes('required')) return description
  return description ? `Required • ${description}` : 'Required'
}
