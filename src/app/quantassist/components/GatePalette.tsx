import React from "react";
import { GateTemplate } from "../types";

interface GatePaletteProps {
  gates: GateTemplate[];
  handleDragStart: (gate: GateTemplate) => void;
  numQubits: number;
}

export default function GatePalette({
  gates,
  handleDragStart,
  numQubits,
}: GatePaletteProps) {
  return (
    <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Quantum Gates</h3>
      <div className="space-y-3">
        {gates.map((gate) => {
          const isDisabled = gate.type === "CNOT" && numQubits === 1;
          const disabledReason = numQubits === 1 ? "(requires 2+ qubits)" : "";

          return (
            <div
              key={gate.type}
              draggable={!isDisabled}
              onDragStart={() => !isDisabled && handleDragStart(gate)}
              className={`text-white p-3 rounded-lg transition-colors backdrop-blur-md border border-white/20 ${
                isDisabled
                  ? "bg-white/5 cursor-not-allowed opacity-50"
                  : "bg-white/10 cursor-move hover:bg-white/20"
              }`}
            >
              <div className="font-bold">
                {gate.symbol} - {gate.name}
                {disabledReason && (
                  <span className="text-xs text-gray-400 ml-2">
                    {disabledReason}
                  </span>
                )}
              </div>
              <div className="text-sm opacity-90">{gate.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
