// apps/web/src/lib/sanity/groq/builders.ts

export const projections = {
  slug: `"slug": slug.current`,
};

export const moduleProjections = `
  _type,
  _key,
  _type == "heroModule" => {
    heading
  }
`;

export const filters = {
  published: `!(_id in path("drafts.**"))`,
  byType: (type: string) => `_type == "${type}"`,
};

export const orderings = {
  newest: `| order(_createdAt desc)`,
  oldest: `| order(_createdAt asc)`,
};
