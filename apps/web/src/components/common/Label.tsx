// apps/web/src/components/common/Label.tsx
import type { ReactNode } from 'react';

interface Client {
  _id: string;
  name?: string;
}

interface LabelProps {
  children?: ReactNode;
  clients?: Client[];
  variant?: 'centered' | 'client-label' | 'client-name' | 'list';
  as?: 'span' | 'div' | 'p';
  className?: string;
}

/**
 * Label component for small text elements including tags, attributions, and client lists.
 * When clients are provided, renders each client name as a separate element.
 *
 * @param children - Label text content
 * @param clients - Array of client objects to render as individual labels
 * @param variant - Style variant (centered, client-label, client-name, list)
 * @param as - HTML element to render (default: span)
 * @param className - Additional CSS classes
 */
export function Label({
  children,
  clients,
  variant,
  className,
  as: Component = 'div',
}: LabelProps) {
  const classes = ['label', variant && `label--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  if (clients?.length) {
    const clientNames = clients
      .map((c) => c?.name)
      .filter((name): name is string => typeof name === 'string');

    return <Component className={classes}>{clientNames.join(' + ')}</Component>;
  }

  if (!children) return null;

  return <Component className={classes}>{children}</Component>;
}
