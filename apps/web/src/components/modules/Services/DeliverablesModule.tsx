// apps/web/src/components/modules/Services/DeliverablesModule.tsx
import type { DeliverablesModuleType } from '@/types/sanity';
import { ServiceItem } from './ServiceItem';

interface Props {
  data: DeliverablesModuleType;
}

export function DeliverablesModule({ data }: Props) {
  const { deliverables } = data;

  if (!deliverables || deliverables.length === 0) {
    return null;
  }

  return (
    <>
      <ul className="deliverables-list">
        <div className="tag">Delivered Elements</div>
        {deliverables.map((deliverable) => (
          <ServiceItem key={deliverable._id} item={deliverable} />
        ))}
      </ul>
    </>
  );
}
