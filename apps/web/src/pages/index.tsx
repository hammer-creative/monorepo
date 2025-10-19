import { contentfulClient } from '@chorusworks/contentful';

export async function getStaticProps() {
  const client = contentfulClient();
  const entries = await client.getEntries();
  return { props: { count: entries.items.length } };
}

export default function Home({ count }: { count: number }) {
  return <div>Entries: {count}</div>;
}
