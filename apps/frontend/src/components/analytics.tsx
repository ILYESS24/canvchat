'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// Google Tag Manager
export function GoogleTagManager({ gtmId }: { gtmId: string }) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [gtmId]);

  return null;
}

// PostHog Analytics
export function PostHogIdentify() {
  useEffect(() => {
    // PostHog initialization would go here
    // This is a placeholder for the actual PostHog setup
  }, []);

  return null;
}

// Route Change Tracker
export function RouteChangeTracker() {
  useEffect(() => {
    // Track page views
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', 'GTM-PKFG3JCX', {
        page_path: window.location.pathname,
      });
    }
  }, []);

  return null;
}

// Vercel Analytics
export function Analytics() {
  useEffect(() => {
    // Vercel Analytics would be configured here
    // This is a placeholder
  }, []);

  return null;
}

// Vercel Speed Insights
export function SpeedInsights() {
  useEffect(() => {
    // Speed Insights would be configured here
    // This is a placeholder
  }, []);

  return null;
}

// Toast component for notifications
export function Toaster() {
  return null; // Placeholder for toast notifications
}

// Plan Selection Modal
export function PlanSelectionModal() {
  return null; // Placeholder for plan selection
}

// Auth Event Tracker
export function AuthEventTracker() {
  return null; // Placeholder for auth event tracking
}

// Client Segment Root
export function ClientSegmentRoot() {
  return null; // Placeholder for segment analytics
}

// Async Metadata Outlet
export function AsyncMetadataOutlet() {
  return null; // Placeholder for metadata handling
}

// Viewport Boundary
export function ViewportBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

// Metadata Boundary
export function MetadataBoundary({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
