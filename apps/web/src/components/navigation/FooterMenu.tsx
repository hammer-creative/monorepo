// apps/web/src/components/Navigation/FooterMenu.tsx
import { MenuItem } from '@/types/navigation';
import { Menu } from './Menu';

interface MenuProps {
  items: MenuItem[];
}

export function FooterMenu({ items }: MenuProps) {
  return (
    <Menu
      items={items}
      className="footer-menu"
      listClassName="footer-menu-list"
      itemClassName="footer-menu-item"
      linkClassName="footer-menu-link"
    />
  );
}
