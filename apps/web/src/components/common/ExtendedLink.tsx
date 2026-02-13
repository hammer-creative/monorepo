// apps/web/src/components/common/ExtendedLink.tsx
'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface ExtendedLinkProps {
  href?: string;
  email?: string;
  className?: string;
  onClick?: (href: string, e: React.MouseEvent) => void;
  preventNavigation?: boolean;
  arrowComponent?: ReactNode; // Pass in any arrow component
  children: ReactNode;
}

export function ExtendedLink({
  href,
  email,
  className,
  onClick,
  preventNavigation = false,
  arrowComponent,
  children,
}: ExtendedLinkProps) {
  // Check if URL is external (http/https) or mailto
  const isExternal = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('mailto:');
  };

  // Handle all link clicks
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventNavigation) {
      e.preventDefault();
    }
    if (onClick && href) {
      onClick(href, e);
    }
  };

  // Combine base "link" class with any additional classes
  const combinedClassName = ['link', className].filter(Boolean).join(' ');

  // Wrap children with arrow component if provided
  const content = arrowComponent ? (
    <>
      {children}
      {arrowComponent}
    </>
  ) : (
    children
  );

  // EMAIL: Render as mailto link
  if (email) {
    const mailtoHref = `mailto:${email}`;
    return (
      <a
        href={mailtoHref}
        className={combinedClassName}
        onClick={(e) => onClick?.(mailtoHref, e)}
      >
        {content}
      </a>
    );
  }

  // NO HREF: Render as button (for onClick-only links)
  if (!href) {
    return (
      <button
        type="button"
        className={combinedClassName}
        onClick={(e) => onClick?.('', e)}
      >
        {content}
      </button>
    );
  }

  // EXTERNAL: Regular <a> tag with security attributes
  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={handleClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {content}
      </a>
    );
  }

  // INTERNAL + preventNavigation: Regular <a> tag (no Next.js Link)
  if (preventNavigation) {
    return (
      <a href={href} className={combinedClassName} onClick={handleClick}>
        {content}
      </a>
    );
  }

  // INTERNAL (default): Use Next.js Link for client-side navigation
  return (
    <Link href={href} className={combinedClassName} onClick={handleClick}>
      {content}
    </Link>
  );
}

// ServerLink at the end
interface ServerLinkProps {
  href: string;
  className?: string;
  arrowComponent?: ReactNode;
  children: ReactNode;
}

export function ServerLink({
  href,
  className,
  arrowComponent,
  children,
}: ServerLinkProps) {
  return (
    <ExtendedLink
      href={href}
      className={className}
      arrowComponent={arrowComponent}
    >
      {children}
    </ExtendedLink>
  );
}
