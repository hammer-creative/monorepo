// apps/web/src/components/navigation/SocialMenu.tsx
import { LinkList } from '@/components/ui/LinkList';
import type { MenuItem } from '@/types/navigation';

import { Copyright } from './Copyright';

interface SocialMenuProps {
  items: MenuItem[];
}

export function SocialMenu({ items }: SocialMenuProps) {
  return (
    <>
      <LinkList items={items} itemClassName="item" linkClassName="link" />
      <Copyright />
    </>
  );
}
