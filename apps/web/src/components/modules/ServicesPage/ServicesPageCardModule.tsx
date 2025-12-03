// apps/web/src/components/modules/ServicesPageCardModule.tsx
import { Title, TextBlock, SanityImage } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesModule } from '@/components/modules/Services/ServicesModule';
import type { ServicesPageCardModuleType } from '@/types/sanity';

interface ServicesPageCardModuleProps {
  data: ServicesPageCardModuleType;
  showClientIcons?: boolean;
}

export function ServicesPageCardModule({
  data,
  showClientIcons = false,
}: ServicesPageCardModuleProps) {
  const { title, body, image, services } = data;

  return (
    <div className="card">
      <div className="card-marquee">
        <div className="card-metadata">
          {title && <Title title={title} className="heading" as="h2" />}
          {body && (
            <div className="description">
              <TextBlock body={body} className="text small" />
            </div>
          )}
        </div>

        {services && <ServicesModule services={services} />}
      </div>

      {image && (
        <SanityImage image={image} fill className="card-image" priority />
      )}

      {showClientIcons && <ClientIcons className="card-icons" chyron />}
    </div>
  );
}
