import { QuantumGate } from '@/app/quantassist/types';

export interface ValidationError {
  type: 'error' | 'warning' | 'info';
  message: string;
  gateId?: number;
  position?: number;
  qubit?: number;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
  suggestions: ValidationError[];
  optimizationTips: string[];
  circuitStats: {
    totalGates: number;
    depth: number;
    width: number;
    efficiency: number;
    complexity: string;
  };
}

export interface CircuitOptimization {
  originalGates: number;
  optimizedGates: number;
  savings: number;
  suggestions: string[];
}

export class CircuitValidator {
  static validateCircuit(circuit: QuantumGate[], numQubits: number): ValidationResult {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];
    const optimizationTips: string[] = [];

    if (!circuit || circuit.length === 0) {
      errors.push({
        type: 'error',
        message: 'Circuit is empty. Add some gates to get started!',
        suggestion: 'Try adding a Hadamard gate (H) to create quantum superposition.'
      });
      return this.createValidationResult(errors, warnings, suggestions, optimizationTips, circuit, numQubits);
    }

    circuit.forEach((gate, index) => {
      const gateErrors = this.validateGate(gate, numQubits, index);
      errors.push(...gateErrors.errors);
      warnings.push(...gateErrors.warnings);
      suggestions.push(...gateErrors.suggestions);
    });

    const circuitIssues = this.validateCircuitStructure(circuit, numQubits);
    errors.push(...circuitIssues.errors);
    warnings.push(...circuitIssues.warnings);
    suggestions.push(...circuitIssues.suggestions);

    const optimization = this.generateOptimizationTips(circuit, numQubits);
    optimizationTips.push(...optimization);

