'use client';
import { useEffect, useState } from 'react';

export default function useWindowSize() {
  const isClient = typeof window !== 'undefined';

  const getSize = () => ({
    width: isClient ? window.innerWidth : 0,
    height: isClient ? window.innerHeight : 0,
  });

  const [size, setSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) return;
    const onResize = () => setSize(getSize());
    window.addEventListener('resize', onResize, { passive: true });
    // also update on orientation change
    window.addEventListener('orientationchange', onResize);
    // initial
    onResize();
    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [isClient]);

  return size; // { width, height }
}