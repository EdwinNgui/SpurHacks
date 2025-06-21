"use client";

import React, { useState } from 'react';
import { runCircuit } from '@/lib/simulation';
import { Circuit, Gate } from '@/lib/types';

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

export default function QuantumCircuitAssistantPage() {
  const [numQubits, setNumQubits] = useState<number>(2);
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [draggedGate, setDraggedGate] = useState<GateTemplate | null>(null);
  const [simulationResult, setSimulationResult] = useState<SimulationResult | null>(null);
  const [userQuery, setUserQuery] = useState<string>('');
  const [aiResponse, setAiResponse] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<'manual' | 'ai'>('manual');

  // Available quantum gates
  const gates: GateTemplate[] = [
    { type: 'H', name: 'Hadamard', symbol: 'H', color: 'bg-purple-500', description: 'Creates superposition' },
    { type: 'X', name: 'Pauli-X', symbol: 'X', color: 'bg-purple-700', description: 'Bit flip (NOT gate)' },
    { type: 'Y', name: 'Pauli-Y', symbol: 'Y', color: 'bg-purple-500', description: 'Y rotation' },
    { type: 'Z', name: 'Pauli-Z', symbol: 'Z', color: 'bg-purple-700', description: 'Phase flip' },
    { type: 'CNOT', name: 'CNOT', symbol: '⊕', color: 'bg-purple-500', description: 'Controlled NOT' },
    { type: 'RX', name: 'RX', symbol: 'RX', color: 'bg-purple-700', description: 'X rotation' },
    { type: 'RY', name: 'RY', symbol: 'RY', color: 'bg-purple-500', description: 'Y rotation' },
    { type: 'MEASURE', name: 'Measure', symbol: '📊', color: 'bg-purple-700', description: 'Measure qubit' }
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
    await new Promise(resolve => setTimeout(resolve, 1500));
    const lowerQuery = query.toLowerCase();
    let selectedAlgorithm: AlgorithmTemplate | null = null;
    let explanation = '';
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

  const handleQuerySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (userQuery.trim()) {
      processUserQuery(userQuery);
    }
  };

  const exampleQueries = [
    "Create a quantum coin flip",
    "Show me quantum entanglement",
    "I want to see superposition",
    "Build a quantum search algorithm",
    "Demonstrate quantum interference"
  ];

  const simulateCircuit = () => {
    // 1. Filter out MEASURE gates and transform the circuit for the backend.
    const maxPosition = circuit.reduce((max, gate) => Math.max(max, gate.position), 0);
    const steps: Gate[][] = Array.from({ length: maxPosition + 1 }, () => []);

    const frontendCircuit = circuit.filter(gate => gate.type !== 'MEASURE');

    for (const gate of frontendCircuit) {
        const backendGate: Gate = {
            type: gate.type as Gate['type'],
            targets: [],
        };

        if (gate.type === 'CNOT') {
            if (gate.control !== undefined && gate.target !== undefined) {
                backendGate.targets = [gate.control, gate.target];
            }
        } else {
            if (gate.qubit !== undefined) {
                backendGate.targets = [gate.qubit];
            }
        }
        
        // This is a hack for RX and RY gates for now.
        if (gate.type === 'RX' || gate.type === 'RY') {
          backendGate.params = Math.PI / 2;
        }

        if (backendGate.targets.length > 0) {
            steps[gate.position].push(backendGate);
        }
    }

    const backendCircuit: Circuit = { gates: steps };

    if (backendCircuit.gates.every(step => step.length === 0)) {
        setSimulationResult(null);
        return;
    }

    // 2. Run the simulation using the backend.
    const finalStateVector = runCircuit(backendCircuit, numQubits);

    // 3. Process the results.
    const probabilities: SimulationResult = {};
    finalStateVector.forEach((amplitude, index) => {
        const probability = amplitude[0] * amplitude[0] + amplitude[1] * amplitude[1]; // prob = |a+bi|^2 = a^2+b^2
        if (probability > 0.001) {
            const stateKey = index.toString(2).padStart(numQubits, '0');
            probabilities[stateKey] = probability;
        }
    });

    setSimulationResult(probabilities);
  };

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
    <div className="min-h-screen bg-[#221e29] text-gray-300 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-white">
          Quantum Circuit AI Assistant
        </h1>
        <p className="text-center text-gray-300 mb-8">
          Build quantum circuits with AI assistance or manual control
        </p>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Manual Builder and AI Sections */}
          <div className="lg:col-span-1 space-y-6">
            {/* Section Toggle */}
            <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-2">
              <div className="flex">
                <button
                  onClick={() => setActiveSection('manual')}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === 'manual' 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🔧 Manual
                </button>
                <button
                  onClick={() => setActiveSection('ai')}
                  className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === 'ai' 
                      ? 'bg-white/20 text-white' 
                      : 'text-gray-300 hover:bg-white/10'
                  }`}
                >
                  🤖 AI Assistant
                </button>
              </div>
            </div>
            {/* Manual Builder Section */}
            {activeSection === 'manual' && (
              <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Quantum Gates</h3>
                <div className="space-y-3">
                  {gates.map((gate) => (
                    <div
                      key={gate.type}
                      draggable
                      onDragStart={() => handleDragStart(gate)}
                      className="bg-white/10 text-white p-3 rounded-lg cursor-move hover:bg-white/20 transition-colors backdrop-blur-md border border-white/20"
                    >
                      <div className="font-bold">{gate.symbol} - {gate.name}</div>
                      <div className="text-sm opacity-90">{gate.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* AI Assistant Section */}
            {activeSection === 'ai' && (
              <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">
                  What would you like to do?
                </h3>
                <div className="mb-4">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={userQuery}
                      onChange={(e) => setUserQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit(e)}
                      placeholder="e.g., 'Create a quantum coin flip'"
                      className="flex-1 p-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#652db4] focus:border-transparent text-sm text-white placeholder-gray-400"
                      disabled={isProcessing}
                    />
                    <button
                      onClick={handleQuerySubmit}
                      disabled={isProcessing || !userQuery.trim()}
                      className="bg-[#652db4] text-white px-4 py-3 rounded-lg hover:bg-[#8145c2] disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                    >
                      {isProcessing ? '🤔' : '✨'}
                    </button>
                  </div>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-300 mb-2">Try these examples:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQueries.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => setUserQuery(example)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full text-gray-300 transition-colors"
                      >
                        {example}
                      </button>
                    ))}
                  </div>
                </div>
                {aiResponse && (
                  <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                    <h4 className="font-semibold text-white mb-2 text-sm">AI Response:</h4>
                    <div className="text-gray-300 whitespace-pre-line text-sm">{aiResponse}</div>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* Primary Section - Circuit Builder and Results */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            {/* Circuit Builder - now runs horizontally across the screen */}
            <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Quantum Circuit</h3>
                <div className="flex gap-2 items-center">
                  <label className="text-sm text-gray-300">
                    Qubits:
                    <select 
                      value={numQubits} 
                      onChange={(e) => setNumQubits(Number(e.target.value))}
                      className="ml-2 bg-black/20 border border-white/20 rounded px-2 py-1 focus:ring-2 focus:ring-[#652db4]"
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
              {/* Circuit Visualization - horizontal full width */}
              <div className="bg-black/20 p-4 rounded-lg border-2 border-dashed border-white/20 min-h-64 overflow-x-auto">
                {Array.from({ length: numQubits }, (_, i) => (
                  <div key={i} className="mb-8 last:mb-0">
                    <div className="flex items-center">
                      <span className="text-sm font-mono mr-4 w-12 text-gray-300">|{i}⟩</span>
                      <div className="flex-1 relative" style={{ minWidth: '640px' }}>
                        <div className="h-0.5 bg-white/30 w-full absolute top-1/2"></div>
                        {Array.from({ length: 8 }, (_, pos) => (
                          <div
                            key={pos}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={() => handleDrop(i, pos)}
                            className={`absolute w-12 h-12 border-2 border-transparent rounded-full ${
                              activeSection === 'manual' ? 'hover:border-white/50' : ''
                            }`}
                            style={{ left: `${pos * 80}px`, top: '-24px' }}
                          >
                            {circuit
                              .filter(gate => (gate.qubit === i || gate.control === i || gate.target === i) && gate.position === pos)
                              .map(gate => (
                                <div
                                  key={gate.id}
                                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                                    gate.type === 'H' ? 'bg-[#652db4]' :
                                    gate.type === 'X' ? 'bg-[#3f2a61]' :
                                    gate.type === 'Y' ? 'bg-[#652db4]' :
                                    gate.type === 'Z' ? 'bg-[#3f2a61]' :
                                    gate.type === 'CNOT' ? 'bg-[#652db4]' :
                                    gate.type === 'RX' ? 'bg-[#3f2a61]' :
                                    gate.type === 'RY' ? 'bg-[#652db4]' :
                                    'bg-[#3f2a61]'
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
                className="w-full mt-4 bg-[#652db4] text-white py-2 rounded-lg hover:bg-[#8145c2] font-semibold transition-colors"
              >
                🚀 Run Quantum Circuit
              </button>
            </div>
            {/* Results Row - Distribution (left) and Interpretation (right) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              {/* Distribution Section */}
              <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-semibold mb-4 text-white">Measurement Probabilities</h3>
                {simulationResult ? (
                  <div className="space-y-3">
                    {Object.entries(simulationResult).map(([state, probability]) => (
                      <div key={state} className="flex justify-between items-center">
                        <span className="font-mono text-gray-300">|{state}⟩</span>
                        <div className="flex items-center">
                          <div className="w-20 bg-white/20 rounded-full h-2 mr-2">
                            <div 
                              className="bg-[#652db4] h-2 rounded-full" 
                              style={{ width: `${probability * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm text-gray-300">{(probability * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 italic">Build and run a circuit to see results!</p>
                )}
              </div>
              {/* Interpretation Section */}
              <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-white">Interpretation</h3>
                {simulationResult ? (
                  <div className="mt-2 p-3 bg-black/20 rounded-lg flex-1 border border-white/10">
                    <h4 className="font-semibold text-white mb-2">Result Analysis:</h4>
                    <p className="text-sm text-gray-300">
                      Each |state⟩ represents a possible measurement outcome.<br />
                      The percentages show the probability of measuring each state.<br />
                      {Object.keys(simulationResult).length > 1 ? (
                        <>Multiple outcomes indicate <b>quantum superposition</b>!</>
                      ) : (
                        <>Single outcome indicates a <b>classical state</b>.</>
                      )}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 italic flex-1">Interpretation will appear here after running a circuit.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}