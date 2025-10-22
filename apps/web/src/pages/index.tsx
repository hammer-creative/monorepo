// apps/web/src/pages/index.tsx
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import type { GetStaticProps } from 'next';
import { fetchEntries } from '@chorusworks/contentful';

type Hero = {
  sys: {
    id: string;
  };
  fields: {
    title: string;
    body: any; // Rich text document
    slug: string;
  };
};

type PageProps = {
  heroes: Hero[];
};

export default function HomePage({ heroes }: PageProps) {
  return (
    <div>
      <h1>Heroes</h1>
      {heroes.map((hero) => (
        <div key={hero.sys.id}>
          <h2>{hero.fields.title}</h2>
          <div>{documentToReactComponents(hero.fields.body)}</div>
        </div>
      ))}
    </div>
  );
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
  const heroes = await fetchEntries('hero');

  return {
    props: {
      heroes,
    },
    revalidate: 60,
  };
};
