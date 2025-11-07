// packages/sanity/schemaTypes/components/TextAreaWithCounter.tsx

import {TextArea, Stack, Text} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {StringInputProps} from 'sanity'

export function TextAreaWithCounter(props: StringInputProps) {
  const {value = '', schemaType, onChange} = props
  const charCount = value.length

  const maxLength =
    schemaType.validation?.[0]?._rules?.find((rule: any) => rule.flag === 'max')?.constraint || 500

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = event.currentTarget.value

    if (newValue.length <= maxLength) {
      onChange(newValue ? set(newValue) : unset())
    }
  }

  return (
    <Stack space={2}>
      <TextArea value={value} onChange={handleChange} rows={schemaType.rows || 3} />
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
