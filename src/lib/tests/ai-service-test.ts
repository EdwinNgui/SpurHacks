import { aiService } from '../ai-service';

// Simple test to verify AI service functionality
export async function testAIService() {
  console.log('Testing AI Service...');
  
  try {
    // Test circuit generation
    const result = await aiService.generateCircuitFromPrompt('Create a quantum coin flip');
    console.log('Circuit Generation Test:', {
      success: !!result,
      qubits: result.qubits,
      circuitLength: result.circuit.length,
      explanation: result.explanation.substring(0, 100) + '...'
    });
    
    // Test concept explanation
    const explanation = await aiService.explainQuantumConcept('superposition');
    console.log('Concept Explanation Test:', {
      success: !!explanation,
      length: explanation.length
    });
    
    console.log('✅ AI Service tests completed successfully');
    return true;
  } catch (error) {
    console.error('❌ AI Service test failed:', error);
    return false;
  }
}

// Export for use in development
if (typeof window !== 'undefined') {
  (window as any).testAIService = testAIService;
} 