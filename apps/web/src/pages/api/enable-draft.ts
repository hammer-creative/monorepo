// apps/web/src/pages/api/enable-draft.ts
import { client } from '@/lib/sanity/client';
import { validatePreviewUrl } from '@sanity/preview-url-secret';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log('=== ENABLE DRAFT CALLED ===');
  console.log('URL:', req.url);

  if (!req.url) {
    return res.status(500).json({ message: 'Missing request URL' });
  }

  const { isValid, redirectTo = '/' } = await validatePreviewUrl(
    client.withConfig({
      token: process.env.SANITY_API_PREVIEW_TOKEN,
    }),
    req.url,
  );

  console.log('=== VALID?', isValid, 'REDIRECT TO:', redirectTo);

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  if (!isValid) {
    return res.status(401).json({ message: 'Invalid secret' });
  }

  res.setDraftMode({ enable: true });
  res.status(307).send(`
  <html>
    <head>
      <meta http-equiv="refresh" content="0;url=${redirectTo}" />
    </head>
    <body>
      <script>window.location.href = '${redirectTo}';</script>
    </body>
  </html>
`);
}
