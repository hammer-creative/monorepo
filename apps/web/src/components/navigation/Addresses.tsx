// apps/web/src/components/navigation/Addresses.tsx
import { type Address } from '@/types/navigation';

interface AddressesProps {
  items: Address[];
}

export function Addresses({ items }: AddressesProps) {
  return (
    <>
      {items.map((item) => (
        <address key={item.id} className="address">
          <p className="text">{item.label}</p>
          {item.telephone && <p className="text">{item.telephone}</p>}
          <p className="text">{item.line1}</p>
        </address>
      ))}
    </>
  );
}
