import React, { useState, useEffect } from "react";
import { QuantumGate } from "../types";

interface GateConfigPopupProps {
  gate: QuantumGate | null;
  numQubits: number;
  onSave: (updatedGate: QuantumGate) => void;
  onCancel: () => void;
  isOpen: boolean;
}

export default function GateConfigPopup({
  gate,
  numQubits,
  onSave,
  onCancel,
  isOpen,
}: GateConfigPopupProps) {
  const [theta, setTheta] = useState<number>(Math.PI / 2);
  const [control, setControl] = useState<number>(0);
  const [target, setTarget] = useState<number>(1);

  useEffect(() => {
    if (gate) {
      if (gate.theta !== undefined) {
        setTheta(gate.theta);
      }
      if (gate.control !== undefined) {
        setControl(gate.control);
      }
      if (gate.target !== undefined) {
        setTarget(gate.target);
      }
    }
  }, [gate]);

  if (!isOpen || !gate) return null;

  const handleSave = () => {
    const updatedGate = { ...gate };

    if (gate.type === "RX" || gate.type === "RY" || gate.type === "RZ") {
      updatedGate.theta = theta;
    } else if (gate.type === "CNOT") {
      updatedGate.control = control;
      updatedGate.target = target;
    }

    onSave(updatedGate);
  };

  const isRotationGate =
    gate.type === "RX" || gate.type === "RY" || gate.type === "RZ";
  const isCNOTGate = gate.type === "CNOT";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#3f2a61] border border-white/10 rounded-2xl p-6 max-w-md w-full mx-4">
        <h3 className="text-xl font-semibold text-white mb-4">
          Configure {gate.type} Gate
        </h3>

        {isRotationGate && (
          <div className="mb-4">
            <label className="block text-sm text-gray-300 mb-2">
              Theta (θ) Value:
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="6.28"
                step="0.01"
                value={theta}
                onChange={(e) => setTheta(parseFloat(e.target.value))}
                className="flex-1"
              />
              <span className="text-white font-mono text-sm w-16">
                {theta.toFixed(2)}
              </span>
            </div>
            <div className="text-xs text-gray-400 mt-1">
              Range: 0 to 2π (≈ 6.28)
            </div>
          </div>
        )}

        {isCNOTGate && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Control Qubit:
              </label>
              <select
                value={control}
                onChange={(e) => setControl(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/20 rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#652db4]"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i}>
                    Qubit {i}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-2">
                Target Qubit:
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(parseInt(e.target.value))}
                className="w-full bg-black/20 border border-white/20 rounded px-3 py-2 text-white focus:ring-2 focus:ring-[#652db4]"
              >
                {Array.from({ length: numQubits }, (_, i) => (
                  <option key={i} value={i} disabled={i === control}>
                    Qubit {i} {i === control ? "(Control)" : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            className="flex-1 bg-[#652db4] text-white py-2 rounded-lg hover:bg-[#8145c2] transition-colors"
          >
            Save
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
