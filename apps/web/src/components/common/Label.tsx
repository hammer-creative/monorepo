// apps/web/src/components/common/Label.tsx

import type { ReactNode } from 'react';

interface LabelProps {
  children?: ReactNode;
  clients?: string[];
  variant?: 'centered' | 'client-label' | 'client-name' | 'list';
  as?: 'span' | 'div' | 'p';
  className?: string;
}

export function Label({
  children,
  clients,
  variant,
  className = '',
  as: Component = 'span',
}: LabelProps) {
  const variantClass = variant || '';

  if (clients?.length) {
    return (
      <>
        {clients.map((name, index) => (
          <Component
            className={`label ${variantClass} ${className}`.trim()}
            key={name}
          >
            {name}
            {index < clients.length - 1 && ' + '}
          </Component>
        ))}
      </>
    );
  }

  if (!children) return null;

  return (
    <Component className={`label ${variantClass} ${className}`.trim()}>
      {children}
    </Component>
  );
}
