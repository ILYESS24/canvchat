'use client';

import { KortixHeader } from '@/components/kortix/header';
import { KortixHero } from '@/components/kortix/hero';
import { KortixShowcase } from '@/components/kortix/showcase';
import { KortixFooter } from '@/components/kortix/footer';

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <KortixHeader />
      <main>
        <KortixHero />
        <KortixShowcase />
      </main>
      <KortixFooter />
    </div>
  );
}
