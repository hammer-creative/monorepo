// components/portable-text/PortableTextRenderer.tsx
import { PortableText, PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Image from 'next/image';
import Link from 'next/link';

interface PortableTextRendererProps {
  value: PortableTextBlock[];
  className?: string;
}

// Custom link component that handles both internal and external links
function SmartLink({ value, children }: any) {
  const href = value?.href || '';
  const isInternal = href.startsWith('/') || href.startsWith('#');
  const isExternal = href.startsWith('http');

  if (isInternal) {
    return (
      <Link href={href} className="underline hover:no-underline">
        {children}
      </Link>
    );
  }

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:no-underline"
      >
        {children}
      </a>
    );
  }

  return <span>{children}</span>;
}

// Custom image component with Next.js Image optimization
function PortableImage({ value }: any) {
  if (!value?.asset) return null;

  const imageUrl = urlForImage(value).url();
  const { width, height } = value.asset.metadata?.dimensions || {
    width: 800,
    height: 600,
  };

  return (
    <figure className="my-8">
      <Image
        src={imageUrl}
        alt={value.alt || ' '}
        width={width}
        height={height}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        className="w-full h-auto rounded-lg"
        loading="lazy"
      />
      {value.caption && <figcaption>{value.caption}</figcaption>}
    </figure>
  );
}

const components: PortableTextComponents = {
  // Block-level elements
  block: {
    // Headings
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    h4: ({ children }) => (
      <h4 className="text-xl font-bold mb-2 mt-4">{children}</h4>
    ),
    h5: ({ children }) => (
      <h5 className="text-lg font-bold mb-2 mt-4">{children}</h5>
    ),
    h6: ({ children }) => (
      <h6 className="text-base font-bold mb-2 mt-4">{children}</h6>
    ),

    // Paragraphs
    normal: ({ children }) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 py-2 my-6 italic text-gray-700">
        {children}
      </blockquote>
    ),
  },

  // Inline marks
  marks: {
    // Text decorations
    strong: ({ children }) => <strong className="font-bold">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-gray-100 rounded px-1 py-0.5 text-sm font-mono">
        {children}
      </code>
    ),
    underline: ({ children }) => <span className="underline">{children}</span>,
    'strike-through': ({ children }) => <s>{children}</s>,

    // Links
    link: SmartLink,
  },

  // Lists
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>
    ),
  },

  listItem: {
    bullet: ({ children }) => <li className="ml-4">{children}</li>,
    number: ({ children }) => <li className="ml-4">{children}</li>,
  },

  // Custom types
  types: {
    image: PortableImage,
    // Add other custom block types here as needed
    // code: CodeBlock,
    // video: VideoEmbed,
  },
};

export function PortableTextRenderer({
  value,
  className = '',
}: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;

  return (
    <div className={`prose prose-lg max-w-none ${className}`}>
      <PortableText value={value} components={components} />
    </div>
  );
}
