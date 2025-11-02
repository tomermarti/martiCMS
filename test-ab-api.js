// Quick test script to debug the A/B test API
const testData = {
  name: "Test Headline",
  description: "Testing different headlines",
  articleId: "test-article-123", // You'll need to use a real article ID
  testType: "headline",
  distributionMode: "manual",
  variants: [
    {
      name: "Control",
      description: "Original headline",
      trafficPercent: 50,
      isControl: true,
      changes: {}
    },
    {
      name: "Variant A",
      description: "New headline",
      trafficPercent: 50,
      isControl: false,
      changes: {
        title: "New Test Headline"
      }
    }
  ]
};

console.log('Test data:', JSON.stringify(testData, null, 2));

// You can use this to test the API manually:
// curl -X POST http://localhost:3000/api/ab-tests \
//   -H "Content-Type: application/json" \
//   -d 'paste the JSON above here'

