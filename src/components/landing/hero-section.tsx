'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { RegisterInterestModal } from '@/components/register-interest-modal';

export function HeroSection() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 min-h-screen flex items-center pt-16">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-5xl mx-auto">
          {/* Logo */}
          <div className="mb-8">
            <Image
              src="/symbol.svg"
              alt="Idynic"
              width={120}
              height={120}
              className="mx-auto h-20 w-20 md:h-28 md:w-28 lg:h-32 lg:w-32"
            />
          </div>

          {/* Tagline */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            Your AI Identity
            <span className="text-[#137dc5]"> Architect</span>
          </h1>
          
          {/* Pitch */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12 leading-relaxed max-w-4xl mx-auto">
            Transform your experiences into dynamic, shareable profiles that position you as the perfect solution for any job opportunity or professional challenge.
          </p>
          
          {/* CTAs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 max-w-4xl mx-auto">
            <div onClick={() => setShowRegisterModal(true)} className="group cursor-pointer">
              <div className="bg-gradient-to-br from-[#137dc5] via-[#1e7bd4] to-[#0f6ba3] text-white p-8 rounded-2xl text-center hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-white/5 bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] bg-[length:20px_20px]"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M7 14L12 9L17 14M12 15V3M5 20H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Register Interest</h3>
                  <p className="text-blue-100 text-sm">Be first to know when we launch</p>
                </div>
              </div>
            </div>
            
            <Link href="/tools" className="group">
              <div className="bg-gradient-to-br from-violet-600 via-purple-600 to-indigo-600 text-white p-8 rounded-2xl text-center hover:shadow-2xl hover:shadow-violet-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-white/5 bg-[radial-gradient(circle_at_15px_15px,white_1px,transparent_1px)] bg-[length:25px_25px]"></div>
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21.71 20.29L18 16.61A9 9 0 1 0 16.61 18L20.29 21.71A1 1 0 0 0 21.71 20.29ZM11 18A7 7 0 1 1 18 11A7 7 0 0 1 11 18Z" fill="currentColor"/>
                      <circle cx="11" cy="11" r="2" fill="currentColor"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Use Our Tools</h3>
                  <p className="text-violet-100 text-sm">Analyze opportunities & optimize skills</p>
                </div>
              </div>
            </Link>
            
            <Link href="#how-it-works" className="group">
              <div className="bg-gradient-to-br from-emerald-600 to-teal-600 text-white p-8 rounded-2xl text-center hover:shadow-2xl hover:shadow-emerald-500/30 transition-all duration-500 hover:-translate-y-2 hover:scale-105 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20 bg-white/5 bg-[radial-gradient(circle_at_20px_20px,white_1px,transparent_1px)] bg-[length:30px_30px]"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/20 rounded-full blur-2xl group-hover:scale-150 transition-all duration-1000"></div>
                <div className="relative">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2">See How It Works</h3>
                  <p className="text-emerald-100 text-sm">Learn the process behind the magic</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Login Link for Existing Users */}
          <div className="mb-8">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              Already have an account?{' '}
              <Link href="/login" className="text-[#137dc5] hover:text-[#0f6ba3] font-medium underline transition-colors">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Live Global Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Global Platform Activity</p>
              <p className="text-3xl font-bold text-[#137dc5]">
                <span id="trait-counter">2,471,293</span>
              </p>
              <p className="text-sm text-gray-500">traits extracted worldwide</p>
            </div>
            
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-2">Opportunities Analyzed</p>
              <p className="text-3xl font-bold text-purple-600">
                <span id="opportunity-counter">18,247</span>
              </p>
              <p className="text-sm text-gray-500">professional opportunities</p>
            </div>
          </div>
        </div>
      </div>

      <RegisterInterestModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </section>
  );
}