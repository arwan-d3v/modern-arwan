/** @type {import('next').NextConfig} */
import withPWAInit from 'next-pwa';

const withPWA = withPWAInit({
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
}

export default withPWA(nextConfig);
