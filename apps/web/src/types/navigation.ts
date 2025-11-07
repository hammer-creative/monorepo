// apps/web/src/types/navigation.ts

export interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export interface FooterSection {
  id: string;
  title: string;
  items: MenuItem[];
}

export interface SocialMenuItem extends MenuItem {
  platform: string;
}

export interface NavigationData {
  wordmark: {
    text: string;
    href: string;
  };
  main: MenuItem[];
  footer: FooterSection[];
  social: SocialMenuItem[];
}

export interface NavigationContextState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}
