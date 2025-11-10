// apps/web/src/components/navigation/MainMenu.tsx
import { MenuItem } from '@/types/navigation';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

interface MainMenuProps {
  items: MenuItem[];
}

export function MainMenu({ items }: MainMenuProps) {
  return (
    <NavigationMenu.Root className="main-menu">
      <NavigationMenu.List className="main-menu-list">
        {items.map((item) => (
          <NavigationMenu.Item key={item.id} className="main-menu-item">
            <NavigationMenu.Link asChild>
              <Link href={item.href} className="main-menu-link">
                {item.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
