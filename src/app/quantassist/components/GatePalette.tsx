import React from 'react';
import { GateTemplate } from '../types';

interface GatePaletteProps {
  gates: GateTemplate[];
  handleDragStart: (gate: GateTemplate) => void;
}

export default function GatePalette({ gates, handleDragStart }: GatePaletteProps) {
  return (
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
  );
} 