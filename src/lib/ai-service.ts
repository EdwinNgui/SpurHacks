import { QuantumGate } from '@/app/quantassist/types';

// Use server-side API route to avoid CORS issues
const API_BASE_URL = '/api';

export interface AIResponse {
  explanation: string;
  circuit: QuantumGate[];
  qubits: number;
  algorithm?: string;
  description?: string;
}

export interface CircuitAnalysis {
  explanation: string;
  insights: string[];
  recommendations: string[];
}

class AIService {
  private async callGeminiAPI(prompt: string): Promise<string> {
    try {
      const response = await fetch(`${API_BASE_URL}/test-gemini`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API call failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success || !data.response) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid API response format');
      }
      
      return data.response;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  async generateCircuitFromPrompt(userQuery: string): Promise<AIResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-circuit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userQuery })
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('API Error Response:', errorData);
        throw new Error(`API call failed: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        console.error('Unexpected API response format:', data);
        throw new Error('Invalid API response format');
      }
      
      return {
        explanation: data.explanation,
        circuit: data.circuit,
        qubits: data.qubits,
        algorithm: data.algorithm,
        description: data.description
      };
    } catch (error) {
      console.error('Error generating circuit:', error);
      return this.generateFallbackCircuit(userQuery);
    }
  }

  private generateFallbackCircuit(userQuery: string): AIResponse {
    const lowerQuery = userQuery.toLowerCase();
    
    if (lowerQuery.includes('entangle') || lowerQuery.includes('bell')) {
      return {
        explanation: "I'll create a Bell state to demonstrate quantum entanglement. This circuit puts two qubits in a maximally entangled state where measuring one instantly affects the other.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
          { id: 3, type: 'MEASURE', qubit: 0, position: 2 },
          { id: 4, type: 'MEASURE', qubit: 1, position: 2 }
        ],
        qubits: 2,
        algorithm: "Bell State Creation",
        description: "Creates maximum entanglement between two qubits"
      };
    } else if (lowerQuery.includes('superposition')) {
      return {
        explanation: "I'll create a superposition state where a qubit exists in both |0⟩ and |1⟩ states simultaneously. The Hadamard gate creates this quantum superposition.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
        ],
        qubits: 1,
        algorithm: "Quantum Superposition",
        description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
      };
    } else if (lowerQuery.includes('coin flip') || lowerQuery.includes('random')) {
      return {
        explanation: "I'll build a true quantum random number generator. Unlike classical randomness, this uses quantum superposition to create genuinely random results.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
        ],
        qubits: 1,
        algorithm: "Quantum Coin Flip",
        description: "True random coin flip using quantum superposition"
      };
    } else if (lowerQuery.includes('interference') || lowerQuery.includes('wave')) {
      return {
        explanation: "I'll demonstrate quantum interference where quantum states can constructively or destructively interfere, similar to waves in physics.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'Z', qubit: 0, position: 1 },
          { id: 3, type: 'H', qubit: 0, position: 2 },
          { id: 4, type: 'MEASURE', qubit: 0, position: 3 }
        ],
        qubits: 1,
        algorithm: "Quantum Interference",
        description: "Demonstrates wave-like interference in quantum systems"
      };
    } else if (lowerQuery.includes('search') || lowerQuery.includes('grover')) {
      return {
        explanation: "I'll implement a simplified Grover search algorithm. This quantum algorithm can search unsorted databases quadratically faster than classical methods.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'H', qubit: 1, position: 0 },
          { id: 3, type: 'Z', qubit: 0, position: 1 },
          { id: 4, type: 'Z', qubit: 1, position: 1 },
          { id: 5, type: 'H', qubit: 0, position: 2 },
          { id: 6, type: 'H', qubit: 1, position: 2 },
          { id: 7, type: 'MEASURE', qubit: 0, position: 3 },
          { id: 8, type: 'MEASURE', qubit: 1, position: 3 }
        ],
        qubits: 2,
        algorithm: "Grover Search",
        description: "Quantum search algorithm for 2 qubits"
      };
    } else {
      // Default to a simple superposition circuit
      return {
        explanation: "I understand you want to explore quantum computing! Let me show you quantum superposition - a fundamental concept where particles exist in multiple states simultaneously.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
        ],
        qubits: 1,
        algorithm: "Quantum Superposition",
        description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
      };
    }
  }

  async analyzeCircuit(circuit: QuantumGate[], numQubits: number, simulationResult: any): Promise<CircuitAnalysis> {
    const circuitDescription = circuit.map(gate => {
      if (gate.type === 'CNOT') {
        return `CNOT(control=${gate.control}, target=${gate.target})`;
      } else if (gate.type === 'CCNOT') {
        return `CCNOT(control=${gate.control}, control2=${gate.control2}, target=${gate.target})`;
      } else {
        return `${gate.type}(${gate.qubit})`;
      }
    }).join(' → ');

    const prompt = `Analyze this quantum circuit:

Circuit: ${circuitDescription}
Number of qubits: ${numQubits}
Simulation results: ${JSON.stringify(simulationResult)}

Please provide:
1. A clear explanation of what this circuit does
2. Key insights about the quantum behavior
3. Recommendations for improvements or variations

Respond in JSON format:
{
  "explanation": "This circuit...",
  "insights": ["Insight 1", "Insight 2"],
  "recommendations": ["Recommendation 1", "Recommendation 2"]
}`;

    try {
      const response = await this.callGeminiAPI(prompt);
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      } else {
        return {
          explanation: "This circuit demonstrates interesting quantum behavior. The simulation shows the probability distribution of measurement outcomes.",
          insights: ["The circuit creates quantum superposition", "Measurement results show quantum interference effects"],
          recommendations: ["Try adding more gates to see different behaviors", "Experiment with different gate sequences"]
        };
      }
    } catch (error) {
      console.error('Error analyzing circuit:', error);
      return {
        explanation: "This circuit demonstrates interesting quantum behavior. The simulation shows the probability distribution of measurement outcomes.",
        insights: ["The circuit creates quantum superposition", "Measurement results show quantum interference effects"],
        recommendations: ["Try adding more gates to see different behaviors", "Experiment with different gate sequences"]
      };
    }
  }

  async explainQuantumConcept(concept: string): Promise<string> {
    const prompt = `Explain the quantum computing concept "${concept}" in simple terms that a beginner can understand. Focus on practical applications and why it's important in quantum computing. Keep the explanation under 200 words.`;

    try {
      const response = await this.callGeminiAPI(prompt);
      return response;
    } catch (error) {
      console.error('Error explaining concept:', error);
      return `Quantum ${concept} is a fundamental concept in quantum computing that allows us to process information in ways that classical computers cannot. It's one of the key principles that makes quantum computing so powerful.`;
    }
  }
}

export const aiService = new AIService(); 