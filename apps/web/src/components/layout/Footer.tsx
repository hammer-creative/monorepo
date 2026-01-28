// apps/web/src/components/Navigation/Footer.tsx
import { LinkList } from '@/components/common/LinkList';
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses, Copyright, Utilities } from '@/components/navigation';
import { type NavigationData } from '@/types/navigation';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="wrapper">
        <div className="group">
          <div className="item menu">
            <LinkList items={navigationData.main} />
          </div>
          <div className="item addresses">
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
