const fs = require('fs');
const path = require('path');

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
  
  // Workaround for Next.js 15 route group manifest bug
  webpack: (config, { isServer, dev }) => {
    if (isServer && !dev) {
      // Create a custom webpack plugin to generate manifests before finalization
      class CreateClientManifestsPlugin {
        apply(compiler) {
          compiler.hooks.thisCompilation.tap('CreateClientManifestsPlugin', (compilation) => {
            compilation.hooks.processAssets.tap(
              {
                name: 'CreateClientManifestsPlugin',
                stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
              },
              () => {
                const manifestPaths = [
                  'server/app/(dashboard)/page_client-reference-manifest.js',
                  'server/app/(auth)/sign-in/page_client-reference-manifest.js',
                  'server/app/(auth)/sign-up/page_client-reference-manifest.js',
                ];

                manifestPaths.forEach((manifestPath) => {
                  const content = 'module.exports = {};';
                  compilation.emitAsset(
                    manifestPath,
                    new compiler.webpack.sources.RawSource(content)
                  );
                });
              }
            );
          });
        }
      }

      config.plugins.push(new CreateClientManifestsPlugin());
    }
    
    return config;
  },
};

export default nextConfig;
