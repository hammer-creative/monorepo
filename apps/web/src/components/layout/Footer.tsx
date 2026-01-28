// apps/web/src/components/Navigation/Footer.tsx
import { LinkList } from '@/components/common/LinkList';
import { Wordmark } from '@/components/common/Wordmark';
import { Addresses, Copyright, UtilitiesMenu } from '@/components/navigation';
import { RadixMenu } from '@/components/navigation/RadixMenu';
import { type NavigationData } from '@/types/navigation';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer>
      <div className="wrapper">
        <RadixMenu
          items={navigationData.main}
          className="menu-primary"
          showArrow={false}
        />
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
