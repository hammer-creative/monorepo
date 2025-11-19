// apps/web/src/components/Navigation/Footer.tsx
import { Wordmark } from '@/components/common/Wordmark';
import { NavigationData } from '@/types/navigation';
import { Addresses } from './Addresses';
import { Copyright } from './Copyright';
import { FooterMenu } from './FooterMenu';
import { SocialMenu } from './SocialMenu';

interface FooterProps {
  navigationData: NavigationData;
}

export function Footer({ navigationData }: FooterProps) {
  return (
    <footer className="footer">
      <div className="footer-container flex">
        <div className="footer-column flex-item">
          <FooterMenu items={navigationData.main} />
          <Addresses items={navigationData.addresses} />
        </div>
        <div className="footer-column flex-item">
          <a href="mailto:">info@hammercreative.com</a>
          <a href="/">Privacy Policy</a>
        </div>
        <div className="footer-column flex-item">
          <SocialMenu items={navigationData.social} />
          <Copyright />
        </div>
        <div className="footer-column flex-item">
          <Wordmark
            text={navigationData.wordmark.text}
            href={navigationData.wordmark.href}
          />
        </div>
      </div>
    </footer>
  );
}
