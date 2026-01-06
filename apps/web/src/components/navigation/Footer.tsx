// apps/web/src/components/Navigation/Footer.tsx
import { Wordmark } from '@/components/common/Wordmark';
import { type NavigationData } from '@/types/navigation';

import { Addresses } from './Addresses';
import { FooterMenu } from './FooterMenu';
import { SocialMenu } from './SocialMenu';
import { Utilities } from './Utitities';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="flex">
        <div className="flex-item group">
          <div className="menu">
            <FooterMenu items={navigationData.main} />
          </div>
          <div className="addresses">
            <Addresses items={navigationData.addresses} />
          </div>
        </div>
        <div className="flex-item utilities">
          <Utilities />
        </div>
        <div className="flex-item social">
          <SocialMenu items={navigationData.social} />
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
