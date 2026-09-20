'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function FullscreenManager() {
  const pathname = usePathname();

  // Page 2 onwards: System checks, Proctoring, and Test
  const fullscreenRoutes = [
    '/setup/system-checks',
    '/setup/proctoring',
    '/test',
  ];

  const shouldBeFullscreen = fullscreenRoutes.some((route) => pathname?.startsWith(route));

  useEffect(() => {
    if (!shouldBeFullscreen) return;

    const enterFullscreen = () => {
      if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {
          // Browser requires direct user interaction on this document
        });
      }
    };

    // Attempt immediately when arriving on page 2 or beyond
    enterFullscreen();

    // Fallback: If browser requires an in-page user gesture,
    // trigger on the very first click or keydown on the page
    const handleGesture = () => {
      enterFullscreen();
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };

    window.addEventListener('click', handleGesture, { once: true });
    window.addEventListener('keydown', handleGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleGesture);
      window.removeEventListener('keydown', handleGesture);
    };
  }, [pathname, shouldBeFullscreen]);

  return null;
}
