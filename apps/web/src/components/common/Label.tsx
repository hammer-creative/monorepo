// apps/web/src/components/common/Label.tsx

// apps/web/src/components/common/Label.tsx
import type { ReactNode } from 'react';

const bem = 'label';

interface LabelProps {
  children: ReactNode;
  className?: string;
  as?: 'span' | 'div' | 'p';
}

export function Label({
  children,
  className,
  as: Component = 'div',
}: LabelProps) {
  return (
    <Component className={[bem, className].filter(Boolean).join(' ')}>
      {children}
    </Component>
  );
}
