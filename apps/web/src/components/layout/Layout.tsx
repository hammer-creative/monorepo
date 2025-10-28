// apps/web/src/components/layout/Layout.tsx

function Layout({ children }: { children: React.ReactNode }) {
  return <main className="layout-container">{children}</main>;
}

export default Layout;
