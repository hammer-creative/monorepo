// apps/web/src/components/common/ClientList.tsx
const bem = 'client-list';

interface Client {
  _id?: string;
  _ref?: string;
  _type?: string;
  name?: string;
}

interface ClientListProps {
  clients: Client[];
  tag?: string;
}

export function ClientList({ clients, tag }: ClientListProps) {
  const names = clients
    .map((c) => c?.name)
    .filter((name): name is string => typeof name === 'string');

  if (!names.length) return null;

  return (
    <>
      {tag && <div className={`label ${bem}--tag`}>{tag}</div>}
      <div className={`${bem}--names`}>{names.join(' + ')}</div>
    </>
  );
}
