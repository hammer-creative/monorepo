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
    <div className="services-module">
      <ul className="services-list">
        {services.map((service) => (
          <ServiceItem key={service._id} item={service} />
        ))}
      </ul>
    </div>
  );
}
