import Link from 'next/link';
import { SocialMenuItem } from '@/types/navigation';

interface SocialMenuProps {
  items: SocialMenuItem[];
}

export function SocialMenu({ items }: SocialMenuProps) {
  return (
    <nav className="social-menu">
      <ul className="social-menu-list">
        {items.map((item) => (
          <li key={item.id} className="social-menu-item">
            <Link href={item.href} className="social-menu-link" target="_blank" rel="noopener noreferrer">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
