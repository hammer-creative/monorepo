import type { NextApiRequest, NextApiResponse } from 'next';

export default function preview(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  res.setPreviewData({});
  res.redirect(`/${slug}`);
}
