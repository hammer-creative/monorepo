// apps/web/src/components/modules/Services/ServicesModule.tsx
import type {
  ServicesModule as ServicesModuleType,
  DeliverablesModule as DeliverablesModuleType,
  Service,
  Deliverable,
} from '@/types/sanity.generated';

type Item = Service | Deliverable;

interface BaseProps {
  heading?: string;
}

interface ServicesProps extends BaseProps {
  data?: ServicesModuleType | null;
  services?: any[] | null;
}

interface DeliverablesProps extends BaseProps {
  data?: DeliverablesModuleType | null;
  deliverables?: any[] | null;
}

function ListRenderer({ items, heading }: { items: Item[]; heading: string }) {
  if (!items.length) return null;

  return (
    <div className="list">
      <p className="tag">{heading}</p>
      <ul>
        {items.map((item: Item) => {
          const { _id = null, title = null } = item || {};
          if (!_id || !title) return null;

          return (
            <li key={_id} className="item">
              <p className="small">{title}</p>
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

  return <ListRenderer items={items as Item[]} heading={heading} />;
}

export function DeliverablesListModule({
  data = null,
  deliverables = null,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  const items = deliverables ?? data?.deliverables ?? [];
  if (!items.length) return null;

  return <ListRenderer items={items as Item[]} heading={heading} />;
}
