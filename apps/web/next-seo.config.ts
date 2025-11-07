import { DefaultSeoProps } from 'next-seo';

const SEO: DefaultSeoProps = {
  title: 'YVML Capital Campaign',
  titleTemplate: 'YVML Capital Campaign',
  defaultTitle: 'YVML Capital Campaign',
  description:
    'An independent creative marketing studio built to subvert expectations.',
  canonical: 'https://campaign.yvml.org',
  openGraph: {
    url: 'https://campaign.yvml.org',
    title: 'YVML Yucca Valley Material Lab',
    description:
      'Yucca Valley Material Lab is dedicated to hands-on learning, transformative residencies, and community engagement in the Mojave Desert.',
    type: 'website',
    locale: 'en_US',
    site_name: 'Yucca Valley Material Lab Capital Campaign',
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
      content: 'Yucca Valley Material Lab Capital Campaign',
    },
    {
      property: 'dc:creator',
      content: 'Yucca Valley Material Lab Capital Campaign',
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
