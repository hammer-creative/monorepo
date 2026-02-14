// packages/sanity/schemaTypes/documents/index.ts

// Documents (schemas in array)
import {basicPage} from './basicPage'
import {caseStudyPage} from './caseStudyPage'
import {client} from './client'
import {deliverable} from './deliverable'
import {homePage} from './homePage'
import {service} from './service'
import {servicesPage} from './servicesPage'
import {workPage} from './workPage'

export const documentTypes = [
  basicPage,
  client,
  caseStudyPage,
  deliverable,
  homePage,
  service,
  servicesPage,
  workPage,
]
