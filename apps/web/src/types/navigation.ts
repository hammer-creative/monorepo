// apps/web/src/types/navigation.ts

export interface MenuItem {
  id: string;
  label: string;
  href: string;
  className?: string;
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
  addresses: Address[];
  legal: MenuItem[];
  main: MenuItem[];
  social: MenuItem[];
  utilities: MenuItem[];
}

export interface NavigationContextState {
  isOpen: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  openMenu: () => void;
}
