// schemaTypes/documents/basicPage.ts
import { defineType } from 'sanity';
import { portableTextField, slugField, titleField } from '../fields/textField';

export const basicPage = defineType({
  name: 'basicPage',
  title: 'Basic Page',
  type: 'document',
  fields: [
    titleField(),
    slugField(),
    portableTextField({
      maxLength: 50000,
      enableTables: true,
      enableColorAnnotations: true,
    }),
  ],
});
