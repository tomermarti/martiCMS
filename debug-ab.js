// Quick debug script
console.log('Testing A/B script generation...')

// Test the function directly
const testScript = `
<!-- Pure Static A/B Testing - No Server Calls! -->
<script src="https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js"></script>
<script>
  // Initialize Mixpanel
  mixpanel.init('e474bceac7e0d60bc3c4cb27aaf1d4f7', {
    debug: false,
    track_pageview: true,
    persistence: 'localStorage',
  });

  console.log('🚀 A/B Testing Script Loaded!');
  console.log('Article ID: test-id');
  console.log('Article Slug: test-slug');
</script>
`;

console.log('Script length:', testScript.length)
console.log('Script preview:', testScript.substring(0, 200))

