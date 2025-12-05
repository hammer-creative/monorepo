// apps/web/src/components/modules/Services/ServicesModule.tsx
import type {
  ServicesModuleType,
  DeliverablesModuleType,
  ServiceReference,
  DeliverableReference,
} from '@/types/sanity';

type Item = ServiceReference | DeliverableReference;

interface BaseProps {
  heading?: string;
}

interface ServicesProps extends BaseProps {
  data?: ServicesModuleType | null;
  services?: ServiceReference[] | null;
}

interface DeliverablesProps extends BaseProps {
  data?: DeliverablesModuleType | null;
  deliverables?: DeliverableReference[] | null;
}

function ListRenderer({ items, heading }: { items: Item[]; heading: string }) {
  if (!items.length) return null;

  return (
    <div className="services-list">
      <p className="tag">{heading}</p>
      <ul>
        {items.map((item) => {
          const { _id = null, title = null } = item || {};
          if (!_id || !title) return null;

          return (
            <li key={_id} className="item">
              <p className="name small">{title}</p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function ServicesListModule({
  data = null,
  services = null,
  heading = 'Services',
}: ServicesProps) {
  const items = services ?? data?.services ?? [];
  if (!items.length) return null;

  return <ListRenderer items={items} heading={heading} />;
}

export function DeliverablesListModule({
  data = null,
  deliverables = null,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  const items = deliverables ?? data?.deliverables ?? [];
  if (!items.length) return null;

  return <ListRenderer items={items} heading={heading} />;
}
