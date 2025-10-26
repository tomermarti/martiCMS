#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🔍 MartiCMS Setup Verification\n');
console.log('================================\n');

let hasErrors = false;

// Check .env file
console.log('📝 Checking .env file...');
if (fs.existsSync('.env')) {
  console.log('   ✅ .env file exists');
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'DATABASE_URL',
    'DO_SPACES_KEY',
    'DO_SPACES_SECRET',
    'DO_SPACES_BUCKET',
    'DO_SPACES_REGION',
    'DO_SPACES_ENDPOINT'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(`${varName}=`)) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ❌ ${varName} is missing`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ .env file not found');
  console.log('   💡 Copy .env.example to .env and fill in your credentials');
  hasErrors = true;
}

console.log('');

// Check node_modules
console.log('📦 Checking dependencies...');
if (fs.existsSync('node_modules')) {
  console.log('   ✅ node_modules exists');
  
  const requiredPackages = [
    '@prisma/client',
    '@aws-sdk/client-s3',
    'next',
    'react'
  ];
  
  requiredPackages.forEach(pkg => {
    const pkgPath = path.join('node_modules', pkg);
    if (fs.existsSync(pkgPath)) {
      console.log(`   ✅ ${pkg} installed`);
    } else {
      console.log(`   ❌ ${pkg} not installed`);
      hasErrors = true;
    }
  });
} else {
  console.log('   ❌ node_modules not found');
  console.log('   💡 Run: npm install');
  hasErrors = true;
}

console.log('');

// Check Prisma
console.log('🗄️  Checking Prisma setup...');
if (fs.existsSync('node_modules/.prisma/client')) {
  console.log('   ✅ Prisma Client generated');
} else {
  console.log('   ❌ Prisma Client not generated');
  console.log('   💡 Run: npx prisma generate');
  hasErrors = true;
}

if (fs.existsSync('prisma/schema.prisma')) {
  console.log('   ✅ Prisma schema exists');
} else {
  console.log('   ❌ Prisma schema not found');
  hasErrors = true;
}

console.log('');

// Check required directories
console.log('📁 Checking project structure...');
const requiredDirs = [
  'app',
  'app/api',
  'app/articles',
  'components',
  'lib',
  'prisma'
];

requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`   ✅ ${dir}/ exists`);
  } else {
    console.log(`   ❌ ${dir}/ not found`);
    hasErrors = true;
  }
});

console.log('');

// Check key files
console.log('📄 Checking key files...');
const requiredFiles = [
  'package.json',
  'tsconfig.json',
  'next.config.js',
  'global.css',
  'lib/prisma.ts',
  'lib/spaces.ts',
  'lib/template.ts',
  'components/ArticleForm.tsx',
  'components/ImageUpload.tsx'
];

requiredFiles.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file} not found`);
    hasErrors = true;
  }
});

console.log('');
console.log('================================\n');

if (hasErrors) {
  console.log('❌ Setup verification failed!');
  console.log('\nPlease fix the issues above and run verification again:\n');
  console.log('   node scripts/verify-setup.js\n');
  process.exit(1);
} else {
  console.log('✅ All checks passed!');
  console.log('\nYour MartiCMS is ready to use!\n');
  console.log('Next steps:');
  console.log('1. Run: npm run dev');
  console.log('2. Visit: http://localhost:3000');
  console.log('3. Create your first article!\n');
  console.log('For deployment instructions, see DEPLOYMENT.md\n');
  process.exit(0);
}

