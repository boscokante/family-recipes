import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // Add Supabase storage domain when you have it
      { protocol: 'https', hostname: '*.supabase.co' },
    ]
  },
};

export default nextConfig;


