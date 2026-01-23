// apps/web/src/components/common/ClientNames.tsx

interface ClientNamesProps {
  clientNames: string[];
  showTag?: boolean;
}

export function ClientNames({ clientNames, showTag = true }: ClientNamesProps) {
  if (!clientNames?.length) return null;

  return (
    <>
      {showTag && <div className="tag">Client</div>}
      {clientNames.map((clientName, index) => (
        <span className="client-name" key={`${clientName}-${index}`}>
          {clientName}
          {index < clientNames.length - 1 && ' + '}
        </span>
      ))}
    </>
  );
}
