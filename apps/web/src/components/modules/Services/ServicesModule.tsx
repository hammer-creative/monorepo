// apps/web/src/components/modules/Services/ServicesModule.tsx
import type {
  ServicesModuleType,
  DeliverablesModuleType,
  ServiceReference,
  DeliverableReference,
} from '@/types/sanity';
import { ServiceItem } from './ServiceItem';

interface ServicesProps {
  data?: ServicesModuleType;
  services?: ServiceReference[];
  heading?: string;
}

interface DeliverablesProps {
  data?: DeliverablesModuleType;
  deliverables?: DeliverableReference[];
  heading?: string;
}

function ServicesList({ items, heading }: { items: any[]; heading: string }) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="list">
      <p className="tag">{heading}</p>
      <ul>
        {items.map((item) => (
          <ServiceItem key={item._id} item={item} />
        ))}
      </ul>
    </div>
  );
}

export function ServicesModule({
  data,
  services,
  heading = 'Services',
}: ServicesProps) {
  const items = services || data?.services;
  return <ServicesList items={items || []} heading={heading} />;
}

export function DeliverablesModule({
  data,
  deliverables,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  const items = deliverables || data?.deliverables;
  return <ServicesList items={items || []} heading={heading} />;
}
