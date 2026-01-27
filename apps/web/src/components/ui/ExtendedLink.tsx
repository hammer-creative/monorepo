// apps/web/src/components/ui/ExtendedLink.tsx
import Link from 'next/link';
import type { ReactNode } from 'react';

interface ExtendedLinkProps {
  href?: string;
  email?: string;
  className?: string;
  onClick?: (href: string, e: React.MouseEvent) => void;
  children: ReactNode;
}

/**
 * ExtendedLink component that handles internal links, external links, and email obfuscation
 * Automatically adds "link" base className and handles external link security attributes
 */
export function ExtendedLink({
  href,
  email,
  className,
  onClick,
  children,
}: ExtendedLinkProps) {
  // Check if a URL is external (http/https) or mailto
  const isExternal = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('mailto:');
  };

  // Handle email obfuscation click
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const mailtoHref = `mailto:${email}`;
    window.location.href = mailtoHref;
    onClick?.(mailtoHref, e);
  };

  // Handle regular link click
  const handleClick = (url: string) => (e: React.MouseEvent) => {
    onClick?.(url, e);
  };

  // Combine "link" base class with any additional className
  const combinedClassName = ['link', className].filter(Boolean).join(' ');

  // Handle email obfuscation - render as button to prevent crawlers
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

  // Handle button-only case (no href, no email)
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

  // Handle external links with security attributes
  if (isExternal(href)) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={handleClick(href)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  // Handle internal Next.js links
  return (
    <Link href={href} className={combinedClassName} onClick={handleClick(href)}>
      {children}
    </Link>
  );
}
