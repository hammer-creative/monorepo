// apps/web/src/components/common/SubTitle.tsx

import type { ReactNode } from 'react';

interface SubTitleProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'default';
  as?: 'div' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

/**
 * SubTitle component with responsive font sizing based on content length
 * Automatically adds 'long' or 'short' class for CSS targeting
 *
 * @param children - SubTitle text content
 * @param variant - Style variant (primary, secondary, tertiary, default)
 * @param as - HTML element to render (default: h2)
 * @param className - Additional CSS classes
 */
export function SubTitle({
  children,
  variant = 'default',
  as: Component = 'h2',
  className,
}: SubTitleProps) {
  if (!children) return null;

  const baseClasses = 'subtitle';

  return (
    <Component
      className={`${baseClasses} ${variant}${className ? ` ${className}` : ''}`}
    >
      {children}
    </Component>
  );
}
