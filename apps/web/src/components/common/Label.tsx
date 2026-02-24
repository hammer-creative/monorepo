// apps/web/src/components/common/Label.tsx

import type { ReactNode } from 'react';

const bem = 'label';

interface Client {
  _id?: string;
  _ref?: string;
  _type?: string;
  name?: string;
}

/**
 * Props for `Label`.
 */
interface LabelProps {
  children?: ReactNode;
  clients?: Client[] | null | undefined;
  /** Optional tag label rendered before client names, e.g. `"Client"`. */
  tag?: string;
  variant?:
    | 'centered'
    | 'client-label'
    | 'small-caps'
    | 'list'
    | 'clients'
    | 'client-names';
  as?: 'span' | 'div' | 'p';
  className?: string;
}

/**
 * Label component for small text elements including tags, attributions, and
 * client lists. When `clients` are provided, renders all client names joined
 * by " + ". An optional `tag` label can be rendered before the names.
 */
export function Label({
  children,
  clients,
  tag,
  variant,
  className,
  as: Component = 'div',
}: LabelProps) {
  const classes = [bem, variant && `${bem}--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  if (clients?.length) {
    const clientNames = clients
      .map((c) => c?.name)
      .filter((name): name is string => typeof name === 'string');

    if (!clientNames.length) return null;

    return (
      <Component className={className}>
        {tag && <div className={`${bem}--tag`}>{tag}</div>}
        <div className={`${bem}--${variant}`}>{clientNames.join(' + ')}</div>
      </Component>
    );
  }

  if (!children) return null;

  return <Component className={classes}>{children}</Component>;
}
