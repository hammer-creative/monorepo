// packages/sanity/schemaTypes/components/SLugInputWithCounter.tsx

import {TextInput, Stack, Text, Button, Flex, Box} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {SlugInputProps} from 'sanity'
import {useFormValue} from 'sanity'

export function SlugInputWithCounter(props: SlugInputProps) {
  const {value, schemaType, onChange} = props
  const slugValue = value?.current || ''
  const charCount = slugValue.length
  const maxLength = schemaType.options?.maxLength || 96

  // Get the document to access the source field
  const document = useFormValue([]) as Record<string, any>

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value

    if (newValue.length <= maxLength) {
      onChange(newValue ? set({_type: 'slug', current: newValue}) : unset())
    }
  }

  const handleGenerate = () => {
    const sourceField = schemaType.options?.source as string
    if (sourceField && document) {
      const sourceValue = document[sourceField] as string
      if (sourceValue && schemaType.options?.slugify) {
        const slugified = schemaType.options.slugify(sourceValue)
        onChange(set({_type: 'slug', current: slugified}))
      }
    }
  }

  return (
    <Stack space={2}>
      <Flex gap={2} align="center">
        <Box flex={1}>
          <TextInput value={slugValue} onChange={handleChange} />
        </Box>
        <Button text="Generate" mode="ghost" onClick={handleGenerate} />
      </Flex>
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
