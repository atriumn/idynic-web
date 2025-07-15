'use client';

import { LandingHeader } from './landing-header';
import { HeroSection } from './hero-section';
import { AboutSection } from './about-section';
import { FeaturesSection } from './features-section';
import { HowItWorksSection } from './how-it-works-section';
import { PricingSection } from './pricing-section';
import { CTASection } from './cta-section';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      <LandingHeader />
      <HeroSection />
      <AboutSection />
      <HowItWorksSection />
      <FeaturesSection />
      <PricingSection />
      <CTASection />
    </div>
  );
}