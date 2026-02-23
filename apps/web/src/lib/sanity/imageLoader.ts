// apps/web/src/lib/sanity/imageLoader.ts

export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  const url = new URL(src);
  const refW = Number(url.searchParams.get('w'));
  const refH = Number(url.searchParams.get('h'));
  url.searchParams.set('w', String(width));
  url.searchParams.set('q', String(quality ?? 90));
  if (refW && refH) {
    url.searchParams.set('h', String(Math.round(width * (refH / refW))));
  }
  return url.toString();
}
