// apps/web/src/components/common/ExtendedLink.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';

interface ExtendedLinkProps {
  href?: string;
  email?: string;
  className?: string;
  onClick?: (href: string, e: React.MouseEvent) => void;
  preventNavigation?: boolean; // When true, prevents Next.js Link from navigating
  children: ReactNode;
}

export function ExtendedLink({
  href,
  email,
  className,
  onClick,
  preventNavigation = false,
  children,
}: ExtendedLinkProps) {
  // Check if URL is external (http/https) or mailto
  const isExternal = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('mailto:');
  };

  // Handle email link clicks - obfuscates email from crawlers
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const mailtoHref = `mailto:${email}`;
    window.location.href = mailtoHref;
    onClick?.(mailtoHref, e);
  };

  // Handle all other link clicks
  // If preventNavigation is true, stops default navigation so custom onClick can handle it
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Prevent default browser/Next.js navigation if preventNavigation is true
    if (preventNavigation) {
      e.preventDefault();
    }
    // Call custom onClick handler if provided
    if (onClick && href) {
      onClick(href, e);
    }
  };

  // Combine base "link" class with any additional classes
  const combinedClassName = ['link', className].filter(Boolean).join(' ');

  // EMAIL: Render as button to prevent crawler detection
  if (email) {
    return (
      <button
        type="button"
        className={combinedClassName}
        onClick={handleEmailClick}
      >
        {children}
      </button>
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
        {children}
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
        {children}
      </a>
    );
  }

  // INTERNAL + preventNavigation: Regular <a> tag (no Next.js Link)
  // This allows e.preventDefault() to work and onClick to handle navigation
  if (preventNavigation) {
    return (
      <a href={href} className={combinedClassName} onClick={handleClick}>
        {children}
      </a>
    );
  }

  // INTERNAL (default): Use Next.js Link for client-side navigation
  return (
    <Link href={href} className={combinedClassName} onClick={handleClick}>
      {children}
    </Link>
  );
}
