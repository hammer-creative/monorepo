// components/navigation/RadixMenu.tsx
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
}

/**
 * RadixMenu Component
 *
 * Navigation menu using Radix UI primitives.
 * Renders menu items with arrow SVG indicators.
 *
 * @param items - Menu items to render
 * @param className - Optional class for nav element
 * @param itemClassName - Optional class for menu items
 * @param linkClassName - Optional class for links
 * @param onLinkClick - Click handler for links
 * @param clickedHref - Currently clicked href to apply data-clicked attribute
 * @param setItemRef - Ref callback to collect item element refs
 */
export function RadixMenu({
  items,
  className,
  itemClassName,
  linkClassName,
  onLinkClick,
  clickedHref,
  setItemRef,
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
                  <svg
                    width="1em"
                    height="1em"
                    viewBox="0 0 63 64"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect
                      x="2.00171"
                      width="46"
                      height="15"
                      fill="currentColor"
                    />
                    <rect
                      x="63.001"
                      width="61"
                      height="15"
                      transform="rotate(90 63.001 0)"
                      fill="currentColor"
                    />
                    <rect
                      x="60.1846"
                      y="14.3341"
                      width="70.1072"
                      height="15.0063"
                      transform="rotate(135 60.1846 14.3341)"
                      fill="currentColor"
                    />
                  </svg>
                </ExtendedLink>
              </NavigationMenu.Item>
            );
          })}
        </NavigationMenu.List>
      </nav>
    </NavigationMenu.Root>
  );
}
