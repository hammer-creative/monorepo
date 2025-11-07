// apps/web/src/lib/sanity/groq/builders.ts

// apps/web/src/lib/sanity/groq/builders.ts

export const projections = {
  slug: `"slug": slug.current`,

  video: `
    "video": video.asset->{
      playbackId,
      "aspectRatio": data.aspect_ratio,
      "thumbTime": data.max_stored_frame_time
    }
  `,
};

// --- Only heroModule, everything else ignored ---
export const moduleProjections = `
  _type,
  _key,
  _type == "heroModule" => {
    heading,
    description,
    backgroundColor
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
