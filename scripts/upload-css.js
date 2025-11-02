#!/usr/bin/env node

/**
 * Upload CSS file to Digital Ocean Spaces CDN
 * This script uploads the styles.css file to make it available via CDN
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { uploadFile } from '../lib/spaces.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function uploadCSS() {
  try {
    console.log('📤 Uploading CSS to Digital Ocean Spaces...');
    
    // Read the CSS file
    const cssPath = path.join(__dirname, '../public/styles.css');
    const cssContent = fs.readFileSync(cssPath, 'utf8');
    
    // Upload to CDN with proper content type and caching
    const cssUrl = await uploadFile('assets/styles.css', cssContent, 'text/css');
    
    console.log('✅ CSS uploaded successfully!');
    console.log(`🌐 CDN URL: ${cssUrl}`);
    console.log('');
    console.log('📋 Use this URL in your HTML files:');
    console.log(`<link rel="stylesheet" href="${cssUrl}">`);
    
    return cssUrl;
  } catch (error) {
    console.error('❌ Error uploading CSS:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === __filename) {
  uploadCSS();
}

export { uploadCSS };
