'use client';

import { SanityImage, TextBlock, Title } from '@/components/common';
import { ClientIcons } from '@/components/common/ClientIcons';
import { ServicesListModule } from '@/components/modules/ServicesList/';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { ServicesPageCardModule as ServicesPageCardModuleType } from '@/types/sanity.generated';

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
  const isWide = useMediaQuery('(min-width: 50em)');

  if (!isValidServicesPageCardModule(data)) return null;

  const { title, body, image, services } = data;

  const hasTitle = title != null;
  const hasBody = body != null;
  const hasImage = image != null;
  const hasServices = services != null;

  const content = (
    <>
      <div className="content">
        {hasImage && (
          <div className="image">
            <SanityImage image={image} fill className="card-image" priority />
          </div>
        )}

        <div className="header">
          {hasTitle && (
            <Title as="h2" variant="primary">
              {title}
            </Title>
          )}
          {hasBody && <TextBlock body={body} variant="small" />}
        </div>

        {isWide && hasServices && !showClientIcons && (
          <div className="services">
            <ServicesListModule services={services as unknown[]} />
          </div>
        )}
      </div>

      {!isWide && hasServices && !showClientIcons && (
        <div className="services">
          <ServicesListModule services={services as unknown[]} />
        </div>
      )}

      {showClientIcons && <ClientIcons chyron />}
    </>
  );

  return showClientIcons ? (
    content
  ) : (
    <div className="services-card">{content}</div>
  );
}
