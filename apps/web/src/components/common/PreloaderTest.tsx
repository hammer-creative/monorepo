'use client';

import Preloader from '@/components/common/Preloader';
import { useEffect, useState } from 'react';

export default function PreloaderTestPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          return 100;
        }
        return p + 1;
      });
    }, 20);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ background: '#111', minHeight: '100vh' }}>
      <Preloader progress={progress} />
    </div>
  );
}
