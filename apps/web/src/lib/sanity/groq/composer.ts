// apps/web/src/lib/sanity/groq/composer.ts

type QueryParts = {
  type: string;
  filter?: string;
  projection?: string;
  ordering?: string;
  slice?: [number, number];
};

export class GroqQuery {
  private parts: QueryParts;

  constructor(type: string) {
    this.parts = { type };
  }

  filter(condition: string) {
    this.parts.filter = condition;
    return this;
  }

  select(projection: string) {
    this.parts.projection = projection;
    return this;
  }

  order(ordering: string) {
    this.parts.ordering = ordering;
    return this;
  }

  limit(start: number, end: number) {
    this.parts.slice = [start, end];
    return this;
  }

  build(): string {
    const { type, filter, projection, ordering, slice } = this.parts;

    let query = `*[_type == "${type}"`;

    if (filter) {
      query += ` && ${filter}`;
    }

    query += `]`;

    if (ordering) {
      query += ` | order(${ordering})`;
    }

    if (slice) {
      query += ` [${slice[0]}...${slice[1]}]`;
    }

    if (projection) {
      query += ` { ${projection} }`;
    }

    return query;
  }
}
