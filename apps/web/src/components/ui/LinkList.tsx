// apps/web/src/components/ui/LinkList.tsx
import Link from 'next/link';

interface LinkItem {
  id: string;
  href?: string;
  label: string;
  email?: string; // For obfuscated email addresses
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
  const isExternal = (href?: string) => {
    if (!href) return false;
    return href.startsWith('http') || href.startsWith('mailto:');
  };

  const handleEmailClick = (email: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${email}`;
    onLinkClick?.();
  };

  return (
    <ul {...(className && { className })}>
      {items.map((item) => {
        // Handle email obfuscation
        if (item.email) {
          return (
            <li
              key={item.id}
              {...(itemClassName && { className: itemClassName })}
            >
              <button
                type="button"
                {...(linkClassName && { className: linkClassName })}
                onClick={handleEmailClick(item.email)}
              >
                {item.label}
              </button>
            </li>
          );
        }

        if (!item.href) {
          return (
            <li
              key={item.id}
              {...(itemClassName && { className: itemClassName })}
            >
              <button
                type="button"
                {...(linkClassName && { className: linkClassName })}
                onClick={onLinkClick}
              >
                {item.label}
              </button>
            </li>
          );
        }

        return (
          <li
            key={item.id}
            {...(itemClassName && { className: itemClassName })}
          >
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
        );
      })}
    </ul>
  );
}
