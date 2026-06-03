import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Allow the URAP engine to be called server-side
  async headers() {
    return [{ source: '/(.*)', headers: [{ key: 'X-Frame-Options', value: 'SAMEORIGIN' }] }];
  },
};

export default nextConfig;
