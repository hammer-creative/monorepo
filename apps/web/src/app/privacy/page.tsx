// src/app/privacy/page.tsx
import { TextBlock } from '@/components/common';
import { client, getBasicPage } from '@/lib/sanity';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  openGraph: {
    title: 'Privacy Policy',
    type: 'website',
  },
};

export const revalidate = 60;

export default async function PrivacyPage() {
  const privacyPage = await getBasicPage('privacy', client);

  if (!privacyPage) return null;

  return (
    <div className="layout-container">
      <div className="layout-wrapper">
        <article className="privacy-policy">
          <h1>{privacyPage.title}</h1>

          <TextBlock body={privacyPage.body} />
        </article>
      </div>
    </div>
  );
}
