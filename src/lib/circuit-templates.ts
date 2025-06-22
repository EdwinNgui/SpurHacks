import { QuantumGate } from '@/app/quantassist/types';

export interface CircuitTemplate {
  id: string;
  name: string;
  description: string;
  category: 'beginner' | 'intermediate' | 'advanced' | 'algorithm' | 'educational';
  difficulty: 1 | 2 | 3 | 4 | 5;
  qubits: number;
  circuit: QuantumGate[];
  tags: string[];
  learningObjectives: string[];
  explanation: string;
  realWorldUse: string;
}

export interface CircuitHistory {
  id: string;
  name: string;
  circuit: QuantumGate[];
  numQubits: number;
  timestamp: Date;
  description?: string;
  tags?: string[];
}

export const circuitTemplates: CircuitTemplate[] = [
  // BEGINNER TEMPLATES
  {
    id: 'superposition-basic',
    name: 'Quantum Superposition',
    description: 'Create a qubit in equal superposition of |0⟩ and |1⟩',
    category: 'beginner',
    difficulty: 1,
    qubits: 1,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
    ],
    tags: ['superposition', 'hadamard', 'single-qubit'],
    learningObjectives: ['Understand quantum superposition', 'Learn Hadamard gate', 'See quantum randomness'],
    explanation: 'The Hadamard gate puts a qubit in perfect superposition - it exists in both |0⟩ and |1⟩ states simultaneously until measured.',
    realWorldUse: 'This is the foundation of quantum computing and is used in quantum random number generation.'
  },
  {
    id: 'measurement-basic',
    name: 'Quantum Measurement',
    description: 'Learn how quantum measurement works',
    category: 'beginner',
    difficulty: 1,
    qubits: 1,
    circuit: [
      { id: 1, type: 'MEASURE', qubit: 0, position: 0 }
    ],
    tags: ['measurement', 'single-qubit', 'basics'],
    learningObjectives: ['Understand quantum measurement', 'See classical behavior'],
    explanation: 'Measuring a qubit in its default state always gives the same result - this is classical behavior.',
    realWorldUse: 'Measurement is how we extract information from quantum systems.'
  },
  {
    id: 'pauli-gates',
    name: 'Pauli Gates (X, Y, Z)',
    description: 'Explore the fundamental Pauli gates',
    category: 'beginner',
    difficulty: 2,
    qubits: 1,
    circuit: [
      { id: 1, type: 'X', qubit: 0, position: 0 },
      { id: 2, type: 'Y', qubit: 0, position: 1 },
      { id: 3, type: 'Z', qubit: 0, position: 2 },
      { id: 4, type: 'MEASURE', qubit: 0, position: 3 }
    ],
    tags: ['pauli-gates', 'single-qubit', 'rotations'],
    learningObjectives: ['Learn Pauli-X (NOT gate)', 'Understand Pauli-Y and Z', 'See different quantum operations'],
    explanation: 'Pauli gates are the building blocks of quantum computing. X flips the qubit, Y and Z perform rotations.',
    realWorldUse: 'Pauli gates are used in quantum error correction and quantum algorithms.'
  },

  // INTERMEDIATE TEMPLATES
  {
    id: 'bell-state',
    name: 'Bell State (Entanglement)',
    description: 'Create quantum entanglement between two qubits',
    category: 'intermediate',
    difficulty: 3,
    qubits: 2,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
      { id: 3, type: 'MEASURE', qubit: 0, position: 2 },
      { id: 4, type: 'MEASURE', qubit: 1, position: 2 }
    ],
    tags: ['entanglement', 'bell-state', 'multi-qubit', 'cnot'],
    learningObjectives: ['Understand quantum entanglement', 'Learn CNOT gate', 'See non-local correlations'],
    explanation: 'This creates a Bell state where measuring one qubit instantly determines the other, regardless of distance.',
    realWorldUse: 'Bell states are used in quantum teleportation, quantum cryptography, and quantum communication.'
  },
  {
    id: 'quantum-interference',
    name: 'Quantum Interference',
    description: 'Demonstrate wave-like interference in quantum systems',
    category: 'intermediate',
    difficulty: 3,
    qubits: 1,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'Z', qubit: 0, position: 1 },
      { id: 3, type: 'H', qubit: 0, position: 2 },
      { id: 4, type: 'MEASURE', qubit: 0, position: 3 }
    ],
    tags: ['interference', 'wave-behavior', 'hadamard', 'phase'],
    learningObjectives: ['Understand quantum interference', 'Learn phase operations', 'See wave-like behavior'],
    explanation: 'Quantum waves can interfere constructively or destructively, just like waves in a pond.',
    realWorldUse: 'Quantum interference is used in quantum algorithms to amplify correct answers and cancel wrong ones.'
  },
  {
    id: 'quantum-coin-flip',
    name: 'Quantum Coin Flip',
    description: 'True random number generation using quantum superposition',
    category: 'intermediate',
    difficulty: 2,
    qubits: 1,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
    ],
    tags: ['randomness', 'superposition', 'cryptography'],
    learningObjectives: ['Understand quantum randomness', 'Learn about true randomness', 'See cryptographic applications'],
    explanation: 'Unlike classical randomness, quantum randomness is truly unpredictable and cannot be predicted.',
    realWorldUse: 'Quantum random number generators are used in cryptography, gaming, and scientific simulations.'
  },

  // ADVANCED TEMPLATES
  {
    id: 'grover-search-2bit',
    name: 'Grover Search (2-bit)',
    description: 'Quantum search algorithm for finding marked items',
    category: 'advanced',
    difficulty: 4,
    qubits: 2,
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
    tags: ['grover', 'search-algorithm', 'amplitude-amplification'],
    learningObjectives: ['Understand quantum search', 'Learn amplitude amplification', 'See quantum speedup'],
    explanation: 'Grover\'s algorithm can find marked items in an unsorted database quadratically faster than classical methods.',
    realWorldUse: 'Used in database search, cryptography, and optimization problems.'
  },
  {
    id: 'quantum-fourier-transform',
    name: 'Quantum Fourier Transform',
    description: 'Quantum version of the Fourier transform',
    category: 'advanced',
    difficulty: 5,
    qubits: 3,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'H', qubit: 1, position: 0 },
      { id: 3, type: 'H', qubit: 2, position: 0 },
      { id: 4, type: 'CNOT', control: 0, target: 1, position: 1 },
      { id: 5, type: 'CNOT', control: 1, target: 2, position: 2 },
      { id: 6, type: 'MEASURE', qubit: 0, position: 3 },
      { id: 7, type: 'MEASURE', qubit: 1, position: 3 },
      { id: 8, type: 'MEASURE', qubit: 2, position: 3 }
    ],
    tags: ['fourier-transform', 'phase-estimation', 'shor-algorithm'],
    learningObjectives: ['Understand quantum Fourier transform', 'Learn phase estimation', 'See quantum period finding'],
    explanation: 'The quantum Fourier transform is a key component of many quantum algorithms including Shor\'s factoring algorithm.',
    realWorldUse: 'Used in factoring large numbers, period finding, and quantum phase estimation.'
  },

  // ALGORITHM TEMPLATES
  {
    id: 'vqe-simple',
    name: 'Variational Quantum Eigensolver (VQE)',
    description: 'Hybrid quantum-classical algorithm for finding ground states',
    category: 'algorithm',
    difficulty: 4,
    qubits: 2,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'H', qubit: 1, position: 0 },
      { id: 3, type: 'CNOT', control: 0, target: 1, position: 1 },
      { id: 4, type: 'RX', qubit: 0, position: 2 },
      { id: 5, type: 'RY', qubit: 1, position: 2 },
      { id: 6, type: 'MEASURE', qubit: 0, position: 3 },
      { id: 7, type: 'MEASURE', qubit: 1, position: 3 }
    ],
    tags: ['vqe', 'hybrid-algorithm', 'chemistry', 'optimization'],
    learningObjectives: ['Understand hybrid algorithms', 'Learn variational methods', 'See quantum chemistry applications'],
    explanation: 'VQE combines quantum and classical computing to find the ground state of molecular systems.',
    realWorldUse: 'Used in quantum chemistry for drug discovery and materials science.'
  },
  {
    id: 'qaoa-simple',
    name: 'Quantum Approximate Optimization Algorithm (QAOA)',
    description: 'Quantum algorithm for solving optimization problems',
    category: 'algorithm',
    difficulty: 4,
    qubits: 2,
    circuit: [
      { id: 1, type: 'H', qubit: 0, position: 0 },
      { id: 2, type: 'H', qubit: 1, position: 0 },
      { id: 3, type: 'CNOT', control: 0, target: 1, position: 1 },
      { id: 4, type: 'RX', qubit: 0, position: 2 },
      { id: 5, type: 'RX', qubit: 1, position: 2 },
      { id: 6, type: 'MEASURE', qubit: 0, position: 3 },
      { id: 7, type: 'MEASURE', qubit: 1, position: 3 }
    ],
    tags: ['qaoa', 'optimization', 'max-cut', 'combinatorial'],
    learningObjectives: ['Understand quantum optimization', 'Learn parameterized circuits', 'See combinatorial optimization'],
    explanation: 'QAOA is designed to find approximate solutions to combinatorial optimization problems.',
    realWorldUse: 'Used in logistics, scheduling, network optimization, and machine learning.'
  }
];

