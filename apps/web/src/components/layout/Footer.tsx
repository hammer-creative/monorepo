// apps/web/src/components/Navigation/Footer.tsx
import { ExtendedLink } from '@/components/common/ExtendedLink';
import { LinkList } from '@/components/common/LinkList';
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses, Copyright, UtilitiesMenu } from '@/components/navigation';
import { type NavigationData } from '@/types/navigation';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="footer-content">
        <nav className="menu-primary" aria-label="Main navigation">
          <ul>
            {navigationData.main.map((item) => (
              <li key={item.id}>
                <ExtendedLink href={item.href}>{item.label}</ExtendedLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="menu-secondary addresses">
          <Addresses items={navigationData.addresses} />
        </div>
        <div className="menu-secondary utilities">
          <UtilitiesMenu />
        </div>
        <div className="menu-secondary social">
          <LinkList items={navigationData.social} />
          <Copyright />
        </div>
      </div>
      <div className="wordmark">
        <Wordmark
          text={navigationData.wordmark.text}
          href={navigationData.wordmark.href}
        />
      </div>
    </footer>
  );
}
