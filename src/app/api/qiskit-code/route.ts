import { NextRequest, NextResponse } from 'next/server';
import { QiskitCodeGenerator } from '@/lib/qiskit-generator';
import { QuantumGate } from '@/app/quantassist/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { circuit, numQubits, advanced = false } = body;

    // Validate input
    if (!circuit || !Array.isArray(circuit)) {
      return NextResponse.json(
        { error: 'Invalid circuit data' },
        { status: 400 }
      );
    }

    if (!numQubits || typeof numQubits !== 'number' || numQubits < 1 || numQubits > 10) {
      return NextResponse.json(
        { error: 'Invalid number of qubits (must be 1-10)' },
        { status: 400 }
      );
    }

    // Generate Qiskit code
    const result = QiskitCodeGenerator.generateCode(circuit, numQubits);
    
    // Add installation instructions
    const installationInstructions = QiskitCodeGenerator.getInstallationInstructions();
    
    // Include advanced code if requested
    let advancedCode = '';
    if (advanced) {
      advancedCode = QiskitCodeGenerator.getAdvancedCode(circuit, numQubits);
    }

    return NextResponse.json({
      success: true,
      data: {
        ...result,
        installationInstructions,
        advancedCode: advanced ? advancedCode : null,
        circuitStats: {
          totalGates: circuit.length,
          gateTypes: circuit.reduce((acc, gate) => {
            acc[gate.type] = (acc[gate.type] || 0) + 1;
            return acc;
          }, {} as Record<string, number>),
          maxPosition: Math.max(...circuit.map(g => g.position), -1) + 1
        }
      }
    });

  } catch (error) {
    console.error('Error generating Qiskit code:', error);
    return NextResponse.json(
      { error: 'Failed to generate Qiskit code' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Qiskit Code Generator API',
    endpoints: {
      POST: 'Generate Qiskit code from circuit data',
      body: {
        circuit: 'Array of QuantumGate objects',
        numQubits: 'Number of qubits (1-10)',
        advanced: 'Boolean for advanced code (optional)'
      }
    }
  });
} 