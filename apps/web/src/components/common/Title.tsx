// apps/web/src/components/common/Title.tsx

import type { ReactNode } from 'react';

interface TitleProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'tertiary' | 'default';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'span' | 'p';
  className?: string;
}

/**
 * Title component with responsive font sizing based on content length
 * Automatically adds 'long' or 'short' class for CSS targeting
 *
 * @param children - Title text content
 * @param variant - Style variant (primary, secondary, tertiary, default)
 * @param as - HTML element to render (default: h2)
 * @param className - Additional CSS classes
 */
export function Title({
  children,
  variant = 'default',
  as: Component = 'h2',
  className,
}: TitleProps) {
  if (!children) return null;

  // Calculate title length for responsive font sizing
  const titleText = typeof children === 'string' ? children : '';
  const lengthClass = titleText.length > 30 ? 'long' : 'short';

  const baseClasses = 'title';

  return (
    <Component
      className={`${baseClasses} ${variant}${className ? ` ${className}` : ''}`}
      data-length={lengthClass}
    >
      {children}
    </Component>
  );
}
