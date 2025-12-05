// apps/web/src/components/common/ClientNames.tsx

interface ClientNamesProps {
  clientNames: string[];
}

export function ClientNames({ clientNames }: ClientNamesProps) {
  if (!clientNames?.length) return null;

  return (
    <>
      {clientNames.map((clientName, index) => (
        <span className="tag" key={`${clientName}-${index}`}>
          {clientName}
          {index < clientNames.length - 1 && ' + '}
        </span>
      ))}
    </>
  );
}
