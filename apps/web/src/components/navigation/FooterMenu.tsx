import Link from 'next/link';
import { FooterSection } from '@/types/navigation';

interface FooterMenuProps {
  sections: FooterSection[];
}

export function FooterMenu({ sections }: FooterMenuProps) {
  return (
    <nav className="footer-menu">
      {sections.map((section) => (
        <div key={section.id} className="footer-section">
          <h3 className="footer-section-title">{section.title}</h3>
          <ul className="footer-section-list">
            {section.items.map((item) => (
              <li key={item.id} className="footer-section-item">
                <Link href={item.href} className="footer-section-link">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}
