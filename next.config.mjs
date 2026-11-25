/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
    ],
  },
  // Policy pages moved to the spec's URLs; keep the old ones working.
  async redirects() {
    return [
      { source: '/privacy', destination: '/privacy-policy', permanent: true },
      { source: '/terms', destination: '/terms-conditions', permanent: true },
      { source: '/shipping', destination: '/shipping-delivery', permanent: true },
      { source: '/returns', destination: '/returns-refunds', permanent: true },
    ];
  },
};

export default nextConfig;
