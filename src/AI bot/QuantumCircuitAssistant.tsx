"use client";

import React, { useState, useRef } from 'react';

// Type definitions
interface QuantumGate {
  id: number;
  type: string;
  qubit?: number;
  control?: number;
  target?: number;
  position: number;
}

interface GateTemplate {
  type: string;
  name: string;
  symbol: string;
  color: string;
  description: string;
}

interface AlgorithmTemplate {
  name: string;
  description: string;
  circuit: QuantumGate[];
  qubits: number;
}

interface QuantumState {
  [key: string]: number;
}

interface SimulationResult {
  [key: string]: number;
}

const QuantumCircuitAssistant = () => {
  const [numQubits, setNumQubits] = useState<number>(2);
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [draggedGate, setDraggedGate] = useState<GateTemplate | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [userQuery, setUserQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [mode, setMode] = useState<'assistant' | 'manual'>('assistant');

  // Available quantum gates
  const gates: GateTemplate[] = [
    { type: 'H', name: 'Hadamard', symbol: 'H', color: 'bg-blue-500', description: 'Creates superposition' },
    { type: 'X', name: 'Pauli-X', symbol: 'X', color: 'bg-red-500', description: 'Bit flip (NOT gate)' },
    { type: 'Y', name: 'Pauli-Y', symbol: 'Y', color: 'bg-yellow-500', description: 'Y rotation' },
    { type: 'Z', name: 'Pauli-Z', symbol: 'Z', color: 'bg-green-500', description: 'Phase flip' },
    { type: 'CNOT', name: 'CNOT', symbol: '⊕', color: 'bg-purple-500', description: 'Controlled NOT' },
    { type: 'RX', name: 'RX', symbol: 'RX', color: 'bg-indigo-500', description: 'X rotation' },
    { type: 'RY', name: 'RY', symbol: 'RY', color: 'bg-pink-500', description: 'Y rotation' },
    { type: 'MEASURE', name: 'Measure', symbol: '📊', color: 'bg-orange-500', description: 'Measure qubit' }
  ];

  // Quantum algorithm templates
  const quantumAlgorithms: { [key: string]: AlgorithmTemplate } = {
    'bell_state': {
      name: 'Bell State (Entanglement)',
      description: 'Creates maximum entanglement between two qubits',
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'CNOT', control: 0, target: 1, position: 1 },
        { id: 3, type: 'MEASURE', qubit: 0, position: 2 },
        { id: 4, type: 'MEASURE', qubit: 1, position: 2 }
      ],
      qubits: 2
    },
    'superposition': {
      name: 'Quantum Superposition',
      description: 'Puts a qubit in equal superposition of |0⟩ and |1⟩',
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
      ],
      qubits: 1
    },
    'quantum_coin_flip': {
      name: 'Quantum Coin Flip',
      description: 'True random coin flip using quantum superposition',
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'MEASURE', qubit: 0, position: 1 }
      ],
      qubits: 1
    },
    'grover_2bit': {
      name: 'Grover Search (2-bit)',
      description: 'Simple Grover search for 2 qubits',
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
      qubits: 2
    },
    'quantum_interference': {
      name: 'Quantum Interference',
      description: 'Demonstrates wave-like interference in quantum systems',
      circuit: [
        { id: 1, type: 'H', qubit: 0, position: 0 },
        { id: 2, type: 'Z', qubit: 0, position: 1 },
        { id: 3, type: 'H', qubit: 0, position: 2 },
        { id: 4, type: 'MEASURE', qubit: 0, position: 3 }
      ],
      qubits: 1
    }
  };

  // LLM-like processing for user queries
  const processUserQuery = async (query: string) => {
    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const lowerQuery = query.toLowerCase();
    let selectedAlgorithm: AlgorithmTemplate | null = null;
    let explanation = '';
    
    // Intent recognition based on keywords
    if (lowerQuery.includes('entangle') || lowerQuery.includes('bell') || lowerQuery.includes('correlated')) {
      selectedAlgorithm = quantumAlgorithms.bell_state;
      explanation = "I'll create a Bell state to demonstrate quantum entanglement. This circuit puts two qubits in a maximally entangled state where measuring one instantly affects the other, regardless of distance.";
    } else if (lowerQuery.includes('superposition') || lowerQuery.includes('both states') || lowerQuery.includes('0 and 1')) {
      selectedAlgorithm = quantumAlgorithms.superposition;
      explanation = "I'll create a superposition state where a qubit exists in both |0⟩ and |1⟩ states simultaneously. The Hadamard gate creates this quantum superposition.";
    } else if (lowerQuery.includes('coin flip') || lowerQuery.includes('random') || lowerQuery.includes('50/50')) {
      selectedAlgorithm = quantumAlgorithms.quantum_coin_flip;
      explanation = "I'll build a true quantum random number generator. Unlike classical randomness, this uses quantum superposition to create genuinely random results.";
    } else if (lowerQuery.includes('search') || lowerQuery.includes('grover') || lowerQuery.includes('find')) {
      selectedAlgorithm = quantumAlgorithms.grover_2bit;
      explanation = "I'll implement a simplified Grover search algorithm. This quantum algorithm can search unsorted databases quadratically faster than classical methods.";
    } else if (lowerQuery.includes('interference') || lowerQuery.includes('wave') || lowerQuery.includes('cancel')) {
      selectedAlgorithm = quantumAlgorithms.quantum_interference;
      explanation = "I'll demonstrate quantum interference where quantum states can constructively or destructively interfere, similar to waves in physics.";
    } else if (lowerQuery.includes('teleport')) {
      explanation = "Quantum teleportation requires 3 qubits and is quite complex. Let me show you entanglement first, which is a key component of teleportation.";
      selectedAlgorithm = quantumAlgorithms.bell_state;
    } else if (lowerQuery.includes('factor') || lowerQuery.includes('shor')) {
      explanation = "Shor's factoring algorithm is very complex and requires many qubits. Let me show you a simpler quantum algorithm instead - quantum interference, which demonstrates key quantum principles.";
      selectedAlgorithm = quantumAlgorithms.quantum_interference;
    } else {
      explanation = "I understand you want to explore quantum computing! Let me show you quantum superposition - a fundamental concept where particles exist in multiple states simultaneously.";
      selectedAlgorithm = quantumAlgorithms.superposition;
    }
    
    if (selectedAlgorithm) {
      setNumQubits(selectedAlgorithm.qubits);
      setCircuit(selectedAlgorithm.circuit.map((gate, index) => ({
        ...gate,
        id: Date.now() + index
      })));
      
      setAiResponse(`${explanation}\n\n**Algorithm:** ${selectedAlgorithm.name}\n**Description:** ${selectedAlgorithm.description}\n\nI've built the circuit for you. Click "Run Quantum Circuit" to see the results!`);
    }
    
    setIsProcessing(false);
  };

  // Handle user query submission
  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (userQuery.trim()) {
      processUserQuery(userQuery);
    }
  };

  // Quick example queries
  const exampleQueries = [
    "Create a quantum coin flip",
    "Show me quantum entanglement",
    "I want to see superposition",
    "Build a quantum search algorithm",
    "Demonstrate quantum interference"
  ];

  // Quantum simulation (simplified)
  const simulateCircuit = () => {
    if (circuit.length === 0) {
      setSimulationResult(null);
      return;
    }

    // Initialize quantum state (all qubits start as |0⟩)
    let state: QuantumState = {};
    for (let i = 0; i < Math.pow(2, numQubits); i++) {
      state[i.toString(2).padStart(numQubits, '0')] = i === 0 ? 1 : 0;
    }

    // Process gates in order
    circuit.forEach(gate => {
      if (gate.type === 'H' && gate.qubit !== undefined) {
        state = applyHadamard(state, gate.qubit, numQubits);
      } else if (gate.type === 'X' && gate.qubit !== undefined) {
        state = applyX(state, gate.qubit, numQubits);
      } else if (gate.type === 'Y' && gate.qubit !== undefined) {
        state = applyY(state, gate.qubit, numQubits);
      } else if (gate.type === 'Z' && gate.qubit !== undefined) {
        state = applyZ(state, gate.qubit, numQubits);
      } else if (gate.type === 'CNOT' && gate.control !== undefined && gate.target !== undefined) {
        state = applyCNOT(state, gate.control, gate.target, numQubits);
      }
    });

    // Calculate measurement probabilities
    const probabilities: SimulationResult = {};
    Object.keys(state).forEach(stateKey => {
      const probability = Math.pow(Math.abs(state[stateKey]), 2);
      if (probability > 0.001) {
        probabilities[stateKey] = probability;
      }
    });

    setSimulationResult(probabilities);
  };

  // Quantum gate operations
  const applyHadamard = (state: QuantumState, qubit: number, numQubits: number): QuantumState => {
    const newState: QuantumState = {};
    Object.keys(state).forEach(stateKey => {
      const amplitude = state[stateKey];
      if (amplitude === 0) return;

      const bitArray = stateKey.split('').map(Number);
      const newBitArray0 = [...bitArray];
      const newBitArray1 = [...bitArray];
      
      newBitArray0[qubit] = 0;
      newBitArray1[qubit] = 1;
      
      const newState0 = newBitArray0.join('');
      const newState1 = newBitArray1.join('');
      
      const factor = amplitude / Math.sqrt(2);
      newState[newState0] = (newState[newState0] || 0) + factor;
      newState[newState1] = (newState[newState1] || 0) + factor;
    });
    return newState;
  };

  const applyX = (state: QuantumState, qubit: number, numQubits: number): QuantumState => {
    const newState: QuantumState = {};
    Object.keys(state).forEach(stateKey => {
      const amplitude = state[stateKey];
      if (amplitude === 0) return;

      const bitArray = stateKey.split('').map(Number);
      bitArray[qubit] = 1 - bitArray[qubit];
      const newStateKey = bitArray.join('');
      newState[newStateKey] = amplitude;
    });
    return newState;
  };

  const applyY = (state: QuantumState, qubit: number, numQubits: number): QuantumState => {
    const newState: QuantumState = {};
    Object.keys(state).forEach(stateKey => {
      const amplitude = state[stateKey];
      if (amplitude === 0) return;

      const bitArray = stateKey.split('').map(Number);
      bitArray[qubit] = 1 - bitArray[qubit];
      const newStateKey = bitArray.join('');
      // Y gate introduces imaginary phase - simplified for visualization
      newState[newStateKey] = amplitude;
    });
    return newState;
  };

  const applyZ = (state: QuantumState, qubit: number, numQubits: number): QuantumState => {
    const newState: QuantumState = {};
    Object.keys(state).forEach(stateKey => {
      const amplitude = state[stateKey];
      if (amplitude === 0) return;

      const bitArray = stateKey.split('').map(Number);
      // Z gate flips phase of |1⟩ state - simplified for visualization
      newState[stateKey] = bitArray[qubit] === 1 ? -amplitude : amplitude;
    });
    return newState;
  };

  const applyCNOT = (state: QuantumState, control: number, target: number, numQubits: number): QuantumState => {
    const newState: QuantumState = {};
    Object.keys(state).forEach(stateKey => {
      const amplitude = state[stateKey];
      if (amplitude === 0) return;

      const bitArray = stateKey.split('').map(Number);
      if (bitArray[control] === 1) {
        bitArray[target] = 1 - bitArray[target];
      }
      const newStateKey = bitArray.join('');
      newState[newStateKey] = amplitude;
    });
    return newState;
  };

  // Manual mode functions
  const handleDragStart = (gate: GateTemplate) => {
    setDraggedGate(gate);
  };

  const handleDrop = (qubit: number, position: number) => {
    if (!draggedGate) return;

    const newGate: QuantumGate = {
      id: Date.now(),
      type: draggedGate.type,
      qubit: qubit,
      position: position
    };

    if (draggedGate.type === 'CNOT') {
      const control = qubit;
      const target = qubit === 0 ? 1 : 0;
      newGate.control = control;
      newGate.target = target;
      delete newGate.qubit;
    }

    setCircuit([...circuit, newGate]);
    setDraggedGate(null);
  };

  const clearCircuit = () => {
    setCircuit([]);
    setSimulationResult(null);
    setAiResponse('');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-blue-600">
          Quantum Circuit AI Assistant
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Describe what you want to accomplish, and I'll build the quantum circuit for you!
        </p>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-6">
          <div className="bg-white rounded-lg p-1 shadow-lg">
            <button
              onClick={() => setMode('assistant')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'assistant' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🤖 AI Assistant
            </button>
            <button
              onClick={() => setMode('manual')}
              className={`px-4 py-2 rounded-md transition-colors ${
                mode === 'manual' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              🔧 Manual Builder
            </button>
          </div>
        </div>

        {mode === 'assistant' && (
          <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-600">
              What would you like to do with quantum computing?
            </h3>
            
            <div className="mb-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(e)}
                  placeholder="e.g., 'Create a quantum coin flip' or 'Show me entanglement'"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isProcessing}
                />
                <button
                  onClick={handleQuerySubmit}
                  disabled={isProcessing || !userQuery.trim()}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? '🤔 Thinking...' : '✨ Build Circuit'}
                </button>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Try these examples:</p>
              <div className="flex flex-wrap gap-2">
                {exampleQueries.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setUserQuery(example)}
                    className="text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            {aiResponse && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">AI Assistant Response:</h4>
                <div className="text-blue-700 whitespace-pre-line">{aiResponse}</div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Gate Library - only show in manual mode */}
          {mode === 'manual' && (
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4">Quantum Gates</h3>
              <div className="space-y-3">
                {gates.map((gate) => (
                  <div
                    key={gate.type}
                    draggable
                    onDragStart={() => handleDragStart(gate)}
                    className={`${gate.color} text-white p-3 rounded cursor-move hover:opacity-80 transition-opacity`}
                  >
                    <div className="font-bold">{gate.symbol} - {gate.name}</div>
                    <div className="text-sm opacity-90">{gate.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Circuit Builder */}
          <div className={`bg-white rounded-lg p-6 shadow-lg ${mode === 'assistant' ? 'col-span-2' : ''}`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Quantum Circuit</h3>
              <div className="flex gap-2">
                <label className="text-sm">
                  Qubits:
                  <select 
                    value={numQubits} 
                    onChange={(e) => setNumQubits(Number(e.target.value))}
                    className="ml-2 border rounded px-2 py-1"
                  >
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                  </select>
                </label>
                <button 
                  onClick={clearCircuit}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Circuit Visualization */}
            <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300 min-h-64">
              {Array.from({ length: numQubits }, (_, i) => (
                <div key={i} className="mb-8 last:mb-0">
                  <div className="flex items-center">
                    <span className="text-sm font-mono mr-4 w-12">|{i}⟩</span>
                    <div className="flex-1 relative">
                      <div className="h-0.5 bg-gray-400 w-full absolute top-1/2"></div>
                      
                      {Array.from({ length: 8 }, (_, pos) => (
                        <div
                          key={pos}
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={() => handleDrop(i, pos)}
                          className={`absolute w-12 h-12 border-2 border-transparent rounded ${
                            mode === 'manual' ? 'hover:border-blue-300' : ''
                          }`}
                          style={{ left: `${pos * 80}px`, top: '-24px' }}
                        >
                          {circuit
                            .filter(gate => (gate.qubit === i || gate.control === i || gate.target === i) && gate.position === pos)
                            .map(gate => (
                              <div
                                key={gate.id}
                                className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                  gate.type === 'H' ? 'bg-blue-500' :
                                  gate.type === 'X' ? 'bg-red-500' :
                                  gate.type === 'Y' ? 'bg-yellow-500' :
                                  gate.type === 'Z' ? 'bg-green-500' :
                                  gate.type === 'CNOT' ? 'bg-purple-500' :
                                  gate.type === 'RX' ? 'bg-indigo-500' :
                                  gate.type === 'RY' ? 'bg-pink-500' :
                                  'bg-orange-500'
                                }`}
                              >
                                {gate.type === 'MEASURE' ? '📊' : gate.type}
                              </div>
                            ))}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={simulateCircuit}
              className="w-full mt-4 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-semibold"
            >
              🚀 Run Quantum Circuit
            </button>
          </div>

          {/* Results */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold mb-4">Simulation Results</h3>
            {simulationResult ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600 mb-4">Measurement Probabilities:</p>
                {Object.entries(simulationResult).map(([state, probability]) => (
                  <div key={state} className="flex justify-between items-center">
                    <span className="font-mono">|{state}⟩</span>
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${probability * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{(probability * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">Build and run a circuit to see results!</p>
            )}

            {simulationResult && (
              <div className="mt-6 p-4 bg-blue-50 rounded">
                <h4 className="font-semibold text-blue-800 mb-2">Interpretation:</h4>
                <p className="text-sm text-blue-700">
                  Each |state⟩ represents a possible measurement outcome. 
                  The percentages show the probability of measuring each state.
                  {Object.keys(simulationResult).length > 1 ? 
                    " Multiple outcomes indicate quantum superposition!" : 
                    " Single outcome indicates a classical state."
                  }
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-6">
          <h4 className="font-semibold text-purple-800 mb-3">How to Use the Quantum AI Assistant:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-purple-700">
            <div>
              <h5 className="font-semibold mb-2">🤖 AI Assistant Mode:</h5>
              <ul className="space-y-1">
                <li>• Describe what you want in natural language</li>
                <li>• AI will build the appropriate quantum circuit</li>
                <li>• Perfect for learning quantum concepts</li>
                <li>• No prior quantum knowledge required</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-2">🔧 Manual Builder Mode:</h5>
              <ul className="space-y-1">
                <li>• Drag and drop gates to build circuits</li>
                <li>• Full control over circuit design</li>
                <li>• Great for experimenting</li>
                <li>• Learn by hands-on construction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuantumCircuitAssistant;