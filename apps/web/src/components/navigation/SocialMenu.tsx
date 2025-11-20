// apps/web/src/components/navigation/SocialMenu.tsx
import { LinkList } from '@/components/ui/LinkList';
import { Copyright } from './Copyright';

export function SocialMenu({ items }) {
  return (
    <>
      <LinkList items={items} itemClassName="item" linkClassName="link" />
      <Copyright />
    </>
  );
}
