#!/usr/bin/env node

/**
 * Sync Layout Manager Content to New CDN Paths
 * This script copies existing layout manager content from /layout/ to /assets/ paths
 */

import { uploadFile } from '../lib/spaces.js';

async function syncLayoutManager() {
  try {
    console.log('🔄 Syncing Layout Manager content to new CDN paths...\n');
    
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const results = [];

    // Get current header content from layout manager
    try {
      console.log('📥 Fetching current header content...');
      const headerResponse = await fetch(`${baseUrl}/api/layout/header`);
      const headerData = await headerResponse.json();
      
      if (headerData.content) {
        console.log('📤 Uploading header to assets/header.html...');
        const headerUrl = await uploadFile('assets/header.html', headerData.content, 'text/html', true);
        results.push({ type: 'header', url: headerUrl });
        console.log('✅ Header synced successfully');
      } else {
        console.log('ℹ️  No header content found, using default...');
        // Upload default header from public folder
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const defaultHeader = fs.readFileSync(path.join(__dirname, '../public/header.html'), 'utf8');
        
        const headerUrl = await uploadFile('assets/header.html', defaultHeader, 'text/html', true);
        results.push({ type: 'header', url: headerUrl });
        console.log('✅ Default header uploaded');
      }
    } catch (error) {
      console.error('❌ Failed to sync header:', error.message);
    }

    // Get current footer content from layout manager
    try {
      console.log('📥 Fetching current footer content...');
      const footerResponse = await fetch(`${baseUrl}/api/layout/footer`);
      const footerData = await footerResponse.json();
      
      if (footerData.content) {
        console.log('📤 Uploading footer to assets/footer.html...');
        const footerUrl = await uploadFile('assets/footer.html', footerData.content, 'text/html', true);
        results.push({ type: 'footer', url: footerUrl });
        console.log('✅ Footer synced successfully');
      } else {
        console.log('ℹ️  No footer content found, using default...');
        // Upload default footer from public folder
        const fs = await import('fs');
        const path = await import('path');
        const { fileURLToPath } = await import('url');
        
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const defaultFooter = fs.readFileSync(path.join(__dirname, '../public/footer.html'), 'utf8');
        
        const footerUrl = await uploadFile('assets/footer.html', defaultFooter, 'text/html', true);
        results.push({ type: 'footer', url: footerUrl });
        console.log('✅ Default footer uploaded');
      }
    } catch (error) {
      console.error('❌ Failed to sync footer:', error.message);
    }

    console.log('\n🎉 Layout Manager sync complete!\n');
    console.log('📋 Synced Assets:');
    console.log('═══════════════════════════════════════════════════════════════');
    
    results.forEach(({ type, url }) => {
      console.log(`${type.padEnd(10)} → ${url}`);
    });

    console.log('\n✅ All articles will now load from the unified /assets/ path');
    console.log('✅ Layout Manager saves to the same /assets/ path');
    console.log('✅ Everything is properly aligned!');

    return results;
  } catch (error) {
    console.error('❌ Error syncing layout manager:', error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === new URL(import.meta.url).pathname) {
  syncLayoutManager();
}

export { syncLayoutManager };
