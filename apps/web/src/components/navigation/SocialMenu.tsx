// apps/web/src/components/navigation/SocialMenu.tsx
import { SocialMenuItem } from '@/types/navigation';
import Link from 'next/link';

interface SocialMenuProps {
  items: SocialMenuItem[];
}

export function SocialMenu({ items }: SocialMenuProps) {
  return (
    <nav className="social-menu">
      <ul className="social-menu-list">
        {items.map((item) => (
          <li key={item.id} className="social-menu-item">
            <Link
              href={item.href}
              className="social-menu-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
