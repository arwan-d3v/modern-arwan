/** @type {import('next').NextConfig} */
import withPWA from 'next-pwa';
import withOptimizedImages from 'next-optimized-images';

const nextConfig = {
  // Enable PWA support
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    // additional runtime caching can be added here
  },
  // Image optimization settings (remote images allowed)
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '*',
    }],
  },
  // Any other existing Next.js config can go here
}

export default withOptimizedImages(withPWA(nextConfig));

