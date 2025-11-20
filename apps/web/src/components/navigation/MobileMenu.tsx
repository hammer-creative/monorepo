// apps/web/src/components/navigation/MobileMenu.tsx
import { LinkList } from '@/components/ui/LinkList';
import { useNavigation } from '@/contexts/NavigationContext';
import navigationData from '@/data/navigation.json';
import type { NavigationData } from '@/types/navigation';
import * as Dialog from '@radix-ui/react-dialog';

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
            <LinkList
              items={navData.main}
              className="mobile-menu-list"
              itemClassName="mobile-menu-item"
              linkClassName="mobile-menu-link"
              onLinkClick={closeMenu}
            />
          </nav>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
