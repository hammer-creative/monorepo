// apps/src/components/modules/ServicesPage/ServicesPageCardModule.tsx

import { SanityImageFullWidth, TextBlock, Title } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesListModule } from '@/components/modules/ServicesList/';
import type { ServicesPageCardModule as ServicesPageCardModuleType } from '@/types/sanity.generated';

const bem = 'services-card';

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
 *
 * Narrow: image and header stacked, services below.
 * Wide: image, header, and services all within content.
 *
 * @remarks
 * Services content is duplicated in the DOM with CSS show/hide to avoid CLS
 * from client-side media queries. TODO: evaluate container queries or SSR
 * alternatives if duplicate DOM becomes a concern.
 */
export function ServicesPageCardModule({
  data,
  showClientIcons = false,
}: ServicesPageCardModuleProps) {
  if (!isValidServicesPageCardModule(data)) return null;

  const { title, body, image, services } = data;

  const imageContent = image && (
    <SanityImageFullWidth image={image} fill className={`${bem}__image`} />
  );

  const headerContent = (
    <div className={`${bem}__header`}>
      {title && (
        <Title as="h2" className={`${bem}__title`}>
          {title}
        </Title>
      )}
      {body && <TextBlock body={body} className={`${bem}__text`} />}
    </div>
  );

  const servicesContent = services && !showClientIcons && (
    <div className={`${bem}__services`}>
      <ServicesListModule
        services={services as unknown[]}
        className={`${bem}__services-list`}
      />
    </div>
  );

  return (
    <div className={bem}>
      {imageContent}

      {showClientIcons && (
        <div className={`${bem}__chyron`}>
          <ClientIcons chyron />
        </div>
      )}

      <div className={`${bem}__content`}>
        {headerContent}
        <div className={`${bem}__wide`}>{servicesContent}</div>
      </div>
      {!showClientIcons && (
        <div className={`${bem}__narrow`}>{servicesContent}</div>
      )}
    </div>
  );
}
