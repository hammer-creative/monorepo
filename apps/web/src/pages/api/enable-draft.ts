// apps/web/src/pages/api/enable-draft.ts
// import { client } from '@/lib/sanity';
// import { validatePreviewUrl } from '@sanity/preview-url-secret';
// import type { NextApiRequest, NextApiResponse } from 'next';
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ) {
//   if (!req.url) {
//     return res.status(500).json({ message: 'Missing request URL' });
//   }
//   const { isValid, redirectTo = '/' } = await validatePreviewUrl(
//     client.withConfig({
//       token: process.env.SANITY_API_PREVIEW_TOKEN,
//     }),
//     req.url,
//   );
//   if (!isValid) {
//     return res.status(401).json({ message: 'Invalid secret' });
//   }
//   // Enable Draft Mode
//   res.setDraftMode({ enable: true });
//   res.writeHead(307, { Location: redirectTo });
//   res.end();
// }
// apps/web/src/pages/api/enable-draft.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Just enable draft mode and redirect
  res.setDraftMode({ enable: true });

  const redirect = (req.query['sanity-preview-pathname'] as string) || '/';
  res.writeHead(307, { Location: redirect });
  res.end();
}
