// apps/web/src/lib/sanity/colors.ts
import type { Module } from '@/types/sanity';
import { DEFAULT_COLORS } from '@chorusworks/ui';

export function resolveBackgroundColor(
  backgroundColor: { enabled: boolean; name: string } | null | undefined,
) {
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
  textColor: { enabled: boolean; name: string } | null | undefined,
) {
  if (!textColor?.enabled || !textColor?.name) {
    return undefined;
  }

  return {
    enabled: true,
    name: textColor.name,
    hex: DEFAULT_COLORS[textColor.name as keyof typeof DEFAULT_COLORS],
  };
}

export function resolveModuleColors<T extends Module>(module: T): T {
  const resolved = { ...module } as any;

  if (resolved.backgroundColor) {
    resolved.backgroundColor = resolveBackgroundColor(resolved.backgroundColor);
  }

  if (resolved.textColor) {
    resolved.textColor = resolveTextColor(resolved.textColor);
  }

  return resolved;
}
