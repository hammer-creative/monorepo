// apps/web/src/components/ui/LinkList.tsx
import { Fragment } from 'react';

import { ExtendedLink } from './ExtendedLink';

interface LinkItem {
  id: string;
  href?: string;
  label: string;
  email?: string; // For obfuscated email addresses
  className?: string; // Per-item className
}

interface LinkListProps {
  items: LinkItem[];
  className?: string; // Applied to <ul> wrapper
  itemClassName?: string; // Applied to <li> items
  linkClassName?: string; // Applied to all links (in addition to item.className)
  onLinkClick?: (href: string, e: React.MouseEvent) => void;
  ariaLabel?: string; // Accessibility label for <ul>
  asList?: boolean; // If false, renders as fragment without <ul>/<li> wrappers
}

/**
 * LinkList component that renders a list of ExtendedLinks
 * Can render as a <ul> list (default) or as a fragment for inline usage
 */
export function LinkList({
  items,
  className,
  itemClassName,
  linkClassName,
  onLinkClick,
  ariaLabel,
  asList = true,
}: LinkListProps) {
  // Combine linkClassName prop with per-item className
  const getLinkClassName = (item: LinkItem) => {
    const classes = [linkClassName, item.className].filter(Boolean).join(' ');
    return classes || undefined;
  };

  // Render as semantic list with <ul> and <li> wrappers
  if (asList) {
    return (
      <ul
        {...(className && { className })}
        {...(ariaLabel && { 'aria-label': ariaLabel })}
      >
        {items.map((item) => (
          <li
            key={item.id}
            {...(itemClassName && { className: itemClassName })}
          >
            <ExtendedLink
              href={item.href}
              email={item.email}
              className={getLinkClassName(item)}
              onClick={onLinkClick}
            >
              {item.label}
            </ExtendedLink>
          </li>
        ))}
      </ul>
    );
  }

  // Render as fragment (no wrapper) - useful for inline usage like footer utilities
  // Fragment is needed to provide keys to React
  return (
    <>
      {items.map((item) => (
        <Fragment key={item.id}>
          <ExtendedLink
            href={item.href}
            email={item.email}
            className={getLinkClassName(item)}
            onClick={onLinkClick}
          >
            {item.label}
          </ExtendedLink>
        </Fragment>
      ))}
    </>
  );
}
