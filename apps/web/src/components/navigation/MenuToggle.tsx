// apps/web/src/components/navigation/MenuToggle.tsx
import { useNavigation } from '@/contexts/NavigationContext';

export function MenuToggle() {
  const { isOpen, toggleMenu } = useNavigation();

  return (
    <button
      onClick={toggleMenu}
      className="menu-toggle"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <svg
        width="10"
        height="10"
        viewBox="0 0 10 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="5" cy="5" r="5" fill="currentColor" />
      </svg>
      <span>{isOpen ? 'Less' : 'More'}</span>
    </button>
  );
}
