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
  telephone?: string;
}

export interface NavigationData {
  wordmark: {
    text: string;
    href: string;
  };
  main: MenuItem[];
  legal: MenuItem[];
  social: MenuItem[];
  addresses: Address[];
}

export interface NavigationContextState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}
