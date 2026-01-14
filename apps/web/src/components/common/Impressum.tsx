// apps/web/src/components/common/Impressum.tsx

export function Impressum() {
  const currentYear = new Date().getFullYear();

  return (
    <div className="impressum">
      <p className="impressum-left text">Los Angeles | London</p>
      <p className="impressum-right text">©{currentYear} Hammer Creative Ltd</p>
    </div>
  );
}
