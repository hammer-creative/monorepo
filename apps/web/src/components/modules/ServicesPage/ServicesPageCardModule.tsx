// apps/web/src/components/modules/ServicesPageCardModule.tsx
import { SanityImage, TextBlock, Title } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesListModule } from '@/components/modules/ServicesList/';
import type { ServicesPageCardModule as ServicesPageCardModuleType } from '@/types/sanity.generated';

// Type guard: Check if module data exists and is valid
function isValidServicesPageCardModule(
  data: ServicesPageCardModuleType | null,
): data is ServicesPageCardModuleType {
  return data !== null;
}

interface ServicesPageCardModuleProps {
  data: ServicesPageCardModuleType | null;
  showClientIcons?: boolean;
}

export function ServicesPageCardModule({
  data,
  showClientIcons = false,
}: ServicesPageCardModuleProps) {
  // Guard: Early return if no valid data
  if (!isValidServicesPageCardModule(data)) return null;

  // Destructure with defaults for optional fields
  const { title = null, body = null, image = null, services = null } = data;

  return (
    <div className="card">
      {/* Card Content: Title + Body + Services */}
      <div className="card-marquee">
        <div className="card-metadata">
          {title && <Title title={title} className="heading" as="h2" />}
          {body && (
            <div className="description">
              <TextBlock body={body} className="text small" />
            </div>
          )}
        </div>

        {services && <ServicesListModule services={services as unknown[]} />}
      </div>

      {/* Card Image */}
      {image && (
        <SanityImage image={image} fill className="card-image" priority />
      )}

      {/* Client Icons (conditionally shown) */}
      {showClientIcons && <ClientIcons className="card-icons" chyron />}
    </div>
  );
}
