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
  videoItem: `
    _key,
    _type,
    title,
    video {
      asset->
    },
    poster {
      asset->,
      alt
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

  // Hero Module
  _type == "heroModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    client->,
    ${projections.image}
  },

  // Text Module
  _type == "textModule" => {
    title,
    tag,
    body,
    textColor {
      ${projections.color}
    }
  },

  // Text + Image Module
  _type == "textImageModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    ${projections.image}
  },

  // Video Module
  _type == "videoModule" => {
    videos[] {
      ${projections.videoItem}
    }
  },

  // Carousel Module (Multi Image)
  _type == "carouselModule" => {
    images[] {
      _key,
      _type,
      ${projections.imageItem}
    }
  },

  // Impact Module
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
    }
  }
`;
