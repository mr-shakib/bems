#!/usr/bin/env node

/**
 * Workaround for Next.js 15 route group manifest bug
 * Creates empty manifest files that Next.js references but doesn't generate
 */

const fs = require('fs');
const path = require('path');

const manifestFiles = [
  '.next/server/app/(dashboard)/page_client-reference-manifest.js',
  '.next/server/app/(auth)/sign-in/page_client-reference-manifest.js',
  '.next/server/app/(auth)/sign-up/page_client-reference-manifest.js',
  '.next/server/app/(standalone)/workspaces/[workspaceId]/join/[inviteCode]/page_client-reference-manifest.js',
];

console.log('🔧 Fixing missing route group manifest files...');

manifestFiles.forEach((file) => {
  const filePath = path.join(process.cwd(), file);
  const dir = path.dirname(filePath);
  
  // Create directory if it doesn't exist
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  // Create empty manifest file if it doesn't exist
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, 'module.exports = {};\n');
    console.log(`✓ Created ${file}`);
  } else {
    console.log(`  Skipped ${file} (already exists)`);
  }
});

console.log('✅ Manifest fix complete!');
