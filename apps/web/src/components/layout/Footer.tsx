// apps/web/src/components/Navigation/Footer.tsx
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses, Copyright, Utilities } from '@/components/navigation';
import { LinkList } from '@/components/ui/LinkList';
import { type NavigationData } from '@/types/navigation';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="item group">
        <div className="menu">
          <LinkList items={navigationData.main} />
        </div>
        <div className="addresses">
          <Addresses items={navigationData.addresses} />
        </div>
      </div>
      <div className="item utilities">
        <Utilities />
      </div>
      <div className="item social">
        <LinkList items={navigationData.social} />
        <Copyright />
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
