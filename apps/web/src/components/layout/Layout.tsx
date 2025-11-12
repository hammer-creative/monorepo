// apps/web/src/components/layout/Layout.tsx
import { Header, Footer } from '@/components/navigation';
import navigationData from '@/data/navigation.json';
import { NavigationData } from '@/types/navigation';
import { ReactNode } from 'react';

const navData = navigationData as NavigationData;

interface LayoutProps {
  children: ReactNode;
}

// export function Layout({ children }: LayoutProps) {
//   return (
//     <>
//       <Header navigationData={navData} />
//       <main className="layout-container">{children}</main>
//       <Footer navigationData={navData} />
//     </>
//   );
// }

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <main className="layout-container">{children}</main>
    </>
  );
}
