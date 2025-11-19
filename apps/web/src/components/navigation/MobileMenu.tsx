// apps/web/src/components/navigation/MobileMenu.tsx
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import Link from 'next/link';

const navData = navigationData as NavigationData;

export function MobileMenu() {
  const { isOpen, closeMenu } = useNavigation();

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) closeMenu();
      }}
    >
      <Dialog.Portal>
        <Dialog.Content className="mobile-menu-content">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>

          <nav className="mobile-menu-nav">
            <ul className="mobile-menu-list">
              {navData.main.map((item) => (
                <li key={item.id} className="mobile-menu-item">
                  <Link
                    href={item.href}
                    className="mobile-menu-link"
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
