// apps/web/src/components/layout/Layout.tsx
import { Header, Footer } from '@/components/navigation';
import { MobileMenu } from '@/components/navigation/MobileMenu';
import navigationData from '@/data/navigation.json';
import { NavigationData } from '@/types/navigation';
import { ReactNode } from 'react';
import Headroom from 'react-headroom';

const navData = navigationData as NavigationData;

interface LayoutProps {
  children: ReactNode;
  pathname: string;
}

export function Layout({ children, pathname }: LayoutProps) {
  return (
    <>
      <Headroom tag="header" disableInlineStyles>
        <Header navigationData={navData} />
      </Headroom>

      <div id="wrapper" data-page={pathname} className="layout-container">
        <main>{children}</main>
        <Footer navigationData={navData} />
      </div>
    </>
  );
}
