// schemaTypes/fields/colorField.ts
import {createColorField} from '../factories/colorFieldFactory'

export const backgroundColorField = createColorField({
  name: 'backgroundColor',
  title: 'Background Color',
})
