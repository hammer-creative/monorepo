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
    name,
    hex
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
    ${projections.image},
    services[]-> {
      _id,
      title
    },
    deliverables[]-> {
      _id,
      title
    }
  },
  _type == "servicesPageHeroModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    ${projections.image}
  },
  _type == "servicesPageCardModule" => {
    title,
    body,
    textColor {
      ${projections.color}
    },
    ${projections.image},
    services[]-> {
      _id,
      title
    }
  },
  _type == "caseStudyCardModule" => {
    textColor {
      ${projections.color}
    },
    caseStudies[]-> {
      _id,
      title,
      ${projections.slug},
      modules[_type == "heroModule"][0] {
        client->,
        title,
        ${projections.image}
      }
    }
  },
  _type == "textModule" => {
    layout,
    title,
    tag,
    body,
    textColor {
      ${projections.color}
    }
  },
  _type == "textImageModule" => {
    layout,
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
  }
`;
