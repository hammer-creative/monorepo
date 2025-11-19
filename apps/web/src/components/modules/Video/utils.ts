// apps/web/src/components/Video/utils.ts
export function parseAspectRatio(ratio: string | number | undefined): string {
  if (typeof ratio === 'string' && ratio.includes(':')) {
    const [w, h] = ratio.split(':').map(Number);
    return w && h ? `${w} / ${h}` : '16 / 9';
  }
  return typeof ratio === 'string' ? ratio : '16 / 9';
}

export function getPosterUrl(video: {
  poster?: { asset?: { url?: string } };
}): string {
  return video.poster?.asset?.url || '';
}
