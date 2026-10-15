// apps/web/src/components/Video/utils.ts
import { stegaClean } from 'next-sanity';

// The preview site fetches drafts with stega on, which appends invisible characters to strings
// like "9:16"; without cleaning, Number("16\u200b...") is NaN and every video falls back to 16 / 9.
export function parseAspectRatio(ratio: string | number | undefined): string {
  const value = typeof ratio === 'string' ? stegaClean(ratio) : ratio;
  if (typeof value === 'string' && value.includes(':')) {
    const [w, h] = value.split(':').map(Number);
    return w && h ? `${w} / ${h}` : '16 / 9';
  }
  return typeof value === 'string' ? value : '16 / 9';
}

export function getPosterUrl(video: { poster?: { asset?: { url?: string } } }): string {
  return video.poster?.asset?.url || '';
}
