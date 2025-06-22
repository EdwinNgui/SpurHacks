import { QuantumGate } from '@/app/quantassist/types';

export interface QiskitCodeResult {
  code: string;
  explanation: string;
  imports: string[];
  circuitName: string;
}

export class QiskitCodeGenerator {
  static generateCode(circuit: QuantumGate[], numQubits: number): QiskitCodeResult {
    const imports = [
      'from qiskit import QuantumCircuit, Aer, execute',
      'from qiskit.visualization import plot_histogram',
      'import matplotlib.pyplot as plt',
      'import numpy as np'
    ];

    const circuitName = this.generateCircuitName(circuit);
    
    let code = `# Quantum Circuit: ${circuitName}
# Generated from visual circuit builder

${imports.join('\n')}

# Create quantum circuit with ${numQubits} qubits and ${numQubits} classical bits
qc = QuantumCircuit(${numQubits}, ${numQubits})

# Circuit gates:`;

    // Sort gates by position to ensure correct order
    const sortedGates = [...circuit].sort((a, b) => a.position - b.position);
    
    // Group gates by position (time step)
    const gatesByPosition = new Map<number, QuantumGate[]>();
    sortedGates.forEach(gate => {
      if (!gatesByPosition.has(gate.position)) {
        gatesByPosition.set(gate.position, []);
      }
      gatesByPosition.get(gate.position)!.push(gate);
    });

    // Generate code for each position
    gatesByPosition.forEach((gates, position) => {
      code += `\n# Step ${position + 1}:`;
      
      gates.forEach(gate => {
        const gateCode = this.generateGateCode(gate, numQubits);
        if (gateCode) {
          code += `\n${gateCode}`;
        }
      });
    });

    // Add measurement and execution code
    code += `

# Measure all qubits
qc.measure_all()

# Draw the circuit
print("Circuit Diagram:")
print(qc)

# Execute the circuit
backend = Aer.get_backend('qasm_simulator')
job = execute(qc, backend, shots=1000)
result = job.result()

# Get the results
counts = result.get_counts(qc)
print("\\nMeasurement Results:")
print(counts)

# Plot the histogram
plot_histogram(counts)
plt.show()

# Optional: Get the state vector (for statevector simulator)
backend_sv = Aer.get_backend('statevector_simulator')
job_sv = execute(qc, backend_sv)
result_sv = job_sv.result()
statevector = result_sv.get_statevector()
print("\\nFinal State Vector:")
print(statevector)`;

    const explanation = this.generateExplanation(circuit, numQubits, circuitName);

    return {
      code,
      explanation,
      imports,
      circuitName
    };
  }

  private static generateGateCode(gate: QuantumGate, numQubits: number): string {
    switch (gate.type) {
      case 'H':
        return `qc.h(${gate.qubit})  # Hadamard gate on qubit ${gate.qubit}`;
      
      case 'X':
        return `qc.x(${gate.qubit})  # Pauli-X (NOT) gate on qubit ${gate.qubit}`;
      
      case 'Y':
        return `qc.y(${gate.qubit})  # Pauli-Y gate on qubit ${gate.qubit}`;
      
      case 'Z':
        return `qc.z(${gate.qubit})  # Pauli-Z gate on qubit ${gate.qubit}`;
      
      case 'CNOT':
        if (gate.control !== undefined && gate.target !== undefined) {
          return `qc.cx(${gate.control}, ${gate.target})  # CNOT: control=${gate.control}, target=${gate.target}`;
        }
        break;
      
      case 'CCNOT':
        if (gate.control !== undefined && gate.control2 !== undefined && gate.target !== undefined) {
          return `qc.ccx(${gate.control}, ${gate.control2}, ${gate.target})  # Toffoli: controls=${gate.control},${gate.control2}, target=${gate.target}`;
        }
        break;
      
      case 'RX':
        const rxAngle = gate.theta || Math.PI / 2;
        return `qc.rx(${rxAngle}, ${gate.qubit})  # RX rotation by ${rxAngle.toFixed(3)} on qubit ${gate.qubit}`;
      
      case 'RY':
        const ryAngle = gate.theta || Math.PI / 2;
        return `qc.ry(${ryAngle}, ${gate.qubit})  # RY rotation by ${ryAngle.toFixed(3)} on qubit ${gate.qubit}`;
      
      case 'RZ':
        const rzAngle = gate.theta || Math.PI / 2;
        return `qc.rz(${rzAngle}, ${gate.qubit})  # RZ rotation by ${rzAngle.toFixed(3)} on qubit ${gate.qubit}`;
      
      case 'MEASURE':
        return `qc.measure(${gate.qubit}, ${gate.qubit})  # Measure qubit ${gate.qubit}`;
      
      default:
        return `# Unknown gate type: ${gate.type}`;
    }
    return '';
  }

  private static generateCircuitName(circuit: QuantumGate[]): string {
    if (circuit.length === 0) return 'Empty Circuit';
    
    // Check for common patterns
    const hasH = circuit.some(g => g.type === 'H');
    const hasCNOT = circuit.some(g => g.type === 'CNOT');
    const hasX = circuit.some(g => g.type === 'X');
    const hasZ = circuit.some(g => g.type === 'Z');
    
    if (hasH && hasCNOT) return 'Bell State Circuit';
    if (hasH && !hasCNOT) return 'Superposition Circuit';
    if (hasX && hasZ) return 'Quantum Interference Circuit';
    if (hasCNOT && circuit.length > 3) return 'Multi-Qubit Circuit';
    
    return 'Custom Quantum Circuit';
  }

  private static generateExplanation(circuit: QuantumGate[], numQubits: number, circuitName: string): string {
    const gateCounts = circuit.reduce((acc, gate) => {
      acc[gate.type] = (acc[gate.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    let explanation = `This Qiskit code implements a ${circuitName.toLowerCase()} with ${numQubits} qubit${numQubits > 1 ? 's' : ''}.\n\n`;
    
    explanation += `Circuit Summary:\n`;
    explanation += `- Total gates: ${circuit.length}\n`;
    
    Object.entries(gateCounts).forEach(([type, count]) => {
      explanation += `- ${type} gates: ${count}\n`;
    });
    
    explanation += `\nThe circuit demonstrates quantum computing principles using Qiskit, IBM's quantum computing framework. `;
    explanation += `You can run this code in any Python environment with Qiskit installed.`;
    
    return explanation;
  }

  static getInstallationInstructions(): string {
    return `# Installation Instructions
# Run these commands in your terminal:

# Install Qiskit
pip install qiskit

# Install additional dependencies for visualization
pip install matplotlib
pip install qiskit[visualization]

# Optional: Install Jupyter for interactive notebooks
pip install jupyter

# Run the code
python your_circuit.py`;
  }

  static getAdvancedCode(circuit: QuantumGate[], numQubits: number): string {
    const basicCode = this.generateCode(circuit, numQubits);
    
    return `${basicCode.code}

# Advanced Analysis
# ================

# Get circuit depth and width
print(f"\\nCircuit Analysis:")
print(f"Depth: {qc.depth()}")
print(f"Width: {qc.width()}")
print(f"Size: {qc.size()}")

# Get circuit parameters
print(f"\\nCircuit Parameters:")
print(f"Number of qubits: {qc.num_qubits}")
print(f"Number of classical bits: {qc.num_clbits}")

# Decompose circuit to basis gates
print(f"\\nBasis Gates:")
print(qc.decompose().count_ops())

# Get circuit as OpenQASM
print(f"\\nOpenQASM Code:")
print(qc.qasm())`;
  }
} 