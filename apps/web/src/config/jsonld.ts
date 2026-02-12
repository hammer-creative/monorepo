// apps/web/src/config/jsonld.ts
export const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Hammer Creative',
  alternateName: 'Hammer',
  url: 'https://hammercreative.com',
  logo: 'https://hammercreative.com/logo.png',
  description: 'The Gaming Agency',
  email: 'info@hammercreative.com',
  telephone: '+1-323-606-4700',
  address: {
    '@type': 'PostalAddress',
    streetAddress: '4130 Cahuenga Blvd. Suite 113',
    addressLocality: 'Los Angeles',
    addressRegion: 'California',
    postalCode: '91602',
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
