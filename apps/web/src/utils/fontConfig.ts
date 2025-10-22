// apps/web/src/utils/fontConfig.ts
import localFont from 'next/font/local';

export const DIATYPE_MEDIUM = localFont({
  src: [
    { path: '../../public/fonts/diatype/ABCDiatype-Medium-Trial.woff2' },
    { path: '../../public/fonts/diatype/ABCDiatype-Medium-Trial.woff' },
  ],
  display: 'swap',
  variable: '--font-diatype-medium',
});

export const DIATYPE_MEDIUM_ITALIC = localFont({
  src: [
    { path: '../../public/fonts/diatype/ABCDiatype-MediumItalic-Trial.woff2' },
    { path: '../../public/fonts/diatype/ABCDiatype-MediumItalic-Trial.woff' },
  ],
  display: 'swap',
  variable: '--font-diatype-medium-italic',
});
