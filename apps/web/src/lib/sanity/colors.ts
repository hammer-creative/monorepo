// apps/web/src/lib/sanity/colors.ts
import { DEFAULT_COLORS } from '@hammercreative/ui';
import { stegaClean } from 'next-sanity';

export function resolveBackgroundColor(
  backgroundColor: { enabled?: boolean; name?: string } | null | undefined,
) {
  if (!backgroundColor?.enabled || !backgroundColor?.name) {
    return undefined;
  }

  const cleanName = stegaClean(backgroundColor.name);

  return {
    enabled: true,
    name: backgroundColor.name,
    hex: DEFAULT_COLORS[cleanName as keyof typeof DEFAULT_COLORS],
  };
}

export function resolveTextColor(
  textColor: { enabled?: boolean; name?: string } | null | undefined,
) {
  if (!textColor?.enabled || !textColor?.name) {
    return undefined;
  }

  const cleanName = stegaClean(textColor.name);

  return {
    enabled: true,
    name: textColor.name,
    hex: DEFAULT_COLORS[cleanName as keyof typeof DEFAULT_COLORS],
  };
}

export function resolveModuleColors<T extends Record<string, any>>(
  module: T,
): T {
  const resolved = { ...module } as any;

  if (resolved.backgroundColor) {
    resolved.backgroundColor = resolveBackgroundColor(resolved.backgroundColor);
  }

  if (resolved.textColor) {
    resolved.textColor = resolveTextColor(resolved.textColor);
  }

  return resolved;
}
