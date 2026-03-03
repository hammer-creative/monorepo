'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface ExtendedLinkProps {
  href?: string;
  email?: string;
  className?: string;
  onClick?: (href: string, e: React.MouseEvent) => void;
  preventNavigation?: boolean;
  arrowComponent?: ReactNode;
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
  const pathname = usePathname();

  const isExternal = (url?: string) => {
    if (!url) return false;
    return url.startsWith('http') || url.startsWith('mailto:');
  };

  const isActive = (url?: string) => {
    if (!url || isExternal(url)) return false;
    return url === '/' ? pathname === '/' : pathname.startsWith(url);
  };

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (preventNavigation) e.preventDefault();
    if (onClick && href) onClick(href, e);
  };

  const active = isActive(href);
  const combinedClassName = ['link', active ? 'is-active' : '', className]
    .filter(Boolean)
    .join(' ');

  const content = arrowComponent ? (
    <>
      {children}
      {arrowComponent}
    </>
  ) : (
    children
  );

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

  if (preventNavigation) {
    return (
      <a
        href={href}
        className={combinedClassName}
        onClick={handleClick}
        aria-current={active ? 'page' : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={combinedClassName}
      onClick={handleClick}
      aria-current={active ? 'page' : undefined}
    >
      {content}
    </Link>
  );
}

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
