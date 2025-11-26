// apps/web/src/pages/api/disable-draft.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handle(
  _req: NextApiRequest,
  res: NextApiResponse<void>,
): void {
  res.setDraftMode({ enable: false });
  res.writeHead(307, { Location: '/' });
  res.end();
}
