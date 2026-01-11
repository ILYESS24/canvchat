'use client';

import { HeroSection } from '@/components/home/hero-section';
import { ShowCaseSection } from '@/components/home/showcase-section';
import { Navbar } from '@/components/home/navbar';
import { FooterSection } from '@/components/home/footer-section';
import { ThemeProvider } from '@/components/home/theme-provider';
import { CookieConsent } from '@/components/cookie-consent';

export function LandingPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background">
        <Navbar />
        <main>
          <HeroSection />
          <ShowCaseSection />
        </main>
        <FooterSection />
        <CookieConsent />
      </div>
    </ThemeProvider>
  );
}
