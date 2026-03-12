// apps/src/components/modules/ServicesPage/ServicesPageCardModule.tsx

import { SanityImageFullWidth, TextBlock, Title } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesListModule } from '@/components/modules/ServicesList/';
import type { ServicesPageCardModule as ServicesPageCardModuleType } from '@/types/sanity.generated';

const bem = 'services-page-card';

/**
 * Props for `ServicesPageCardModule`.
 */
interface ServicesPageCardModuleProps {
  data: ServicesPageCardModuleType | null;
  /** Renders the `ClientIcons` chyron in place of the services list. */
  showClientIcons?: boolean;
}

/**
 * Type guard to validate `ServicesPageCardModule` data.
 */
function isValidServicesPageCardModule(
  data: ServicesPageCardModuleType | null,
): data is ServicesPageCardModuleType {
  return data !== null;
}

/**
 * Renders a services page card with responsive layout.
 */
export function ServicesPageCardModule({
  data,
  showClientIcons = false,
}: ServicesPageCardModuleProps) {
  if (!isValidServicesPageCardModule(data)) return null;

  const { title, body, image, services } = data;

  return (
    <>
      {showClientIcons && (
        <div className={`${bem}__chyron`}>
          <ClientIcons chyron />
        </div>
      )}

      <div className={`${bem}__content`}>
        <div className={`${bem}__header`}>
          <SanityImageFullWidth
            image={image}
            fill
            className={`${bem}__image`}
          />
          {title && (
            <Title as="h2" className={`${bem}__title`}>
              {title}
            </Title>
          )}
          {body && <TextBlock body={body} className={`${bem}__text`} />}
          {services && !showClientIcons && (
            <div className={`${bem}__services`}>
              <ServicesListModule
                services={services as unknown[]}
                className="services-list"
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
