// apps/web/src/utils/textUtils.ts

export function toKebab(str: string) {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2') // camelCase → camel-case
    .replace(/\s+/g, '-') // spaces → hyphens
    .toLowerCase();
}
