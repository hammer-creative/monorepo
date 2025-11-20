// apps/web/src/components/ui/LinkList.tsx
import Link from 'next/link';

interface LinkItem {
  id: string;
  href: string;
  label: string;
}

interface LinkListProps {
  items: LinkItem[];
  className?: string;
  itemClassName?: string;
  linkClassName?: string;
  onLinkClick?: () => void;
}

export function LinkList({
  items,
  className,
  itemClassName,
  linkClassName,
  onLinkClick,
}: LinkListProps) {
  const isExternal = (href: string) => {
    return href.startsWith('http') || href.startsWith('mailto:');
  };

  return (
    <ul {...(className && { className })}>
      {items.map((item) => (
        <li key={item.id} {...(itemClassName && { className: itemClassName })}>
          {isExternal(item.href) ? (
            <a
              href={item.href}
              {...(linkClassName && { className: linkClassName })}
              onClick={onLinkClick}
              target="_blank"
              rel="noopener noreferrer"
            >
              {item.label}
            </a>
          ) : (
            <Link
              href={item.href}
              {...(linkClassName && { className: linkClassName })}
              onClick={onLinkClick}
            >
              {item.label}
            </Link>
          )}
        </li>
      ))}
    </ul>
  );
}
