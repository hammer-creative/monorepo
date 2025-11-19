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
    <div className="addresses">
      {items.map((item) => (
        <address key={item.id} className="address">
          <p className="address-label">{item.label}</p>
          <p className="address-line">{item.line1}</p>
        </address>
      ))}
    </div>
  );
}
