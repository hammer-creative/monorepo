import Link from 'next/link';
import * as Dialog from '@radix-ui/react-dialog';
import { useNavigation } from '@/contexts/NavigationContext';
import { MenuItem } from '@/types/navigation';

interface MobileMenuProps {
  items: MenuItem[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const { isOpen, closeMenu } = useNavigation();

  return (
    <Dialog.Root open={isOpen} onOpenChange={closeMenu}>
      <Dialog.Portal>
        <Dialog.Overlay className="mobile-menu-overlay" />
        <Dialog.Content className="mobile-menu-content">
          <Dialog.Title className="mobile-menu-title">Menu</Dialog.Title>
          <Dialog.Close className="mobile-menu-close">Close</Dialog.Close>
          
          <nav className="mobile-menu-nav">
            <ul className="mobile-menu-list">
              {items.map((item) => (
                <li key={item.id} className="mobile-menu-item">
                  <Link href={item.href} className="mobile-menu-link" onClick={closeMenu}>
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
