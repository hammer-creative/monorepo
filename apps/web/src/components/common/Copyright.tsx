// apps/web/src/components/common/Copyright.tsx

interface CopyrightProps {
  className?: string;
}

export function Copyright({ className }: CopyrightProps) {
  const currentYear = new Date().getFullYear();
  return (
    <p className={className ?? 'text'}>
      &copy;
      <span style={{ marginLeft: '1ch' }}>Hammer Creative {currentYear}</span>
    </p>
  );
}
