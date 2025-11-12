// packages/sanity/schemaTypes/components/TextAreaWithCounter.tsx

// packages/sanity/schemaTypes/components/TextAreaWithCounter.tsx

import {Stack, Text} from '@sanity/ui'
import type {StringInputProps} from 'sanity'

/**
 * Text area input with character counter.
 *
 * Displays current character count against max length from validation rules.
 * Uses Sanity's default text area component with counter below.
 */
export function TextAreaWithCounter(props: StringInputProps) {
  const {renderDefault, value = '', schemaType} = props
  const charCount = value.length

  // Extract max length from validation rules (with safe type casting)
  const validation = schemaType.validation as any
  const maxLength =
    validation?.[0]?._rules?.find((rule: any) => rule.flag === 'max')?.constraint || 500

  return (
    <Stack space={2}>
      {renderDefault?.(props)}
      <Text
        size={1}
        style={{
          color: charCount > maxLength ? '#f03e2f' : '#666',
        }}
      >
        {charCount} / {maxLength} characters
      </Text>
    </Stack>
  )
}
