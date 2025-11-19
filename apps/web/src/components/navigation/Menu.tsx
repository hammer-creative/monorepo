// apps/web/src/components/navigation/Menu.tsx
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import Link from 'next/link';

interface MenuItem {
  id: string;
  href: string;
  label: string;
}

interface MenuProps {
  items: MenuItem[];
  className?: string;
  listClassName?: string;
  itemClassName?: string;
  linkClassName?: string;
}

export function Menu({
  items,
  className = '',
  listClassName = '',
  itemClassName = '',
  linkClassName = '',
}: MenuProps) {
  return (
    <NavigationMenu.Root className={className}>
      <NavigationMenu.List className={listClassName}>
        {items.map((item) => (
          <NavigationMenu.Item key={item.id} className={itemClassName}>
            <NavigationMenu.Link asChild>
              <Link href={item.href} className={linkClassName}>
                {item.label}
              </Link>
            </NavigationMenu.Link>
          </NavigationMenu.Item>
        ))}
      </NavigationMenu.List>
    </NavigationMenu.Root>
  );
}
