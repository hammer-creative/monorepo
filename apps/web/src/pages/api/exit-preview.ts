import type { NextApiRequest, NextApiResponse } from 'next';

export default function exitPreview(
  _req: NextApiRequest,
  res: NextApiResponse,
) {
  res.clearPreviewData();
  res.redirect('/');
}
