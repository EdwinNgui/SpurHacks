import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

export async function GET() {
  return NextResponse.json({ 
    message: 'AI Circuit API is running. Use POST with a userQuery to generate circuits.',
    example: {
      method: 'POST',
      body: { userQuery: 'create a bell state for entanglement' }
    }
  });
}

export async function POST(request: NextRequest) {
  try {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
      console.error('Gemini API key not found in environment variables');
      return NextResponse.json({ 
        error: 'API key not configured. Please set NEXT_PUBLIC_GEMINI_API_KEY or GEMINI_API_KEY environment variable.' 
      }, { status: 500 });
    }

    const { userQuery } = await request.json();
    
    if (!userQuery) {
      return NextResponse.json({ error: 'User query is required' }, { status: 400 });
    }

    const prompt = `You are an expert quantum computing engineer. A user has requested: "${userQuery}"

Your task is to analyze their request and create an appropriate quantum circuit. You must respond with ONLY a valid JSON object.

AVAILABLE GATES:
- H (Hadamard): Creates superposition |0⟩ → (|0⟩ + |1⟩)/√2
- X (Pauli-X): Bit flip |0⟩ ↔ |1⟩
- Y (Pauli-Y): Y rotation with phase flip
- Z (Pauli-Z): Phase flip |1⟩ → -|1⟩
- CNOT: Controlled NOT, flips target if control is |1⟩
- CCNOT (Toffoli): Double controlled NOT
- RX: X-axis rotation with parameter θ
- RY: Y-axis rotation with parameter θ

GATE FORMATS:
- Single qubit: {"id": number, "type": "H|X|Y|Z|RX|RY", "qubit": number, "position": number, "theta": number}
- CNOT: {"id": number, "type": "CNOT", "control": number, "target": number, "position": number}
- CCNOT: {"id": number, "type": "CCNOT", "control": number, "control2": number, "target": number, "position": number}

COMMON CIRCUIT PATTERNS:
1. Bell State (entanglement): [H on qubit 0, CNOT(0→1)]
2. Superposition: [H on any qubit]
3. Quantum Coin Flip: [H on qubit 0]
4. Quantum Interference: [H, Z, H on same qubit]
5. Grover Search: [H on all qubits, oracle, diffuser]
6. Quantum Teleportation: [Bell state prep, CNOT, H, measurements]
7. Quantum Fourier Transform: [H and controlled phase gates]
8. Deutsch-Jozsa: [H on all qubits, oracle, H on all qubits]
9. Measurement Demonstration: [H, then multiple gates to show collapse effects]

MEASUREMENT AND COLLAPSE CONCEPTS:
- Measurement collapses superposition into a definite state
- To demonstrate measurement effects, use multiple gates after creating superposition
- Show how different measurement points affect the final state
- Use interference patterns to demonstrate collapse
- Multiple qubits can show entanglement collapse

ANALYZE THE USER REQUEST:
- Look for keywords: "entangle", "superposition", "random", "search", "teleport", "fourier", "deutsch", "grover", "bell", "coin flip", "interference", "measurement", "collapse", "observe", "detect"
- For measurement requests: Create circuits that show before/after measurement states
- For collapse demonstrations: Use interference patterns that change based on measurement
- Determine the number of qubits needed
- Choose appropriate gates and sequence
- Ensure the circuit actually implements what was requested

RESPONSE FORMAT (JSON ONLY):
{
  "explanation": "Detailed explanation of what this circuit does and why it matches the user's request",
  "circuit": [array of gate objects],
  "qubits": number,
  "algorithm": "Algorithm name",
  "description": "Brief description"
}

EXAMPLE FOR "show measurement collapse":
{
  "explanation": "This circuit demonstrates quantum measurement collapse. First, a Hadamard gate creates superposition. Then, additional gates show how the quantum state evolves. The final measurement will collapse the superposition into a definite state, showing the probabilistic nature of quantum measurement.",
  "circuit": [
    {"id": 1, "type": "H", "qubit": 0, "position": 0},
    {"id": 2, "type": "Z", "qubit": 0, "position": 1},
    {"id": 3, "type": "H", "qubit": 0, "position": 2}
  ],
  "qubits": 1,
  "algorithm": "Measurement Collapse Demonstration",
  "description": "Shows how measurement collapses quantum superposition"
}

EXAMPLE FOR "measurement in entanglement":
{
  "explanation": "This circuit creates entanglement and then demonstrates how measurement of one qubit affects the other. The Bell state preparation creates entanglement, and the additional gates show how measurement collapses the entangled state.",
  "circuit": [
    {"id": 1, "type": "H", "qubit": 0, "position": 0},
    {"id": 2, "type": "CNOT", "control": 0, "target": 1, "position": 1},
    {"id": 3, "type": "H", "qubit": 0, "position": 2},
    {"id": 4, "type": "Z", "qubit": 1, "position": 2}
  ],
  "qubits": 2,
  "algorithm": "Entangled Measurement",
  "description": "Demonstrates measurement collapse in entangled systems"
}

IMPORTANT: 
- Only use the available gates listed above
- Ensure each gate has all required fields
- Make sure the circuit actually implements what the user requested
- Provide a detailed explanation of how the circuit works
- Use appropriate number of qubits for the task
- For measurement demonstrations, include multiple gates to show the effect`;

    console.log('User query:', userQuery); // Debug log
    console.log('Sending prompt to Gemini:', prompt); // Debug log
    
    const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.3, // Lower temperature for more consistent responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error:', errorText);
      return NextResponse.json({ error: `Gemini API failed: ${response.status}` }, { status: response.status });
    }

    const data = await response.json();
    
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error('Invalid Gemini API response format:', data);
      return NextResponse.json({ error: 'Invalid Gemini API response format' }, { status: 500 });
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    console.log('Raw AI response:', aiResponse); // Debug log
    console.log('Response length:', aiResponse.length); // Debug log
    
    // Try to parse the JSON response
    const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('Parsed JSON:', parsed); // Debug log
        
        // Validate the parsed circuit
        if (parsed.circuit && Array.isArray(parsed.circuit)) {
          const validCircuit = parsed.circuit.filter((gate: any) => {
            if (!gate || typeof gate !== 'object' || Object.keys(gate).length === 0) {
              console.warn('API: Empty gate found in AI response:', gate);
              return false;
            }
            return true;
          });
          console.log('API: Validated circuit length:', validCircuit.length, 'Original length:', parsed.circuit.length);
          parsed.circuit = validCircuit;
        }
        
        // Validate required fields
        if (!parsed.explanation || !parsed.circuit || !parsed.qubits) {
          console.warn('API: Missing required fields in parsed response, using fallback');
          throw new Error('Missing required fields');
        }
        
        return NextResponse.json({
          success: true,
          explanation: parsed.explanation,
          circuit: parsed.circuit,
          qubits: parsed.qubits,
          algorithm: parsed.algorithm || 'Custom Circuit',
          description: parsed.description || 'Quantum circuit based on user request'
        });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Failed to parse:', jsonMatch[0]);
        // Use intelligent fallback based on user query
        return generateIntelligentFallback(userQuery);
      }
    } else {
      console.warn('No JSON found in AI response, using intelligent fallback');
      // Use intelligent fallback based on user query
      return generateIntelligentFallback(userQuery);
    }
  } catch (error) {
    console.error('Error in ai-circuit route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Intelligent fallback based on user query
function generateIntelligentFallback(userQuery: string) {
  const lowerQuery = userQuery.toLowerCase();
  
  // Measurement and collapse related requests
  if (lowerQuery.includes('measurement') || lowerQuery.includes('collapse') || lowerQuery.includes('observe') || lowerQuery.includes('detect')) {
    if (lowerQuery.includes('entangle') || lowerQuery.includes('bell')) {
      return NextResponse.json({
        success: true,
        explanation: "This circuit demonstrates measurement collapse in entangled systems. First, we create a Bell state (entanglement), then apply additional gates to show how measurement affects the entangled state. The measurement will collapse the superposition and reveal the correlated nature of entangled qubits.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
          { id: 3, type: 'H', qubit: 0, position: 2 },
          { id: 4, type: 'Z', qubit: 1, position: 2 }
        ],
        qubits: 2,
        algorithm: "Entangled Measurement Collapse",
        description: "Demonstrates measurement collapse in entangled quantum systems"
      });
    } else {
      return NextResponse.json({
        success: true,
        explanation: "This circuit demonstrates quantum measurement collapse. The Hadamard gate creates superposition, then additional gates show how the quantum state evolves. The final measurement will collapse the superposition into a definite state, demonstrating the probabilistic nature of quantum measurement and the difference between quantum and classical behavior.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'Z', qubit: 0, position: 1 },
          { id: 3, type: 'H', qubit: 0, position: 2 }
        ],
        qubits: 1,
        algorithm: "Measurement Collapse Demonstration",
        description: "Shows how measurement collapses quantum superposition"
      });
    }
  }
  
  if (lowerQuery.includes('entangle') || lowerQuery.includes('bell') || lowerQuery.includes('correlate')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll create a Bell state to demonstrate quantum entanglement. This circuit puts two qubits in a maximally entangled state where measuring one instantly affects the other, regardless of distance.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 }
      ],
      qubits: 2,
      algorithm: "Bell State Creation",
      description: "Creates maximum entanglement between two qubits"
    });
  }
  
  if (lowerQuery.includes('superposition') || lowerQuery.includes('both states') || lowerQuery.includes('0 and 1')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll create a superposition state where a qubit exists in both |0⟩ and |1⟩ states simultaneously. The Hadamard gate creates this quantum superposition.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 }
      ],
      qubits: 1,
      algorithm: "Quantum Superposition",
      description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
    });
  }
  
  if (lowerQuery.includes('coin flip') || lowerQuery.includes('random') || lowerQuery.includes('50/50')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll build a true quantum random number generator. Unlike classical randomness, this uses quantum superposition to create genuinely random results.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 }
      ],
      qubits: 1,
      algorithm: "Quantum Coin Flip",
      description: "True random coin flip using quantum superposition"
    });
  }
  
  if (lowerQuery.includes('interference') || lowerQuery.includes('wave') || lowerQuery.includes('cancel')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll demonstrate quantum interference where quantum states can constructively or destructively interfere, similar to waves in physics.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'Z', qubit: 0, position: 1 },
        { id: 3, type: 'H', qubit: 0, position: 2 }
      ],
      qubits: 1,
      algorithm: "Quantum Interference",
      description: "Demonstrates wave-like interference in quantum systems"
    });
  }
  
  if (lowerQuery.includes('search') || lowerQuery.includes('grover') || lowerQuery.includes('find')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll implement a simplified Grover search algorithm. This quantum algorithm can search unsorted databases quadratically faster than classical methods.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'H', qubit: 1, position: 0 },
        { id: 3, type: 'Z', qubit: 0, position: 1 },
        { id: 4, type: 'Z', qubit: 1, position: 1 },
        { id: 5, type: 'H', qubit: 0, position: 2 },
        { id: 6, type: 'H', qubit: 1, position: 2 }
      ],
      qubits: 2,
      algorithm: "Grover Search",
      description: "Quantum search algorithm for 2 qubits"
    });
  }
  
  if (lowerQuery.includes('teleport') || lowerQuery.includes('teleportation')) {
    return NextResponse.json({
      success: true,
      explanation: "I'll create a quantum teleportation circuit. This demonstrates how quantum information can be transferred between qubits using entanglement.",
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
        { id: 3, type: 'CNOT', control: 2, target: 0, position: 2 },
        { id: 4, type: 'H', qubit: 2, position: 3 }
      ],
      qubits: 3,
      algorithm: "Quantum Teleportation",
      description: "Transfers quantum state between qubits using entanglement"
    });
  }
  
  // Default to superposition
  return NextResponse.json({
    success: true,
    explanation: "I understand you want to explore quantum computing! Let me show you quantum superposition - a fundamental concept where particles exist in multiple states simultaneously.",
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 }
    ],
    qubits: 1,
    algorithm: "Quantum Superposition",
    description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
  });
} 