// apps/web/src/components/navigation/FooterMenu.tsx
import { LinkList } from '@/components/ui/LinkList';
import { MenuItem } from '@/types/navigation';

interface MenuProps {
  items: MenuItem[];
}

export function FooterMenu({ items }: MenuProps) {
  return <LinkList items={items} itemClassName="item" linkClassName="link" />;
}
