// apps/web/src/components/Navigation/Footer.tsx
import { NavigationData } from '@/types/navigation';
import { FooterMenu } from './FooterMenu';
import { SocialMenu } from './SocialMenu';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-container">
        <FooterMenu sections={navigationData.footer} />
        <SocialMenu items={navigationData.social} />
      </div>
    </footer>
  );
}
