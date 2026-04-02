// apps/web/src/components/Navigation/Footer.tsx
import { Copyright } from '@/components/common';
import { LinkList } from '@/components/common/LinkList';
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses } from '@/components/navigation';
import { type NavigationData } from '@/types/navigation';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="footer-content">
        <nav aria-label="Main navigation" className="menu-primary">
          <LinkList items={navigationData.main} />
        </nav>
        <div className="menu-secondary addresses">
          <Addresses items={navigationData.addresses} />
        </div>
        <div className="menu-secondary utilities">
          <LinkList items={navigationData.utilities} />
        </div>
        <div className="menu-secondary social">
          <LinkList items={navigationData.social} />
        </div>
        <div className="menu-secondary copyright">
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
