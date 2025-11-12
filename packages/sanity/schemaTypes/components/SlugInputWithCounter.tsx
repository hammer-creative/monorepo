// packages/sanity/schemaTypes/components/SlugInputWithCounter.tsx
import {TextInput, Stack, Text, Button, Flex, Box} from '@sanity/ui'
import {set, unset} from 'sanity'
import type {SlugInputProps} from 'sanity'
import {useFormValue} from 'sanity'

/**
 * Common English stop words to exclude from slugs.
 * Helps create cleaner, more meaningful URLs.
 */
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'as',
  'at',
  'before',
  'but',
  'by',
  'for',
  'from',
  'is',
  'in',
  'into',
  'like',
  'of',
  'off',
  'on',
  'onto',
  'since',
  'than',
  'the',
  'this',
  'that',
  'to',
  'up',
  'via',
  'with',
])

/**
 * Slug input with character counter and custom stop word filtering.
 *
 * Generates URL-friendly slugs from a source field (typically 'title')
 * and removes common stop words for cleaner URLs.
 */
export function SlugInputWithCounter(props: SlugInputProps) {
  const {value, schemaType, onChange, renderDefault} = props
  const slugValue = value?.current || ''
  const charCount = slugValue.length
  const maxLength = schemaType.options?.maxLength || 96

  const document = useFormValue([]) as Record<string, any>

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value
    if (newValue.length <= maxLength) {
      onChange(newValue ? set({_type: 'slug', current: newValue}) : unset())
    }
  }

  /**
   * Generate slug from source field with stop word filtering.
   * Uses Sanity's built-in slug generation then removes common stop words.
   */
  const handleGenerate = () => {
    const sourceField = schemaType.options?.source as string
    if (!sourceField || !document) return

    const sourceValue = document[sourceField] as string
    if (!sourceValue) return

    // Simple slugify: lowercase, replace spaces with hyphens, remove special chars
    const baseSlug = sourceValue
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '')

    // Remove stop words
    const filteredSlug = baseSlug
      .split('-')
      .filter((word: string) => !STOP_WORDS.has(word.toLowerCase()))
      .join('-')

    onChange(set({_type: 'slug', current: filteredSlug}))
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
