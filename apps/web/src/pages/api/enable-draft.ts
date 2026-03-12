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
