'use client';

import Preloader from '@/components/common/Preloader';
import { useEffect, useState } from 'react';

export default function PreloaderTestPage() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setProgress(100), 8000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{ background: '#111', minHeight: '100vh' }}>
      <Preloader progress={progress} />
    </div>
  );
}
