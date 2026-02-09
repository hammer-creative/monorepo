// apps/web/src/components/modules/Services/ServicesModule.tsx
import { Label } from '@/components/common';
import type {
  Deliverable,
  DeliverablesModule as DeliverablesModuleType,
  Service,
  ServicesModule as ServicesModuleType,
} from '@/types/sanity.generated';

type ExpandedService = Service;
type ExpandedDeliverable = Deliverable;
type ListItem = ExpandedService | ExpandedDeliverable;

function isValidListItem(item: unknown): item is ListItem {
  if (!item || typeof item !== 'object') return false;
  const listItem = item as ListItem;
  return Boolean(listItem._id && listItem.title);
}

interface BaseProps {
  heading?: string;
}

interface ServicesProps extends BaseProps {
  data?: ServicesModuleType | null;
  services?: unknown[] | null;
}

interface DeliverablesProps extends BaseProps {
  data?: DeliverablesModuleType | null;
  deliverables?: unknown[] | null;
}

function ListRenderer({
  items,
  heading,
}: {
  items: unknown[];
  heading: string;
}) {
  const validItems = items.filter(isValidListItem);

  if (validItems.length === 0) return null;

  return (
    <div className="services-list">
      <Label as="p" variant="list">
        {heading}
      </Label>
      <ul>
        {validItems.map((item: ListItem) => (
          <li key={item._id}>{item.title}</li>
        ))}
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

  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} />;
}

export function DeliverablesListModule({
  data = null,
  deliverables = null,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  const items = deliverables ?? data?.deliverables ?? [];

  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} />;
}