    return this.createValidationResult(errors, warnings, suggestions, optimizationTips, circuit, numQubits);
  }

  private static validateGate(gate: QuantumGate, numQubits: number, index: number): {
    errors: ValidationError[];
    warnings: ValidationError[];
    suggestions: ValidationError[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];

    if (!gate || typeof gate !== 'object') {
      errors.push({
        type: 'error',
        message: 'Invalid gate detected',
        gateId: (gate as any)?.id,
        suggestion: 'Remove this gate and try adding a valid one.'
      });
      return { errors, warnings, suggestions };
    }

    if (!gate.id || !gate.type || gate.position === undefined) {
      errors.push({
        type: 'error',
        message: 'Gate missing required properties (id, type, or position)',
        gateId: gate.id,
        suggestion: 'This gate may have been corrupted. Try removing and re-adding it.'
      });
      return { errors, warnings, suggestions };
    }

    const validTypes = ['H', 'X', 'Y', 'Z', 'CNOT', 'CCNOT', 'RX', 'RY', 'RZ', 'MEASURE'];
    if (!validTypes.includes(gate.type)) {
      errors.push({
        type: 'error',
        message: `Unknown gate type: ${gate.type}`,
        gateId: gate.id,
        suggestion: 'Use one of the supported gate types: H, X, Y, Z, CNOT, CCNOT, RX, RY, RZ, MEASURE'
      });
    }

    if (['H', 'X', 'Y', 'Z', 'RX', 'RY', 'RZ', 'MEASURE'].includes(gate.type)) {
      if (gate.qubit === undefined) {
        errors.push({
          type: 'error',
          message: `${gate.type} gate missing qubit index`,
          gateId: gate.id,
          suggestion: 'Single qubit gates need a qubit index (0 to ' + (numQubits - 1) + ')'
        });
      } else if (gate.qubit < 0 || gate.qubit >= numQubits) {
        errors.push({
          type: 'error',
          message: `${gate.type} gate has invalid qubit index: ${gate.qubit}`,
          gateId: gate.id,
          qubit: gate.qubit,
          suggestion: `Qubit index must be between 0 and ${numQubits - 1}`
        });
      }
    }

    if (gate.type === 'CNOT') {
      if (gate.control === undefined || gate.target === undefined) {
        errors.push({
          type: 'error',
          message: 'CNOT gate missing control or target qubit',
          gateId: gate.id,
          suggestion: 'CNOT gates need both control and target qubit indices'
        });
      } else if (gate.control < 0 || gate.control >= numQubits || 
                 gate.target < 0 || gate.target >= numQubits) {
        errors.push({
          type: 'error',
          message: 'CNOT gate has invalid qubit indices',
          gateId: gate.id,
          suggestion: `Control and target qubits must be between 0 and ${numQubits - 1}`
        });
      } else if (gate.control === gate.target) {
        errors.push({
          type: 'error',
          message: 'CNOT gate control and target cannot be the same qubit',
          gateId: gate.id,
          suggestion: 'Choose different qubits for control and target'
        });
      }
    }

    return { errors, warnings, suggestions };
  }

  private static validateCircuitStructure(circuit: QuantumGate[], numQubits: number): {
    errors: ValidationError[];
    warnings: ValidationError[];
    suggestions: ValidationError[];
  } {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const suggestions: ValidationError[] = [];

    const hasCNOT = circuit.some(gate => gate.type === 'CNOT');
    if (hasCNOT && numQubits < 2) {
      errors.push({
        type: 'error',
        message: 'CNOT gates require at least 2 qubits',
        suggestion: 'Increase the number of qubits to 2 or more'
      });
    }

    const hasMeasurement = circuit.some(gate => gate.type === 'MEASURE');
    if (!hasMeasurement) {
      suggestions.push({
        type: 'info',
        message: 'No measurement gates found',
        suggestion: 'Add measurement gates to see the results of your circuit'
      });
    }

    return { errors, warnings, suggestions };
  }

  private static generateOptimizationTips(circuit: QuantumGate[], numQubits: number): string[] {
    const tips: string[] = [];

    for (let i = 0; i < circuit.length - 1; i++) {
      const current = circuit[i];
      const next = circuit[i + 1];
      if (current.type === next.type && current.qubit === next.qubit && 
          current.position === next.position) {
        tips.push(`Consecutive ${current.type} gates on qubit ${current.qubit} can be combined`);
      }
    }

    const hGates = circuit.filter(g => g.type === 'H');
    if (hGates.length > 2) {
      tips.push('Multiple Hadamard gates can sometimes be simplified (H·H = I)');
    }

    return tips;
  }

  private static createValidationResult(
    errors: ValidationError[],
    warnings: ValidationError[],
    suggestions: ValidationError[],
    optimizationTips: string[],
    circuit: QuantumGate[],
    numQubits: number
  ): ValidationResult {
    const maxPosition = circuit.length > 0 ? Math.max(...circuit.map(g => g.position), 0) : 0;
    const usedQubits = new Set<number>();
    circuit.forEach(gate => {
      if (gate.qubit !== undefined) usedQubits.add(gate.qubit);
      if (gate.control !== undefined) usedQubits.add(gate.control);
      if (gate.target !== undefined) usedQubits.add(gate.target);
    });

    const efficiency = circuit.length > 0 ? (usedQubits.size * (maxPosition + 1)) / circuit.length : 0;
    let complexity = 'Simple';
    if (circuit.length > 20) complexity = 'Complex';
    else if (circuit.length > 10) complexity = 'Moderate';
    else if (circuit.length > 5) complexity = 'Intermediate';

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
      suggestions,
      optimizationTips,
      circuitStats: {
        totalGates: circuit.length,
        depth: maxPosition + 1,
        width: usedQubits.size,
        efficiency: Math.round(efficiency * 100) / 100,
        complexity
      }
    };
  }

  static getOptimizedCircuit(circuit: QuantumGate[]): CircuitOptimization {
    const originalGates = circuit.length;
    let optimizedGates = originalGates;
    const suggestions: string[] = [];

    // Remove consecutive identical gates
    const optimized = circuit.filter((gate, index) => {
      if (index === 0) return true;
      const prev = circuit[index - 1];
      if (gate.type === prev.type && gate.qubit === prev.qubit && 
          gate.position === prev.position) {
        optimizedGates--;
        suggestions.push(`Removed duplicate ${gate.type} gate`);
        return false;
      }
      return true;
    });

    return {
      originalGates,
      optimizedGates,
      savings: originalGates - optimizedGates,
      suggestions
    };
  }
} 