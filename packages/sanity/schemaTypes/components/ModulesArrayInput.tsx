// packages/sanity/schemaTypes/components/ModulesArrayInput.tsx

import {ArrayOfObjectsInputProps} from 'sanity'
import {Stack, Card, Text, Box} from '@sanity/ui'
import {WarningOutlineIcon} from '@sanity/icons'

/**
 * Custom array input for module arrays with Hero Module validation.
 *
 * Enforces the following rules:
 * - Exactly one Hero Module is required
 * - Hero Module must be the first item in the array
 */
export function ModulesArrayInput(props: ArrayOfObjectsInputProps) {
  const {value, renderDefault} = props

  // Cast array items to include _type property
  const modules = (value || []) as Array<{_key: string; _type: string}>

  // Define all hero module variants
  const HERO_TYPES = ['heroModule', 'servicesPageHeroModule']

  // Count hero modules and check first position
  const heroCount = modules.filter((m) => HERO_TYPES.includes(m._type)).length
  const firstIsHero = modules.length > 0 && HERO_TYPES.includes(modules[0]._type)

  // Determine validation error message
  let errorMessage = ''
  if (heroCount === 0) {
    errorMessage = 'Exactly one Hero Module is required'
  } else if (heroCount > 1) {
    errorMessage = 'Only one Hero Module is allowed'
  } else if (!firstIsHero) {
    errorMessage = 'Hero Module must be the first module'
  }

  return (
    <Stack space={3}>
      {errorMessage && (
        <Card tone="critical" padding={3} radius={2}>
          <Stack space={2}>
            <Box>
              <Text size={1}>
                <WarningOutlineIcon style={{marginRight: 8}} />
                {errorMessage}
              </Text>
            </Box>
          </Stack>
        </Card>
      )}
      {renderDefault(props)}
    </Stack>
  )
}
