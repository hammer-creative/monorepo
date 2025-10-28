// apps/web/src/utils/fontConfig.ts
import localFont from 'next/font/local';

export const DIATYPE_MEDIUM = localFont({
  src: [
    { path: '../../public/fonts/diatype/ABCDiatype-Medium.woff2' },
    { path: '../../public/fonts/diatype/ABCDiatype-Medium.woff' },
  ],
  display: 'swap',
  variable: '--font-diatype-medium',
});

export const DIATYPE_MEDIUM_ITALIC = localFont({
  src: [
    { path: '../../public/fonts/diatype/ABCDiatype-MediumItalic.woff2' },
    { path: '../../public/fonts/diatype/ABCDiatype-MediumItalic.woff' },
  ],
  display: 'swap',
  variable: '--font-diatype-medium-italic',
});

export const MOHOL_REGULAR = localFont({
  src: [
    { path: '../../public/fonts/mohol/Mohol-Regular.woff2' },
    { path: '../../public/fonts/mohol/Mohol-Regular.woff' },
  ],
  display: 'swap',
  variable: '--font-mohol-regular',
});

export const MOHOL_BOLD = localFont({
  src: [
    { path: '../../public/fonts/mohol/Mohol-Bold.woff2' },
    { path: '../../public/fonts/mohol/Mohol-Bold.woff' },
  ],
  display: 'swap',
  variable: '--font-diatype-mohol-bold',
});
