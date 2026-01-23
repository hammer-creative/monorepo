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

  teaserImage: `
    teaserImage {
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
      _type,
      asset-> {
        _id,
        _type,
        playbackId,
        data {
          aspect_ratio,
          max_stored_resolution,
          max_stored_frame_rate
        }
      }
    },
    poster {
      _type,
      asset {
        _ref,
        _type
      },
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

  clients: `clients[]-> {
    _id,
    name
  }`,

  caseStudyCard: `caseStudies[]-> {
    _id,
    title,
    "slug": slug.current
  }`,
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
    ${projections.image},
    ${projections.teaserImage},
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
    caseStudies[]-> {
      _id,
      title,
      ${projections.slug},
      ${projections.clients},
      modules[_type == "heroModule"] {
        ${projections.teaserImage}
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

export const caseStudyProjection = `
  _id,
  title,
  ${projections.slug},
  ${projections.clients},
  modules[] {
    ${moduleProjections}
  }
`;
