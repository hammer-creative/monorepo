// apps/web/next-seo.config.ts

import { type DefaultSeoProps } from 'next-seo';

const SEO: DefaultSeoProps = {
  title: 'Hammer Creative',
  titleTemplate: 'Hammer Creative',
  defaultTitle: 'Hammer Creative',
  description:
    'Hammer Creative is a video game marketing agency partnering with publishers and studios to deliver strategy, creative, and campaigns that drive cultural impact.',
  canonical: 'https://hammercreative.com',
  openGraph: {
    url: 'https://hammercreative.com',
    title: 'Hammer Creative',
    description:
      'Hammer Creative is a video game marketing agency partnering with publishers and studios to deliver strategy, creative, and campaigns that drive cultural impact.',
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
    { name: 'msapplication-TileColor', content: '#141515' },
    { name: 'msapplication-config', content: '/favicons/browserconfig.xml' },
    { name: 'theme-color', content: '#141515' },
  ],
};

export default SEO;
