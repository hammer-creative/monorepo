// apps/web/src/types/navigation.ts

export interface MenuItem {
  id: string;
  label: string;
  href: string;
}

export interface Address {
  id: string;
  label: string;
  line1: string;
}

export interface SocialMenuItem {
  id: string;
  label: string;
  href: string;
}

export interface NavigationData {
  wordmark: {
    text: string;
    href: string;
  };
  main: MenuItem[];
  addresses: Address[];
  legal: MenuItem[];
  social: SocialMenuItem[];
}

export interface NavigationContextState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}
