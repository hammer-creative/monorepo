// apps/web/src/components/navigation/MenuToggle.tsx
import { useNavigation } from '@/contexts/NavigationContext';
import * as Dialog from '@radix-ui/react-dialog';

export function MenuToggle() {
  const { isOpen } = useNavigation();

  return (
    <Dialog.Trigger asChild>
      <button
        className="menu-toggle"
        aria-expanded={isOpen}
        aria-label={isOpen ? 'Close menu' : 'Open menu'}
      >
        <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden>
          <circle cx="5" cy="5" r="5" fill="currentColor" />
        </svg>
        <span>{isOpen ? 'Less' : 'More'}</span>
      </button>
    </Dialog.Trigger>
  );
}
