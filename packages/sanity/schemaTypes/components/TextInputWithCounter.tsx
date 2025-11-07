// packages/sanity/schemaTypes/components/TextInputWithCounter.tsx

import {Stack, Text} from '@sanity/ui'
import type {StringInputProps} from 'sanity'

export function TextInputWithCounter(props: StringInputProps) {
  const {renderDefault, value = '', schemaType} = props
  const charCount = value.length
  const maxLength =
    schemaType.validation?.[0]?._rules?.find((r: any) => r.flag === 'max')?.constraint || 100

  // ✅ Don’t rebuild the input; just render Sanity’s default input (which keeps the badge)
  // and put the counter below it.
  return (
    <Stack space={2}>
      {renderDefault?.(props)}
      <Text size={1} style={{color: charCount > maxLength ? '#f03e2f' : '#666'}}>
        {charCount} / {maxLength} characters
      </Text>
    </Stack>
  )
}
