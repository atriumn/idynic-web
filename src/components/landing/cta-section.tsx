'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CTASection() {
  return (
    <section className="py-20 bg-[#137dc5]">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Unlock Your Professional Potential?
          </h2>
          <p className="text-xl text-white/80 mb-8 leading-relaxed">
            Join thousands of professionals who have transformed their careers with AI-powered identity synthesis. 
            Start building your strategic advantage today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/signup">
              <Button size="lg" className="px-8 py-4 text-lg bg-white text-[#137dc5] hover:bg-gray-100">
                Start Your Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-white text-white hover:bg-white hover:text-[#137dc5]">
                Schedule a Demo
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold text-white mb-2">12,847+</div>
              <p className="text-white/80">Identities Created</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">94%</div>
              <p className="text-white/80">Success Rate</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-white mb-2">4.9/5</div>
              <p className="text-white/80">User Rating</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}