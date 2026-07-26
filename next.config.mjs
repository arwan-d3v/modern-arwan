/** @type {import('next').NextConfig} */
import nextPWA from 'next-pwa';
import withOptimizedImages from 'next-optimized-images';

const withPWA = nextPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

const nextConfig = {
  // Image optimization settings (remote images allowed)
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: '*',
    }],
  },
  // Any other existing Next.js config can go here
};

export default withOptimizedImages(withPWA(nextConfig));
