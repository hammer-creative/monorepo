// packages/sanity/schemaTypes/components/TextInputWithCounter.tsx

import {TextInput, Stack, Text} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'

export function TextInputWithCounter(props: StringInputProps) {
  const {value = '', schemaType, onChange} = props
  const charCount = value.length

  // Extract max length from validation rules
  const maxLength =
    schemaType.validation?.[0]?._rules?.find((rule: any) => rule.flag === 'max')?.constraint || 100

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value

    // Hard limit - don't allow typing beyond max
    if (newValue.length <= maxLength) {
      onChange(newValue ? set(newValue) : unset())
    }
  }

  return (
    <Stack space={2}>
      <TextInput value={value} onChange={handleChange} />
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
