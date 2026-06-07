module.exports = {
  // Destination folder for generated service worker and assets
  dest: 'public',
  // Disable PWA in development to avoid unnecessary caches
  disable: process.env.NODE_ENV === 'development',
  // Runtime caching strategies can be added here
  runtimeCaching: [],
};
