// packages/sanity/schemaTypes/index.ts
import type {SchemaTypeDefinition} from 'sanity'
import {documentTypes} from './documents'
import {moduleTypes} from './modules'
import {objectTypes} from './objects'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [...documentTypes, ...moduleTypes, ...objectTypes],
}
