'use client';

import { useEffect } from 'react';

export function usePerformance(pageName: string) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Track page load time
    const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    if (perfData) {
      const loadTime = perfData.loadEventEnd - perfData.fetchStart;
      console.log(`[Performance] ${pageName} loaded in ${loadTime}ms`);
    }

    // Track Core Web Vitals
    if ('web-vital' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`[Web Vital] ${entry.name}:`, entry);
        }
      });
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
    }
  }, [pageName]);
}
