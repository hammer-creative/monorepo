// apps/web/src/components/common/Label.tsx

import type { ReactNode } from 'react';

interface LabelProps {
  children?: ReactNode;
  clients?: string[];
  variant?: 'default' | 'large' | 'centered';
  as?: 'span' | 'div' | 'p';
}

export function Label({
  children,
  clients,
  variant = 'default',
  as: Component = 'span',
}: LabelProps) {
  const baseClasses =
    'font-weight-900 letter-spacing-wide line-height-default uppercase';

  const variantClasses = {
    default: 'text-xs-fluid',
    large: 'text-sm-fluid',
    centered: 'text-xs-fluid text-center',
  };

  // If clients provided, render as client list
  if (clients?.length) {
    return (
      <>
        {clients.map((name, index) => (
          <Component
            className={`${baseClasses} ${variantClasses[variant]}`}
            key={`${name}-${index}`}
          >
            {name}
            {index < clients.length - 1 && ' + '}
          </Component>
        ))}
      </>
    );
  }

  // Otherwise render children
  if (!children) return null;

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </Component>
  );
}
