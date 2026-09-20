'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function CameraProctor() {
  const pathname = usePathname();
  const streamRef = useRef(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Active only after Page 1: /setup/system-checks, /setup/proctoring, and /test
  const allowedRoutes = [
    '/setup/system-checks',
    '/setup/proctoring',
    '/test',
  ];

  const shouldBeActive =
    allowedRoutes.some((route) => pathname?.startsWith(route)) && !isSubmitted;

  // Listen for test submission event to turn off camera immediately
  useEffect(() => {
    const handleSubmission = () => {
      setIsSubmitted(true);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };

    window.addEventListener('test-submitted', handleSubmission);
    return () => {
      window.removeEventListener('test-submitted', handleSubmission);
    };
  }, []);

  // Reset submitted state when navigating back to setup
  useEffect(() => {
    if (pathname === '/setup/system-checks' || pathname === '/setup/proctoring') {
      setIsSubmitted(false);
    }
  }, [pathname]);

  // Manage background camera lifecycle
  useEffect(() => {
    if (!shouldBeActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    const startCamera = async () => {
      try {
        if (!streamRef.current && navigator.mediaDevices?.getUserMedia) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 320 },
              height: { ideal: 240 },
              facingMode: 'user',
            },
            audio: false,
          });

          if (!isSubscribed) {
            stream.getTracks().forEach((track) => track.stop());
            return;
          }

          streamRef.current = stream;
        }
      } catch (err) {
        console.warn('Background proctoring webcam access:', err);
      }
    };

    startCamera();

    return () => {
      isSubscribed = false;
    };
  }, [shouldBeActive]);

  // No on-screen widget or badge; runs silently in background
  return null;
}
