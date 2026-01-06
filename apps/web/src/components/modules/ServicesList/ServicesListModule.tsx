// apps/web/src/components/modules/Services/ServicesModule.tsx
import type {
  Deliverable,
  DeliverablesModule as DeliverablesModuleType,
  Service,
  ServicesModule as ServicesModuleType,
} from '@/types/sanity.generated';

// The generated types show services/deliverables as references, but GROQ expands them
// This type represents what we actually get at runtime after GROQ expansion
type ExpandedService = Service;
type ExpandedDeliverable = Deliverable;
type ListItem = ExpandedService | ExpandedDeliverable;

// Type guard: Check if item has required fields
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
  // Filter to only valid items
  const validItems = items.filter(isValidListItem);

  // Guard: Early return if no valid items
  if (validItems.length === 0) return null;

  return (
    <div className="list">
      <p className="tag">{heading}</p>
      <ul>
        {validItems.map((item: ListItem) => (
          <li key={item._id} className="item">
            <p className="small">{item.title}</p>
          </li>
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
  // Get items from either direct prop or from data module
  const items = services ?? data?.services ?? [];

  // Guard: Early return if no items
  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} />;
}

export function DeliverablesListModule({
  data = null,
  deliverables = null,
  heading = 'Delivered Elements',
}: DeliverablesProps) {
  // Get items from either direct prop or from data module
  const items = deliverables ?? data?.deliverables ?? [];

  // Guard: Early return if no items
  if (!Array.isArray(items) || items.length === 0) return null;

  return <ListRenderer items={items} heading={heading} />;
}
