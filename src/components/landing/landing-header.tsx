'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { RegisterInterestModal } from '@/components/register-interest-modal';
import Image from 'next/image';

export function LandingHeader() {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="Idynic"
              className="h-8 w-auto"
            />
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="#features" className="text-gray-600 hover:text-[#137dc5] transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-[#137dc5] transition-colors">
              How It Works
            </Link>
            <Link href="#pricing" className="text-gray-600 hover:text-[#137dc5] transition-colors">
              Pricing
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-700 hover:text-[#137dc5] hover:bg-blue-50">
                Log In
              </Button>
            </Link>
            <Button 
              onClick={() => setShowRegisterModal(true)}
              className="bg-[#137dc5] hover:bg-[#0f6ba3] text-white px-6"
            >
              Register Interest
            </Button>
          </div>
        </div>
      </div>

      <RegisterInterestModal 
        isOpen={showRegisterModal} 
        onClose={() => setShowRegisterModal(false)} 
      />
    </header>
  );
}