// apps/web/src/pages/api/enable-draft.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { COOKIE_NAME_PRERENDER_BYPASS } from 'next/dist/server/api-utils';

const CONTENT_TYPE_ROUTES: Record<string, string> = {
  caseStudy: '/case-studies',
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { slug, contentType } = req.query;

  if (!slug || !contentType) {
    return res.status(400).json({ message: 'Missing slug or contentType' });
  }

  const basePath = CONTENT_TYPE_ROUTES[contentType as string];

  if (!basePath) {
    return res.status(400).json({ message: 'Unknown content type' });
  }

  res.setDraftMode({ enable: true });

  // Fix cookie for iframe usage
  const headers = res.getHeader('Set-Cookie');
  if (Array.isArray(headers)) {
    res.setHeader(
      'Set-Cookie',
      headers.map((cookie: string) => {
        if (cookie.includes(COOKIE_NAME_PRERENDER_BYPASS)) {
          return cookie.replace('SameSite=Lax', 'SameSite=None; Secure');
        }
        return cookie;
      }),
    );
  }

  const redirectUrl = `${basePath}/${slug}`;
  res.writeHead(307, { Location: redirectUrl });
  res.end();
}
