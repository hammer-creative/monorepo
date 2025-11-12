// apps/web/src/lib/sanity/groq/builders.ts

export const projections = {
  slug: `"slug": slug.current`,

  image: `
    "url": asset->url,
    alt,
    "metadata": asset->metadata
  `,

  video: `
    "video": video.asset->{
      playbackId,
      "aspectRatio": data.aspect_ratio,
      "thumbTime": data.max_stored_frame_time
    }
  `,
};

// --- Module projections ---
export const moduleProjections = `
  _type,
  _key,

  _type == "heroModule" => {
    title,
    body,
    image {
      ${projections.image}
    },
    backgroundColor,
    textColor,
    client->{
      _id,
      name,
      slug
    }
  },

  _type == "textModule" => {
    tag,
    title,
    body,
    backgroundColor,
    textColor
  },

  _type == "textImageModule" => {
    title,
    body,
    image {
      ${projections.image}
    },
    backgroundColor,
    textColor
  },

  _type == "videoModule" => {
    backgroundColor,
    textColor,
    videos[]{
      _key,
      _type,
      title,
      ${projections.video},
      poster{
        ${projections.image}
      }
    }
  },

  _type == "impactModule" => {
    layout,
    textBlock1{
      title,
      body
    },
    textBlock2{
      title,
      body
    },
    textBlock3{
      title,
      body
    },
    image {
      ${projections.image},
      crop,
      hotspot
    },
    backgroundColor,
    textColor
  },
`;

export const filters = {
  published: `!(_id in path("drafts.**"))`,
  byType: (type: string) => `_type == "${type}"`,
};

export const orderings = {
  newest: `| order(_createdAt desc)`,
  oldest: `| order(_createdAt asc)`,
};
