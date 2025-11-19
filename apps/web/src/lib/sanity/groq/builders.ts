// apps/web/src/lib/sanity/groq/builders.ts

// apps/web/src/lib/sanity/groq/builders.ts

export const projections = {
  slug: `"slug": slug.current`,

  image: `
    image {
      asset,
      alt,
      crop,
      hotspot
    }
  `,

  imageItem: `
    image {
      asset,
      alt,
      crop,
      hotspot
    }
  `,

  poster: `
    poster {
      "asset": asset->,
      alt,
      crop,
      hotspot
    }
  `,

  videoItem: `
    _key,
    _type,
    title,
    video {
      "playbackId": asset->playbackId,
      "aspectRatio": asset->data.aspect_ratio
    },
    poster {
      "asset": asset->,
      alt,
      crop,
      hotspot
    }
  `,

  textBlock: `
    title,
    body
  `,

  color: `
    enabled,
    name
  `,

  services: `
    services[]-> {
      _id,
      name
    }
  `,

  deliverables: `
    deliverables[]-> {
      _id,
      name
    }
  `,
};

export const moduleProjections = `
  _key,
  _type,

  backgroundColor {
    ${projections.color}
  },

  _type == "heroModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    client->,
    ${projections.image}
  },

  _type == "textModule" => {
    title,
    tag,
    body,
    textColor {
      ${projections.color}
    }
  },

  _type == "textImageModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    ${projections.image}
  },

  _type == "videoModule" => {
    videos[] {
      ${projections.videoItem}
    }
  },

  _type == "carouselModule" => {
    images[] {
      _key,
      _type,
      ${projections.imageItem}
    }
  },

  _type == "impactModule" => {
    layout,
    textColor {
      ${projections.color}
    },
    ${projections.image},
    textBlock1 {
      ${projections.textBlock}
    },
    textBlock2 {
      ${projections.textBlock}
    },
    textBlock3 {
      ${projections.textBlock}
    }
  },

  _type == "servicesModule" => {
    ${projections.services}
  },

  _type == "deliverablesModule" => {
    ${projections.deliverables}
  }
`;
