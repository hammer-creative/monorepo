// apps/web/src/components/navigation/Addresses.tsx
interface Address {
  id: string;
  label: string;
  line1: string;
}

interface AddressesProps {
  items: Address[];
}

export function Addresses({ items }: AddressesProps) {
  return (
    <>
      {items.map((item) => (
        <address key={item.id} className="address">
          <p className="text">{item.label}</p>
          <p className="text">{item.line1}</p>
        </address>
      ))}
    </>
  );
}
