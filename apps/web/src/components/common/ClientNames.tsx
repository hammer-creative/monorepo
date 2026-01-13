// apps/web/src/components/common/ClientNames.tsx

interface ClientNamesProps {
  clientNames: string[];
}

export function ClientNames({ clientNames }: ClientNamesProps) {
  if (!clientNames?.length) return null;

  return (
    <>
      <div className="tag">Client</div>
      {clientNames.map((clientName, index) => (
        <span className="client-name" key={`${clientName}-${index}`}>
          {clientName}
          {index < clientNames.length - 1 && ' + '}
        </span>
      ))}
    </>
  );
}
