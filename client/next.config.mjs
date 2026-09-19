/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  async rewrites() {
    // In local dev, rewrites cleanly route API requests to Express server
    const target = process.env.INTERNAL_SERVER_URL || process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5000';
    return [
      {
        source: '/api/cars/:path*',
        destination: `${target}/api/cars/:path*`,
      },
      {
        source: '/api/cars',
        destination: `${target}/api/cars`,
      },
      {
        source: '/api/my-cars/:path*',
        destination: `${target}/api/my-cars/:path*`,
      },
      {
        source: '/api/my-cars',
        destination: `${target}/api/my-cars`,
      },
      {
        source: '/api/bookings/:path*',
        destination: `${target}/api/bookings/:path*`,
      },
      {
        source: '/api/bookings',
        destination: `${target}/api/bookings`,
      },
      {
        source: '/api/users/:path*',
        destination: `${target}/api/users/:path*`,
      },
    ];
  },
};

export default nextConfig;
