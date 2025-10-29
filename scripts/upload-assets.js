#!/usr/bin/env node

/**
 * Upload all static assets to Digital Ocean Spaces CDN
 * This script uploads CSS, header, and footer files to make them available via CDN
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFile } from '../lib/spaces.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadAssets() {
  try {
    console.log('🚀 Uploading all assets to Digital Ocean Spaces CDN...\n');
    
    const publicDir = path.join(__dirname, '../public');
    const assets = [
      {
        local: 'styles.css',
        remote: 'assets/styles.css',
        contentType: 'text/css',
        description: 'Main stylesheet'
      },
      {
        local: 'header.html',
        remote: 'assets/header.html',
        contentType: 'text/html',
        description: 'Header component'
      },
      {
        local: 'footer.html',
        remote: 'assets/footer.html',
        contentType: 'text/html',
        description: 'Footer component'
      }
    ];

    const uploadedAssets = {};

    for (const asset of assets) {
      try {
        console.log(`📤 Uploading ${asset.description}...`);
        
        const localPath = path.join(publicDir, asset.local);
        const content = fs.readFileSync(localPath, 'utf8');
        
        const url = await uploadFile(asset.remote, content, asset.contentType);
        uploadedAssets[asset.local] = url;
        
        console.log(`✅ ${asset.description} uploaded: ${url}`);
      } catch (error) {
        console.error(`❌ Failed to upload ${asset.description}:`, error.message);
      }
    }

    console.log('\n🎉 Asset upload complete!\n');
    console.log('📋 CDN URLs for your assets:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    Object.entries(uploadedAssets).forEach(([file, url]) => {
      console.log(`${file.padEnd(15)} → ${url}`);
    });

    console.log('\n📖 Usage Examples:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    if (uploadedAssets['styles.css']) {
      console.log('CSS Link:');
      console.log(`<link rel="stylesheet" href="${uploadedAssets['styles.css']}">`);
      console.log('');
    }

    if (uploadedAssets['header.html']) {
      console.log('Load Header via JavaScript:');
      console.log(`fetch('${uploadedAssets['header.html']}')`);
      console.log(`  .then(response => response.text())`);
      console.log(`  .then(html => document.getElementById('header').innerHTML = html);`);
      console.log('');
    }

    if (uploadedAssets['footer.html']) {
      console.log('Load Footer via JavaScript:');
      console.log(`fetch('${uploadedAssets['footer.html']}')`);
      console.log(`  .then(response => response.text())`);
      console.log(`  .then(html => document.getElementById('footer').innerHTML = html);`);
      console.log('');
    }

    return uploadedAssets;
  } catch (error) {
    console.error('❌ Error uploading assets:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  uploadAssets();
}

export { uploadAssets };
