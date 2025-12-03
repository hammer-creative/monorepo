// packages/sanity/schemaTypes/components/PortableTextWithCounter.tsx

import {Stack, Text} from '@sanity/ui'
import type {ArrayOfObjectsInputProps} from 'sanity'

/**
 * Portable Text input with character counter.
 *
 * Displays the current character count and maximum allowed characters
 * extracted from the field's validation rules.
 */
export function PortableTextWithCounter(props: ArrayOfObjectsInputProps) {
  const {value = [], renderDefault, schemaType} = props

  // Extract text from portable text blocks
  const charCount = value
    .filter((block: any) => block._type === 'block')
    .map((block: any) => block.children?.map((child: any) => child.text || '').join('') || '')
    .join('').length

  // Extract max length from validation rules (with safe type casting)
  const validation = schemaType.validation as any
  const maxLength =
    validation?.[0]?._rules?.find((rule: any) => rule.flag === 'max')?.constraint || 1000

  // console.log('validation rules:', validation?.[0]?._rules)
  // console.log('maxLength found:', maxLength)

  return (
    <Stack space={2}>
      {renderDefault(props)}
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
