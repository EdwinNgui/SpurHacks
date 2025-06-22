// Test script for AI circuit generation
const testPrompts = [
  "create a bell state for entanglement",
  "make a quantum superposition",
  "build a quantum coin flip",
  "create quantum interference",
  "implement grover search",
  "make a random circuit"
];

async function testAICircuit(prompt) {
  try {
    console.log(`\n🧪 Testing prompt: "${prompt}"`);
    
    const response = await fetch('http://localhost:3000/api/ai-circuit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userQuery: prompt })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log('✅ Success!');
      console.log('📝 Explanation:', result.explanation);
      console.log('🔧 Circuit:', JSON.stringify(result.circuit, null, 2));
      console.log('🔢 Qubits:', result.qubits);
      console.log('📋 Algorithm:', result.algorithm);
    } else {
      console.log('❌ Error:', result.error);
    }
  } catch (error) {
    console.log('❌ Network error:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting AI Circuit Tests...');
  
  for (const prompt of testPrompts) {
    await testAICircuit(prompt);
    // Wait a bit between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✨ Tests completed!');
}

// Run tests if this script is executed directly
if (typeof window === 'undefined') {
  runTests().catch(console.error);
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testAICircuits = runTests;
  window.testSinglePrompt = testAICircuit;
  console.log('🧪 Test functions available:');
  console.log('- window.testAICircuits() - Run all tests');
  console.log('- window.testSinglePrompt("your prompt") - Test single prompt');
} 