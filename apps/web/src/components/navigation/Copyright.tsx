// apps/web/src/components/navigation/Copyright.tsx

export function Copyright() {
  const currentYear = new Date().getFullYear();
  return <p className="text">&copy; Hammer Creative {currentYear}</p>;
}
