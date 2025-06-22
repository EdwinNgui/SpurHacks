import { NextRequest, NextResponse } from 'next/server';

const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

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

    const prompt = `You are a quantum computing expert. A user wants to create a quantum circuit based on this request: "${userQuery}"

Please respond with a JSON object that includes:
1. An explanation of what the circuit does
2. The circuit as an array of quantum gates
3. The number of qubits needed
4. The algorithm name and description

Available gates: H (Hadamard), X (Pauli-X), Y (Pauli-Y), Z (Pauli-Z), CNOT, CCNOT (Toffoli), RX, RY, MEASURE

Gate format:
- Single qubit gates: { "id": number, "type": "H|X|Y|Z|RX|RY|MEASURE", "qubit": number, "position": number }
- CNOT: { "id": number, "type": "CNOT", "control": number, "target": number, "position": number }
- CCNOT: { "id": number, "type": "CCNOT", "control": number, "control2": number, "target": number, "position": number }

Common quantum circuits to consider:
- Bell state (entanglement): H on qubit 0, then CNOT with control=0, target=1
- Superposition: H gate on a qubit
- Quantum coin flip: H gate then measure
- Quantum interference: H, then Z, then H
- Grover search: Multiple H gates, oracle, diffuser

Respond only with valid JSON. Example response format:
{
  "explanation": "This circuit creates a Bell state...",
  "circuit": [{"id": 1, "type": "H", "qubit": 0, "position": 0}, ...],
  "qubits": 2,
  "algorithm": "Bell State Creation",
  "description": "Creates maximum entanglement between two qubits"
}`;

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
          temperature: 0.7,
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
      return NextResponse.json({ error: 'Invalid Gemini API response format' }, { status: 500 });
    }
    
    const aiResponse = data.candidates[0].content.parts[0].text;
    
    console.log('Raw AI response:', aiResponse); // Debug log
    
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
        
        return NextResponse.json({
          success: true,
          explanation: parsed.explanation || "Circuit generated successfully!",
          circuit: parsed.circuit || [],
          qubits: parsed.qubits || 1,
          algorithm: parsed.algorithm,
          description: parsed.description
        });
      } catch (parseError) {
        console.error('JSON parsing error:', parseError);
        console.error('Failed to parse:', jsonMatch[0]);
        // Fall back to generating a basic circuit
        return NextResponse.json({
          success: true,
          explanation: "I'll create a basic quantum superposition circuit for you.",
          circuit: [
            { id: 1, type: 'H', qubit: 0, position: 0 },
            { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
          ],
          qubits: 1,
          algorithm: "Quantum Superposition",
          description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
        });
      }
    } else {
      console.warn('No JSON found in AI response, using fallback');
      // Fall back to generating a basic circuit
      return NextResponse.json({
        success: true,
        explanation: "I'll create a basic quantum superposition circuit for you.",
        circuit: [
          { id: 1, type: 'H', qubit: 0, position: 0 },
          { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
        ],
        qubits: 1,
        algorithm: "Quantum Superposition",
        description: "Puts a qubit in equal superposition of |0⟩ and |1⟩"
      });
    }
    
  } catch (error) {
    console.error('Error in ai-circuit route:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 