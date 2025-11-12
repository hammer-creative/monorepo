// packages/sanity/schemaTypes/documents/index.ts

// Documents (schemas in array)
import {caseStudy} from './caseStudy'
import {client} from './client'
import {deliverable} from './deliverable'
import {service} from './service'

export const documentTypes = [client, caseStudy, deliverable, service]
