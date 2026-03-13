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
          {item.label && <div className="text">{item.label}</div>}
          {item.telephone && <div className="text">{item.telephone}</div>}
          {item.line1 && <div className="text">{item.line1}</div>}
        </address>
      ))}
    </>
  );
}
