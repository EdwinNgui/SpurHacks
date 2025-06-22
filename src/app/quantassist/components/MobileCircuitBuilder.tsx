'use client';

import React, { useState } from 'react';
import { QuantumGate, GateTemplate } from '../types';

interface MobileCircuitBuilderProps {
  numQubits: number;
  setNumQubits: (num: number) => void;
  circuit: QuantumGate[];
  setCircuit: (circuit: QuantumGate[]) => void;
  gates: GateTemplate[];
  onSimulate: () => void;
  onClear: () => void;
}

export default function MobileCircuitBuilder({
  numQubits,
  setNumQubits,
  circuit,
  setCircuit,
  gates,
  onSimulate,
  onClear
}: MobileCircuitBuilderProps) {
  const [selectedGate, setSelectedGate] = useState<GateTemplate | null>(null);
  const [showGateSelector, setShowGateSelector] = useState(false);
  const [showQubitSelector, setShowQubitSelector] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState<number>(0);

  const handleGateSelect = (gate: GateTemplate) => {
    setSelectedGate(gate);
    setShowGateSelector(false);
    setShowQubitSelector(true);
  };

  const handleQubitSelect = (qubit: number) => {
    if (!selectedGate) return;

    const newGate: QuantumGate = {
      id: Date.now() + Math.random(),
      type: selectedGate.type,
      position: selectedPosition,
    };

    if (selectedGate.type === "CNOT") {
      newGate.control = qubit;
      newGate.target = (qubit + 1) % numQubits;
    } else {
      newGate.qubit = qubit;
    }

    setCircuit([...circuit, newGate]);
    setSelectedGate(null);
    setShowQubitSelector(false);
  };

  const removeGate = (gateId: number) => {
    setCircuit(circuit.filter(gate => gate.id !== gateId));
  };

  const getGateSymbol = (gate: QuantumGate) => {
    switch (gate.type) {
      case 'H': return 'H';
      case 'X': return 'X';
      case 'Y': return 'Y';
      case 'Z': return 'Z';
      case 'CNOT': return '⊕';
      case 'MEASURE': return 'M';
      default: return '?';
    }
  };

  const getGateColor = (gate: QuantumGate) => {
    switch (gate.type) {
      case 'H': return 'bg-blue-500';
      case 'X': return 'bg-red-500';
      case 'Y': return 'bg-yellow-500';
      case 'Z': return 'bg-purple-500';
      case 'CNOT': return 'bg-green-500';
      case 'MEASURE': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const maxPosition = circuit.length > 0 ? Math.max(...circuit.map(g => g.position), 0) : 0;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 md:hidden">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Mobile Circuit Builder</h3>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          >
            Clear
          </button>
          <button
            onClick={onSimulate}
            disabled={circuit.length === 0}
            className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Simulate
          </button>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Number of Qubits
        </label>
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map(num => (
            <button
              key={num}
              onClick={() => setNumQubits(num)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                numQubits === num
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {num}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <button
          onClick={() => setShowGateSelector(true)}
          className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
        >
          + Add Gate
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Current Circuit</h4>
        {circuit.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg">
            <p>No gates added yet</p>
            <p className="text-sm">Tap "Add Gate" to get started</p>
          </div>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {circuit.map((gate) => (
              <div
                key={gate.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${getGateColor(gate)}`}>
                    {getGateSymbol(gate)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      {gate.type} Gate
                    </div>
                    <div className="text-sm text-gray-600">
                      {gate.type === 'CNOT' 
                        ? `Control: ${gate.control}, Target: ${gate.target}`
                        : `Qubit: ${gate.qubit}`
                      } • Position: {gate.position}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => removeGate(gate.id)}
                  className="p-1 text-red-600 hover:text-red-800"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showGateSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Select Gate</h3>
                <button
                  onClick={() => setShowGateSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {gates.map((gate) => (
                  <button
                    key={gate.type}
                    onClick={() => handleGateSelect(gate)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm ${gate.color} mb-2`}>
                      {gate.symbol}
                    </div>
                    <div className="font-medium text-gray-900">{gate.name}</div>
                    <div className="text-sm text-gray-600">{gate.description}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showQubitSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-sm">
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Select Qubit</h3>
                <button
                  onClick={() => setShowQubitSelector(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: numQubits }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => handleQubitSelect(i)}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-center"
                  >
                    <div className="font-medium text-gray-900">Qubit {i}</div>
                    <div className="text-sm text-gray-600">Position {selectedPosition}</div>
                  </button>
                ))}
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gate Position
                </label>
                <div className="flex space-x-2">
                  {Array.from({ length: maxPosition + 2 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedPosition(i)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        selectedPosition === i
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 