// apps/web/src/components/navigation/Menu.tsx
// Keep this for main navigation with Radix NavigationMenu
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
  itemClassName?: string;
  linkClassName?: string;
}

export function Menu({
  items,
  className,
  itemClassName,
  linkClassName,
}: MenuProps) {
  return (
    <NavigationMenu.Root asChild>
      <nav {...(className && { className })}>
        <NavigationMenu.List>
          {items.map((item) => (
            <NavigationMenu.Item
              key={item.id}
              {...(itemClassName && { className: itemClassName })}
            >
              <NavigationMenu.Link asChild>
                <Link
                  href={item.href}
                  {...(linkClassName && { className: linkClassName })}
                >
                  {item.label}
                </Link>
              </NavigationMenu.Link>
            </NavigationMenu.Item>
          ))}
        </NavigationMenu.List>
      </nav>
    </NavigationMenu.Root>
  );
}
