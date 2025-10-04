/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Allow production builds to succeed even if there are ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Allow production builds to succeed even if there are TypeScript errors
    ignoreBuildErrors: true,
  },
  // Optimize build output
  swcMinify: true,
  // Ensure clean builds
  cleanDistDir: true,
  // Experimental features for better stability on Vercel
  experimental: {
    // Improve build stability
    serverComponentsExternalPackages: ['node-appwrite'],
  },
};

export default nextConfig;
