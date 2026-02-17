// components/navigation/RadixMenu.tsx
import { Arrow } from '@/components/common/Arrow';
import { ExtendedLink } from '@/components/common/ExtendedLink';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';

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
  onLinkClick?: (href: string, e: React.MouseEvent) => void;
  clickedHref?: string | null;
  setItemRef?: (id: string, element: HTMLElement | null) => void;
  showArrow?: boolean;
}

export function RadixMenu({
  items,
  className,
  itemClassName,
  linkClassName,
  onLinkClick,
  clickedHref,
  setItemRef,
  showArrow = true,
}: MenuProps) {
  return (
    <NavigationMenu.Root asChild>
      <nav {...(className && { className })}>
        <NavigationMenu.List>
          {items.map((item) => {
            const isClicked = clickedHref === item.href;

            return (
              <NavigationMenu.Item
                key={item.id}
                ref={(el) => setItemRef?.(item.id, el)}
                {...(itemClassName && { className: itemClassName })}
                {...(isClicked && { 'data-clicked': true })}
              >
                <ExtendedLink
                  href={item.href}
                  className={linkClassName}
                  onClick={onLinkClick}
                  preventNavigation={!!onLinkClick}
                >
                  {item.label}
                  {showArrow && <Arrow />}
                </ExtendedLink>
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </nav>
    </NavigationMenu.Root>
  );
}
