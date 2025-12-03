// packages/sanity/schemaTypes/documents/index.ts

// Documents (schemas in array)
import {caseStudyPage} from './caseStudyPage'
import {client} from './client'
import {deliverable} from './deliverable'
import {homePage} from './homePage'
import {service} from './service'
import {servicesPage} from './servicesPage'

export const documentTypes = [client, caseStudyPage, deliverable, homePage, service, servicesPage]
