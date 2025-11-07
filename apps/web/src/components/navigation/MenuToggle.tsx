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
      <span className="menu-toggle-line" data-line="top" />
      <span className="menu-toggle-line" data-line="middle" />
      <span className="menu-toggle-line" data-line="bottom" />
    </button>
  );
}
