// apps/web/src/components/navigation/SocialMenu.tsx
import { LinkList } from '@/components/common/LinkList';
import type { MenuItem } from '@/types/navigation';

interface SocialMenuProps {
  items: MenuItem[];
}

export function SocialMenu({ items }: SocialMenuProps) {
  return (
    <>
      <LinkList items={items} itemClassName="item" linkClassName="link" />
    </>
  );
}
