// next.config.cjs
// CommonJS configuration for Next.js with PWA and optimized images
const withPWA = require('next-pwa');
const withOptimizedImages = require('next-optimized-images');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable PWA support
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
  },
  // Image optimization settings (remote images allowed)
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '*',
    }],
  },
};

module.exports = withOptimizedImages(withPWA(nextConfig));
