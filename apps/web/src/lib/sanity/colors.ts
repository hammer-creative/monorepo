// apps/web/src/lib/sanity/colors.ts
import { DEFAULT_COLORS } from '@hammercreative/ui';

type ColorWithHex = {
  enabled: boolean;
  name: string;
  hex: string;
};

export function resolveBackgroundColor(
  backgroundColor: { enabled?: boolean; name?: string } | null | undefined,
): ColorWithHex | undefined {
  if (!backgroundColor?.enabled || !backgroundColor?.name) {
    return undefined;
  }

  return {
    enabled: true,
    name: backgroundColor.name,
    hex: DEFAULT_COLORS[backgroundColor.name as keyof typeof DEFAULT_COLORS],
  };
}

export function resolveTextColor(
  textColor: { enabled?: boolean; name?: string } | null | undefined,
): ColorWithHex | undefined {
  if (!textColor?.enabled || !textColor?.name) {
    return undefined;
  }

  return {
    enabled: true,
    name: textColor.name,
    hex: DEFAULT_COLORS[textColor.name as keyof typeof DEFAULT_COLORS],
  };
}

export function resolveModuleColors<T extends Record<string, unknown>>(
  module: T,
): T & { backgroundColor?: ColorWithHex; textColor?: ColorWithHex } {
  const resolved = { ...module } as T & {
    backgroundColor?: ColorWithHex;
    textColor?: ColorWithHex;
  };

  if (resolved.backgroundColor) {
    resolved.backgroundColor = resolveBackgroundColor(resolved.backgroundColor);
  }

  if (resolved.textColor) {
    resolved.textColor = resolveTextColor(resolved.textColor);
  }

  return resolved;
}
