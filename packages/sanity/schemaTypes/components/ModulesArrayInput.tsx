// packages/sanity/schemaTypes/components/ModulesArrayInput.tsx

import {ArrayOfObjectsInputProps, set, insert, unset} from 'sanity'
import {Stack, Card, Text, Box} from '@sanity/ui'
import {WarningOutlineIcon} from '@sanity/icons'

export function ModulesArrayInput(props: ArrayOfObjectsInputProps) {
  const {value, renderDefault} = props

  // Validate hero module rules
  const modules = value || []
  const heroCount = modules.filter((m: any) => m._type === 'heroModule').length
  const firstIsHero = modules.length > 0 && modules[0]._type === 'heroModule'

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
