import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["mongoose"],
  images: {
    remotePatterns: [
      {
        // Google profile pictures
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        // Google photo service
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;
