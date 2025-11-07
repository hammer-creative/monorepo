// apps/web/src/lib/sanity/colors.ts

export const COLORS = {
  stealth: '#141515',
  aircutter: '#C7D3D3',
  alloy: '#778888',
  nimbus: '#C7D3D3',
  hyperbeam: '#0066CC',
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
