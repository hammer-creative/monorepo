// apps/web/src/components/modules/Services/ServicesModule.tsx
import type {
  ServicesModuleType,
  DeliverablesModuleType,
} from '@/types/sanity';
import { ServiceItem } from './ServiceItem';

interface ServicesProps {
  data: ServicesModuleType;
  heading?: string;
}

interface DeliverablesProps {
  data: DeliverablesModuleType;
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

export function ServicesModule({ data, heading = 'Services' }: ServicesProps) {
  return <ServicesList items={data.services} heading={heading} />;
}

export function DeliverablesModule({
  data,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  return <ServicesList items={data.deliverables} heading={heading} />;
}
