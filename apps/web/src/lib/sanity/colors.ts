// apps/web/src/lib/sanity/colors.ts

export const COLORS = {
  nightshade: '#141515',
  sandstorm: '#778888',
  aircutter: '#C7D3D3',
  hyperbeam: '#FFCC98',
  hydroblast: '#35808D',
  vinewhip: '#274040',
} as const;

export function resolveBackgroundColor(
  backgroundColor: { enabled: boolean; name: string } | null | undefined,
) {
  if (!backgroundColor?.enabled || !backgroundColor?.name) {
    return null;
  }

  return {
    enabled: true,
    name: backgroundColor.name,
    hex: COLORS[backgroundColor.name as keyof typeof COLORS],
  };
}
