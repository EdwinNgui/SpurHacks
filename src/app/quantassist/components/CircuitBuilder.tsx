import React from 'react';
import { QuantumGate } from '../types';

interface CircuitBuilderProps {
  numQubits: number;
  setNumQubits: (num: number) => void;
  clearCircuit: () => void;
  circuit: QuantumGate[];
  handleDrop: (qubit: number, position: number) => void;
  activeSection: 'manual' | 'ai';
  simulateCircuit: () => void;
}

export default function CircuitBuilder({
  numQubits,
  setNumQubits,
  clearCircuit,
  circuit,
  handleDrop,
  activeSection,
  simulateCircuit,
}: CircuitBuilderProps) {
  return (
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
  );
} 