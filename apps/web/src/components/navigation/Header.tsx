import { Wordmark } from './Wordmark';
import { MainMenu } from './MainMenu';
import { MobileMenu } from './MobileMenu';
import { MenuToggle } from './MenuToggle';
import { NavigationData } from '@/types/navigation';

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
