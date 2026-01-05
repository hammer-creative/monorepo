// apps/web/src/components/common/PortableTextRenderer.tsx
import { PortableText, type PortableTextComponents } from '@portabletext/react';
import type { PortableTextBlock } from '@portabletext/types';
import Link from 'next/link';

interface PortableTextRendererProps {
  value?: PortableTextBlock[]; // ✅ optional for safety
  className?: string;
}

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

export function PortableTextRenderer({
  value,
  className = '',
}: PortableTextRendererProps) {
  if (!value || value.length === 0) return null;

  const components: PortableTextComponents = {
    block: {
      h1: ({ children }) => <h1>{children}</h1>,
      h2: ({ children }) => <h2>{children}</h2>,
      h3: ({ children }) => <h3>{children}</h3>,
      h4: ({ children }) => <h4>{children}</h4>,
      h5: ({ children }) => <h5>{children}</h5>,
      h6: ({ children }) => <h6>{children}</h6>,
      normal: ({ children }) => <p className={className}>{children}</p>,
      blockquote: ({ children }: any) => <blockquote>{children}</blockquote>,
    },
    marks: {
      strong: ({ children }) => <strong>{children}</strong>,
      em: ({ children }) => <em>{children}</em>,
      code: ({ children }) => <code>{children}</code>,
      underline: ({ children }) => (
        <span className="underline">{children}</span>
      ),
      'strike-through': ({ children }) => <s>{children}</s>,
      link: SmartLink,
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    listItem: {
      bullet: ({ children }) => <li>{children}</li>,
      number: ({ children }) => <li>{children}</li>,
    },
  };

  return <PortableText value={value} components={components} />;
}
