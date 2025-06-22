import { NextResponse } from 'next/server';
import { QiskitCodeGenerator } from '@/lib/qiskit-generator';

export async function GET() {
  try {
    // Test circuit: Bell state
    const testCircuit = [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
      { id: 3, type: 'MEASURE', qubit: 0, position: 2 },
      { id: 4, type: 'MEASURE', qubit: 1, position: 2 }
    ];

    const result = QiskitCodeGenerator.generateCode(testCircuit, 2);
    const installationInstructions = QiskitCodeGenerator.getInstallationInstructions();

    return NextResponse.json({
      success: true,
      message: 'Qiskit code generation test successful',
      data: {
        ...result,
        installationInstructions,
        testCircuit
      }
    });

  } catch (error) {
    console.error('Qiskit test error:', error);
    return NextResponse.json(
      { error: 'Qiskit code generation test failed' },
      { status: 500 }
    );
  }
} 