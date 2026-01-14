import { type DefaultSeoProps } from 'next-seo';

const SEO: DefaultSeoProps = {
  title: 'Hammer Creative',
  titleTemplate: 'Hammer Creative',
  defaultTitle: 'Hammer Creative',
  description: 'The Gaming Agency',
  canonical: 'https://hammercreative.com',
  openGraph: {
    url: 'https://hammercreative.com',
    title: 'Hammer Creative',
    description: 'The Gaming Agency',
    type: 'website',
    locale: 'en_US',
    site_name: 'Hammer Creative',
  },
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'theme-color',
      content: '#2d89ef',
    },
    {
      name: 'author',
      content: 'Hammer Creative',
    },
    {
      property: 'dc:creator',
      content: 'Hammer Creative',
    },
    { name: 'msapplication-TileColor', content: '#2d89ef' },
    { name: 'msapplication-config', content: '/favicons/browserconfig.xml' },
    { name: 'theme-color', content: '#2d89ef' },
  ],
  // additionalLinkTags: [
  //   { rel: 'icon', href: '/favicons/favicon-16x16.png', sizes: '16x16' },
  //   { rel: 'icon', href: '/favicons/favicon-32x32.png', sizes: '32x32' },
  //   {
  //     rel: 'icon',
  //     href: '/favicons/android-chrome-192x192.png',
  //     sizes: '192x192',
  //   },
  //   {
  //     rel: 'icon',
  //     href: '/favicons/android-chrome-512x512.png',
  //     sizes: '512x512',
  //   },
  //   {
  //     rel: 'apple-touch-icon',
  //     href: '/favicons/apple-touch-icon-precomposed.png',
  //     sizes: '180x180',
  //   },
  //   {
  //     rel: 'apple-touch-icon',
  //     href: '/favicons/apple-touch-icon.png',
  //     sizes: '180x180',
  //   },
  //   { rel: 'manifest', href: '/favicons/site.webmanifest' },
  //   {
  //     rel: 'mask-icon',
  //     href: '/favicons/safari-pinned-tab.svg',
  //     color: '#5bbad5',
  //   },
  //   { rel: 'shortcut icon', href: '/favicons/favicon.ico' },
  // ],
};

export default SEO;
