// apps/src/components/modules/ServicesPage/ServicesPageCardModule.tsx

import { SanityImageFullWidth, TextBlock, Title } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesListModule } from '@/components/modules/ServicesList/';
import type { ServicesPageCardModule as ServicesPageCardModuleType } from '@/types/sanity.generated';

/**
 * Type guard to validate ServicesPageCardModule data
 */
function isValidServicesPageCardModule(
  data: ServicesPageCardModuleType | null,
): data is ServicesPageCardModuleType {
  return data !== null;
}

interface ServicesPageCardModuleProps {
  data: ServicesPageCardModuleType | null;
  showClientIcons?: boolean;
}

/**
 * Services page card module with responsive layout
 *
 * Narrow: image + header stacked, services below
 * Wide: image + header + services all within content
 *
 * Note: Duplicates servicesContent in DOM with CSS show/hide to avoid CLS from client-side media queries
 * TODO: Evaluate if duplicate DOM is acceptable or explore container queries/SSR alternatives
 */
export function ServicesPageCardModule({
  data,
  showClientIcons = false,
}: ServicesPageCardModuleProps) {
  if (!isValidServicesPageCardModule(data)) return null;

  const { title, body, image, services } = data;

  // Image container with Next.js Image fill
  const imageContent = image && (
    <div className="image">
      <SanityImageFullWidth image={image} fill className="card-image" />
    </div>
  );

  // Header with title and body text
  const headerContent = (
    <div className="header">
      {title && (
        <Title as="h2" variant="primary">
          {title}
        </Title>
      )}
      {body && <TextBlock body={body} variant="small" />}
    </div>
  );

  // Services list - rendered twice for responsive positioning
  const servicesContent = services && !showClientIcons && (
    <div className="services">
      <ServicesListModule services={services as unknown[]} />
    </div>
  );

  return (
    <div className="services-card">
      {imageContent}
      <div className="content">
        {headerContent}
        {/* Wide: services inside content */}
        <div className="wide">{servicesContent}</div>
      </div>
      {/* Narrow: services outside content */}
      <div className="narrow">{servicesContent}</div>
      {showClientIcons && <ClientIcons chyron />}
    </div>
  );
}
