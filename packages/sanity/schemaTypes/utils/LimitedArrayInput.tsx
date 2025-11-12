// packages/sanity/schemaTypes/utils/LimitedArrayInput.tsx

import React from 'react'
import type {ArrayOfObjectsInputProps} from 'sanity'
import {Stack, Card, Text} from '@sanity/ui'

/**
 * Creates a custom array input that enforces a maximum item limit
 * Shows warning when limit is reached
 */
export function createLimitedArrayInput(limit: number, itemName = 'item') {
  return function LimitedArrayInput(props: ArrayOfObjectsInputProps) {
    const {renderDefault, value = []} = props
    const count = value.length
    const atLimit = count >= limit

    return (
      <Stack space={3}>
        {renderDefault(props)}
        {atLimit && (
          <Card tone="caution" padding={3} radius={2}>
            <Text size={1}>
              Limit of {limit} {itemName}s reached
            </Text>
          </Card>
        )}
      </Stack>
    )
  }
}
