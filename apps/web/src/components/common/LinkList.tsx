// apps/web/src/components/common/LinkList.tsx

import { Fragment } from 'react';

import { ExtendedLink } from './ExtendedLink';

interface LinkItem {
  id: string;
  href?: string;
  label: string;
  email?: string;
  className?: string;
}

interface LinkListProps {
  items: LinkItem[];
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  onLinkClick?: (href: string, e: React.MouseEvent) => void;
  ariaLabel?: string;
  asList?: boolean;
  currentPathname?: string;
}

export function LinkList({
  items,
  className,
  itemClassName,
  linkClassName,
  onLinkClick,
  ariaLabel,
  asList = true,
  currentPathname,
}: LinkListProps) {
  const isActive = (href?: string) =>
    !!href &&
    (href === '/'
      ? currentPathname === '/'
      : (currentPathname?.startsWith(href) ?? false));

  const getLinkClassName = (item: LinkItem) => {
    const classes = [
      linkClassName,
      item.className,
      isActive(item.href) ? 'is-active' : '',
    ]
      .filter(Boolean)
      .join(' ');
    return classes || undefined;
  };

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
            {...(isActive(item.href) && { 'data-active': true })}
          >
            <ExtendedLink
              href={item.href}
              email={item.email}
              className={getLinkClassName(item)}
              onClick={onLinkClick}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.label}
            </ExtendedLink>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <>
      {items.map((item) => (
        <Fragment key={item.id}>
          <ExtendedLink
            href={item.href}
            email={item.email}
            className={getLinkClassName(item)}
            onClick={onLinkClick}
            aria-current={isActive(item.href) ? 'page' : undefined}
          >
            {item.label}
          </ExtendedLink>
        </Fragment>
      ))}
    </>
  );
}
