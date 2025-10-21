/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // External packages for server components
  serverExternalPackages: ['node-appwrite'],
  // Optimize production builds
  swcMinify: true,
  reactStrictMode: true,
  // Experimental features for better Vercel compatibility
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  // Output configuration for Vercel
  output: 'standalone',
};

export default nextConfig;
