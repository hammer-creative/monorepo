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

// --- Module projections ---
export const moduleProjections = `
  _type,
  _key,

  _type == "heroModule" => {
    title,
    description,
    image {
      "url": asset->url,
      alt,
      "metadata": asset->metadata
    },
    backgroundColor
  },

  _type == "textModule" => {
    title,
    tag,
    bodyText,
    backgroundColor
  },

  _type == "textImageModule" => {
    title,
    image {
      "url": asset->url,
      alt,
      "metadata": asset->metadata
    },
    bodyText,
    backgroundColor
  },

  _type == "videoModule" => {
    backgroundColor,
    videos[]{
      _key,
      title,
      description,
      "video": video.asset->{
        playbackId,
        "aspectRatio": data.aspect_ratio,
        "thumbTime": data.max_stored_frame_time
      },
      poster{
        "url": asset->url,
        alt,
        "metadata": asset->metadata
      }
    }
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