export const getTemplatesByCategory = (category: CircuitTemplate['category']) => {
  return circuitTemplates.filter(template => template.category === category);
};

export const getTemplatesByDifficulty = (maxDifficulty: number) => {
  return circuitTemplates.filter(template => template.difficulty <= maxDifficulty);
};

export const searchTemplates = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return circuitTemplates.filter(template => 
    template.name.toLowerCase().includes(lowerQuery) ||
    template.description.toLowerCase().includes(lowerQuery) ||
    template.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Circuit History Management
export class CircuitHistoryManager {
  private static readonly STORAGE_KEY = 'quantum_circuit_history';
  private static readonly MAX_HISTORY = 50;

  static saveCircuit(circuit: QuantumGate[], numQubits: number, name?: string): void {
    try {
      const history = this.getHistory();
      const newEntry: CircuitHistory = {
        id: Date.now().toString(),
        name: name || `Circuit ${history.length + 1}`,
        circuit: [...circuit],
        numQubits,
        timestamp: new Date(),
        description: `Circuit with ${circuit.length} gates and ${numQubits} qubits`
      };

      history.unshift(newEntry);
      
      if (history.length > this.MAX_HISTORY) {
        history.splice(this.MAX_HISTORY);
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Failed to save circuit to history:', error);
    }
  }

  static getHistory(): CircuitHistory[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load circuit history:', error);
      return [];
    }
  }

  static deleteCircuit(id: string): void {
    try {
      const history = this.getHistory();
      const filtered = history.filter(entry => entry.id !== id);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
      console.error('Failed to delete circuit from history:', error);
    }
  }

  static clearHistory(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear circuit history:', error);
    }
  }
} 