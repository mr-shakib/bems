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
  // Ensure clean builds
  cleanDistDir: true,
  // External packages for server components
  serverExternalPackages: ['node-appwrite'],
};

export default nextConfig;
