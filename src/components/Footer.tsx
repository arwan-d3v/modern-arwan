"use client";

import React from 'react';
import Link from 'next/link';
import { Mail, Heart } from 'lucide-react';

const GithubIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);



export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full glass border-t border-surface text-text-secondary relative overflow-hidden print:hidden">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-accent-cyan to-transparent opacity-50" />
      
      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 lg:gap-8">
          
          {/* Brand & Value Proposition */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              <h2 className="text-xl font-bold tracking-widest uppercase text-text-primary flex items-center gap-2">
                <span className="w-2 h-2 bg-accent-cyan rounded-full animate-pulse" />
                IS_ARWAN.DEV
              </h2>
            </Link>
            <p className="text-sm leading-relaxed max-w-sm">
              Empowering professionals with state-of-the-art tools. Elevate your career trajectory with our advanced CV Builder and portfolio solutions.
            </p>
            <div className="flex gap-4">
              <a href="https://github.com/arwan-d3v/" target="_blank" rel="noopener noreferrer" className="p-2 dark:bg-white/5 bg-black/5 rounded-md hover:bg-accent-cyan dark:hover:text-black hover:text-white transition-colors">
                <GithubIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">Products</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/tools/cv-builder" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> CV Builder
                </Link>
              </li>
              <li>
                <Link href="/#showcase" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> Portfolio Templates
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> Tech Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Monetization Readiness */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-primary">Legal</h3>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy-policy" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-cyan transition-colors flex items-center gap-2">
                  <span className="w-1 h-1 bg-surface rounded-full" /> Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-surface flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 text-text-secondary">
            <span>&copy; {currentYear}</span>
            <span className="text-text-primary font-bold tracking-wider">IS_ARWAN.DEV</span>
            <span>All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span>Crafted with</span>
            <Heart size={12} className="text-accent-cyan animate-pulse" />
            <span>by</span>
            <a href="https://arwan.dev" target="_blank" rel="noopener noreferrer" className="text-text-primary hover:text-accent-cyan font-bold transition-colors underline decoration-accent-cyan/30 underline-offset-4">
              Arwan
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
