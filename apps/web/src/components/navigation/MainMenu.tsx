// apps/web/src/components/navigation/MainMenu.tsx
import { type MenuItem } from '@/types/navigation';
import { Menu } from './Menu';

interface MenuProps {
  items: MenuItem[];
}

export function MainMenu({ items }: MenuProps) {
  return (
    <Menu
      items={items}
      className="main-menu"
      itemClassName="main-menu-item"
      linkClassName="main-menu-link"
    />
  );
}
