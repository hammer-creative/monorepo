// apps/web/src/components/navigation/Header.tsx
import { Wordmark } from '@/components/common';
import { NavigationData } from '@/types/navigation';
import { MainMenu } from './MainMenu';
import { MenuToggle } from './MenuToggle';
import { MobileMenu } from './MobileMenu';

interface HeaderProps {
  navigationData: NavigationData;
}

export function Header({ navigationData }: HeaderProps) {
  return (
    <header className="header">
      <div className="header-container">
        <Wordmark
          text={navigationData.wordmark.text}
          href={navigationData.wordmark.href}
        />

        <MainMenu items={navigationData.main} />

        <MenuToggle />

        <MobileMenu items={navigationData.main} />
      </div>
    </header>
  );
}
