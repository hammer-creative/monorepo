// packages/sanity/schemaTypes/components/TextInputWithCounter.tsx

// packages/sanity/schemaTypes/components/TextInputWithCounter.tsx

import {Stack, Text} from '@sanity/ui'
import type {StringInputProps} from 'sanity'

/**
 * Text input with character counter.
 *
 * Displays current character count against max length from validation rules.
 * Uses Sanity's default text input component with counter below.
 */
export function TextInputWithCounter(props: StringInputProps) {
  const {renderDefault, value = '', schemaType} = props
  const charCount = value.length

  // Extract max length from validation rules (with safe type casting)
  const validation = schemaType.validation as any
  const maxLength = validation?.[0]?._rules?.find((r: any) => r.flag === 'max')?.constraint || 100

  return (
    <Stack space={2}>
      {renderDefault?.(props)}
      <Text size={1} style={{color: charCount > maxLength ? '#f03e2f' : '#666'}}>
        {charCount} / {maxLength} characters
      </Text>
    </Stack>
  )
}
