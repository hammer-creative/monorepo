import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: 'n0pp6em3',
    dataset: 'production',
  },
  deployment: {
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/cli#auto-updates
     */
    autoUpdates: false,
  },
  typegen: {
    path: './schemaTypes/**/*.{ts,tsx}',
    schema: 'schema.json',
    generates: '../../apps/web/src/types/sanity.generated.ts', // Output directly to web app
    overloadClientMethods: false,
  },
})
