// apps/web/src/components/common/Impressum.tsx

import { Copyright } from '@/components/common';

export function Impressum() {
  return (
    <>
      <div className="impressum">
        <p className="impressum-left text">Los Angeles | London</p>
        <Copyright className="copyright impressum-right text" />
      </div>
    </>
  );
}
