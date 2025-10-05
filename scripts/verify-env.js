/**
 * Environment Variables Verification Script
 * Run this to verify all required environment variables are set
 * Usage: node scripts/verify-env.js
 */

const requiredEnvVars = {
  // App Configuration
  'NEXT_PUBLIC_APP_URL': {
    description: 'Application URL (use https://bems.space for production)',
    critical: true,
    production: 'https://bems.space',
    development: 'http://localhost:3000'
  },
  
  // Appwrite Client Configuration
  'NEXT_PUBLIC_APPWRITE_ENDPOINT': {
    description: 'Appwrite API endpoint',
    critical: true,
    example: 'https://fra.cloud.appwrite.io/v1'
  },
  'NEXT_PUBLIC_APPWRITE_PROJECT': {
    description: 'Appwrite project ID',
    critical: true,
    example: '68a35934000d7fdba65d'
  },
  'NEXT_PUBLIC_APPWRITE_DATABASE_ID': {
    description: 'Appwrite database ID',
    critical: true,
    example: '68a35a0c003c1920a347'
  },
  'NEXT_PUBLIC_APPWRITE_WORKSPACES_ID': {
    description: 'Appwrite workspaces collection ID',
    critical: true,
    example: '68a35a81002b38fabbf3'
  },
  'NEXT_PUBLIC_APPWRITE_PROJECTS_ID': {
    description: 'Appwrite projects collection ID',
    critical: true,
    example: '68a35a2f00155fd39254'
  },
  'NEXT_PUBLIC_APPWRITE_MEMBERS_ID': {
    description: 'Appwrite members collection ID',
    critical: true,
    example: '68a35a71000b6cff830f'
  },
  'NEXT_PUBLIC_APPWRITE_TASKS_ID': {
    description: 'Appwrite tasks collection ID',
    critical: true,
    example: '68a9fdee00116a96e475'
  },
  'NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID': {
    description: 'Appwrite images bucket ID',
    critical: true,
    example: '68a35c5d0009e6c6f5a2'
  },
  
  // Appwrite Server Configuration
  'NEXT_APPWRITE_KEY': {
    description: 'Appwrite server API key (SECRET - do not expose)',
    critical: true,
    secret: true,
    example: 'standard_xxxxxxxxxxxxx...'
  },
  
  // Cloudinary Configuration
  'NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME': {
    description: 'Cloudinary cloud name',
    critical: true,
    example: 'dgn2nezo7'
  },
  'NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET': {
    description: 'Cloudinary upload preset',
    critical: true,
    example: 'bems_profile_pictures'
  },
  'CLOUDINARY_API_KEY': {
    description: 'Cloudinary API key (SECRET)',
    critical: false,
    secret: true,
    example: '154781953695782'
  },
  'CLOUDINARY_API_SECRET': {
    description: 'Cloudinary API secret (SECRET)',
    critical: false,
    secret: true,
    example: 'xxxxxxxxxxxxx'
  }
};

console.log('\n🔍 BEMS Environment Variables Verification\n');
console.log('='.repeat(70));

let missingVars = [];
let presentVars = [];
let warnings = [];

// Check each required variable
for (const [varName, config] of Object.entries(requiredEnvVars)) {
  const value = process.env[varName];
  const isSet = value && value.length > 0;
  
  if (isSet) {
    presentVars.push(varName);
    const displayValue = config.secret 
      ? `${value.substring(0, 10)}...` 
      : value;
    
    console.log(`✅ ${varName}`);
    console.log(`   └─ ${config.description}`);
    console.log(`   └─ Value: ${displayValue}\n`);
    
    // Check for common issues
    if (varName === 'NEXT_PUBLIC_APP_URL') {
      if (value.includes('localhost') && process.env.NODE_ENV === 'production') {
        warnings.push({
          var: varName,
          message: '⚠️  Using localhost URL in production! Should be https://bems.space'
        });
      }
      if (!value.startsWith('http://') && !value.startsWith('https://')) {
        warnings.push({
          var: varName,
          message: '⚠️  URL should start with http:// or https://'
        });
      }
    }
  } else {
    missingVars.push({ name: varName, ...config });
    console.log(`❌ ${varName} - MISSING`);
    console.log(`   └─ ${config.description}`);
    console.log(`   └─ Example: ${config.example || 'N/A'}\n`);
  }
}

console.log('='.repeat(70));
console.log('\n📊 Summary:\n');
console.log(`Total variables checked: ${Object.keys(requiredEnvVars).length}`);
console.log(`✅ Present: ${presentVars.length}`);
console.log(`❌ Missing: ${missingVars.length}`);

if (warnings.length > 0) {
  console.log('\n⚠️  Warnings:\n');
  warnings.forEach(w => {
    console.log(`   ${w.var}: ${w.message}`);
  });
}

if (missingVars.length > 0) {
  console.log('\n❌ Missing Required Variables:\n');
  missingVars.forEach(v => {
    console.log(`   • ${v.name}`);
    console.log(`     ${v.description}`);
    if (v.example) {
      console.log(`     Example: ${v.example}`);
    }
    console.log('');
  });
  
  console.log('💡 To fix:');
  console.log('   1. Create a .env.local file in the project root');
  console.log('   2. Add the missing variables with their values');
  console.log('   3. For Vercel, add them in: Settings → Environment Variables\n');
  
  process.exit(1);
}

console.log('\n✨ All required environment variables are set!\n');

// Additional production checks
if (process.env.NODE_ENV === 'production' || process.env.VERCEL) {
  console.log('🚀 Production Environment Checks:\n');
  
  const prodChecks = [];
  
  if (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost')) {
    prodChecks.push('❌ APP_URL should be production URL (https://bems.space)');
  } else {
    prodChecks.push('✅ APP_URL is set to production domain');
  }
  
  if (process.env.NEXT_APPWRITE_KEY?.includes('standard_')) {
    prodChecks.push('✅ Appwrite API key is set');
  } else {
    prodChecks.push('❌ Appwrite API key might be invalid');
  }
  
  prodChecks.forEach(check => console.log(`   ${check}`));
  console.log('');
}

console.log('='.repeat(70));
console.log('\n');
