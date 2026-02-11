// apps/web/src/config/jsonld.ts
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hammer Creative',
  alternateName: 'Hammer',
  url: 'https://hammercreative.com',
  logo: 'https://hammercreative.com/logo.png',
  description: 'The Gaming Agency',
  email: 'contact@hammercreative.com',
  telephone: '+1-XXX-XXX-XXXX',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '123 Street Name',
    addressLocality: 'City',
    addressRegion: 'State',
    postalCode: '12345',
    addressCountry: 'US',
  },
  sameAs: [
    'https://twitter.com/hammercreative',
    'https://facebook.com/hammercreative',
    'https://instagram.com/hammercreative',
    'https://linkedin.com/company/hammercreative',
  ],
};

export const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Hammer Creative',
  url: 'https://hammercreative.com',
  description: 'The Gaming Agency',
  publisher: {
    '@type': 'Organization',
    name: 'Hammer Creative',
  },
};
