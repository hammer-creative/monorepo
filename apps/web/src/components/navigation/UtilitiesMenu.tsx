// apps/web/src/components/navigation/UtilitiesMenu.tsx
import { ExtendedLink } from '@/components/common/ExtendedLink';
import type { MenuItem } from '@/types/navigation';

interface UtilitiesProps {
  items: MenuItem[];
}

export function UtilitiesMenu({ items }: UtilitiesProps) {
  return (
    <>
      {items.map((link) => (
        <ExtendedLink key={link.id} href={link.href} className={link.className}>
          {link.label}
        </ExtendedLink>
      ))}
    </>
  );
}
