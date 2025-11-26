// apps/web/src/components/modules/Services/ServiceItem.tsx
import type { ServiceReference, DeliverableReference } from '@/types/sanity';

interface Props {
  item: ServiceReference | DeliverableReference;
}

export function ServiceItem({ item }: Props) {
  // console.log(item);
  return (
    <li className="item">
      <p className="name small">{item.title}</p>
    </li>
  );
}
