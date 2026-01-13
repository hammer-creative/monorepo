// apps/web/src/lib/sanity/ssr.ts
// import * as serverOnly from '@sanity/react-loader';
import { type ClientPerspective } from 'next-sanity';

// import { client } from './client';

// const { loadQuery, setServerClient } = serverOnly;

// setServerClient(client);

const loadQueryOptions = (context: { draftMode?: boolean }) => {
  const { draftMode } = context;
  return draftMode
    ? {
        perspective: 'drafts' as ClientPerspective,
        stega: true,
        useCdn: false,
      }
    : {};
};

// export { loadQuery, loadQueryOptions };

export { loadQueryOptions };
