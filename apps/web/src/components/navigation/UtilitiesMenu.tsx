// apps/web/src/components/navigation/UtilitiesMenu.tsx
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
    href: 'https://app.termly.io/policy-viewer/policy.html?policyUUID=ce93ccb0-f05a-489e-911c-e3eb4709c1cf',
    label: 'Privacy Policy',
    className: 'privacy',
  },
];

export function UtilitiesMenu() {
  return (
    <>
      {utilityLinks.map((link) => (
        <ExtendedLink
          key={link.id}
          href={link.href}
          email={link.email}
          className={link.className}
        >
          {link.label}
        </ExtendedLink>
      ))}
    </>
  );
}
