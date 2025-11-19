// apps/web/src/components/modules/Services/ServicesModule.tsx
import type { ServicesModuleType } from '@/types/sanity';
import { ServiceItem } from './ServiceItem';

interface Props {
  data: ServicesModuleType;
}

export function ServicesModule({ data }: Props) {
  const { services } = data;

  if (!services || services.length === 0) {
    return null;
  }

  return (
    <ul className="services-list">
      <div className="tag">Services</div>
      {services.map((service) => (
        <ServiceItem key={service._id} item={service} />
      ))}
    </ul>
  );
}
