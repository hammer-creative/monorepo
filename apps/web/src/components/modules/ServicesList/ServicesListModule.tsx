// apps/web/src/components/modules/Services/ServicesModule.tsx
import { Label } from '@/components/common';
import type {
  Deliverable,
  DeliverablesModule as DeliverablesModuleType,
  Service,
  ServicesModule as ServicesModuleType,
} from '@/types/sanity.generated';

const bem = 'services-list';

type ExpandedService = Service;
type ExpandedDeliverable = Deliverable;
type ListItem = ExpandedService | ExpandedDeliverable;

/**
 * Type guard ensuring an unknown item is a valid `ListItem` with `_id` and `title`.
 */
function isValidListItem(item: unknown): item is ListItem {
  if (!item || typeof item !== 'object') return false;
  const listItem = item as ListItem;
  return Boolean(listItem._id && listItem.title);
}

/**
 * Props shared by `ServicesListModule` and `DeliverablesListModule`.
 */
interface BaseProps {
  heading?: string;
  className?: string;
}

/**
 * Props for `ServicesListModule`.
 */
interface ServicesProps extends BaseProps {
  data?: ServicesModuleType | null;
  services?: unknown[] | null;
}

/**
 * Props for `DeliverablesListModule`.
 */
interface DeliverablesProps extends BaseProps {
  data?: DeliverablesModuleType | null;
  deliverables?: unknown[] | null;
}

/**
 * Renders a validated list of services or deliverables with a heading label.
 */
function ListRenderer({
  items,
  heading,
  className,
}: {
  items: unknown[];
  heading: string;
  className?: string;
}) {
  const validItems = items.filter(isValidListItem);

  if (validItems.length === 0) return null;

  return (
    <div className={className ?? bem}>
      <Label variant="small-caps">{heading}</Label>
      <ul className={`${bem}__list`}>
        {validItems.map((item: ListItem) => (
          <li className={`${bem}__item`} key={item._id}>
            {item.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Renders a list of services from either a Sanity `ServicesModule` or a raw
 * `services` array passed directly.
 */
export function ServicesListModule({
  data = null,
  services = null,
  heading = 'Services',
  className,
}: ServicesProps) {
  const items = services ?? data?.services ?? [];

  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} className={className} />;
}

/**
 * Renders a list of deliverables from either a Sanity `DeliverablesModule` or
 * a raw `deliverables` array passed directly.
 */
export function DeliverablesListModule({
  data = null,
  deliverables = null,
  heading = 'Delivered Elements',
  className,
}: DeliverablesProps) {
  const items = deliverables ?? data?.deliverables ?? [];

  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} className={className} />;
}
