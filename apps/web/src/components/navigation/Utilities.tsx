// apps/web/src/components/navigation/Utilities.tsx
import { ExtendedLink } from '@/components/common/ExtendedLink';

const utilityLinks = [
  {
    id: 'email',
    email: 'info@hammercreative.com',
    label: 'info@hammercreative.com',
    className: 'email',
  },
  {
    id: 'privacy',
    href: '/privacy',
    label: 'Privacy Policy',
    className: 'privacy',
  },
];

export function Utilities() {
  return (
    <>
      {utilityLinks.map((link) => (
        <ExtendedLink
          key={link.id}
          href={link.href}
          email={link.email}
          className={`${link.className || ''}`}
        >
          {link.label}
        </ExtendedLink>
      ))}
    </>
  );
}
