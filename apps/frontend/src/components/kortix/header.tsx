'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export function KortixHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-black">
              Kortix
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-600 hover:text-black transition-colors">
              Home
            </Link>
            <Link href="/about" className="text-gray-600 hover:text-black transition-colors">
              About
            </Link>
            <Link href="/careers" className="text-gray-600 hover:text-black transition-colors">
              Careers
            </Link>
          </nav>

          {/* Mobile Download Section */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="text-center">
              <div className="text-sm text-gray-600 mb-1">Mobile</div>
              <div className="bg-gray-100 p-2 rounded-lg inline-block">
                {/* QR Code placeholder - you can replace with actual QR code */}
                <div className="w-12 h-12 bg-black rounded"></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">Scan to download</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Scan to download</div>
              <div className="text-sm font-medium">iOS & Android</div>
              <button className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Get started
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center space-y-1">
              <div className={`w-6 h-0.5 bg-black transition-transform ${mobileMenuOpen ? 'rotate-45 translate-y-2.5' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-black transition-opacity ${mobileMenuOpen ? 'opacity-0' : ''}`}></div>
              <div className={`w-6 h-0.5 bg-black transition-transform ${mobileMenuOpen ? '-rotate-45 -translate-y-2.5' : ''}`}></div>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <nav className="flex flex-col space-y-4">
              <Link href="/" className="text-gray-600 hover:text-black transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-gray-600 hover:text-black transition-colors">
                About
              </Link>
              <Link href="/careers" className="text-gray-600 hover:text-black transition-colors">
                Careers
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
