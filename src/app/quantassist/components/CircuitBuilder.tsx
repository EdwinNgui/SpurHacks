import React, { useState, useEffect } from "react";
import { QuantumGate } from "../types";
import GateConfigPopup from "./GateConfigPopup";

interface CircuitBuilderProps {
  numQubits: number;
  setNumQubits: (num: number) => void;
  clearCircuit: () => void;
  circuit: QuantumGate[];
  setCircuit: (circuit: QuantumGate[]) => void;
  handleDrop: (qubit: number, position: number) => void;
  activeSection: "manual" | "ai" | "algorithms";
  simulateCircuit: () => void;
}

export default function CircuitBuilder({
  numQubits,
  setNumQubits,
  clearCircuit,
  circuit,
  setCircuit,
  handleDrop,
  activeSection,
  simulateCircuit,
}: CircuitBuilderProps) {
  const [configGate, setConfigGate] = useState<QuantumGate | null>(null);

  // Handle qubit count change - remove CNOT gates if numQubits becomes 1
  const handleQubitCountChange = (newCount: number) => {
    setNumQubits(newCount);

    // If reducing to 1 qubit, remove all CNOT gates
    if (newCount === 1) {
      const filteredCircuit = circuit.filter((gate) => gate.type !== "CNOT");
      if (filteredCircuit.length !== circuit.length) {
        setCircuit(filteredCircuit);
        console.log("Removed CNOT gates - they require at least 2 qubits");
      }
    }
  };

  // Also handle automatic CNOT removal when qubit count changes
  useEffect(() => {
    if (numQubits === 1) {
      const hasCNOTGates = circuit.some((gate) => gate.type === "CNOT");
      if (hasCNOTGates) {
        const filteredCircuit = circuit.filter((gate) => gate.type !== "CNOT");
        setCircuit(filteredCircuit);
        console.log(
          "Automatically removed CNOT gates - they require at least 2 qubits"
        );
      }
    }
  }, [numQubits, circuit, setCircuit]);

  // Handle gate configuration
  const handleGateClick = (gate: QuantumGate) => {
    if (
      gate.type === "RX" ||
      gate.type === "RY" ||
      gate.type === "RZ" ||
      gate.type === "CNOT"
    ) {
      setConfigGate(gate);
    }
  };

  const handleConfigSave = (updatedGate: QuantumGate) => {
    const updatedCircuit = circuit.map((g) =>
      g.id === updatedGate.id ? updatedGate : g
    );
    setCircuit(updatedCircuit);
    setConfigGate(null);
  };

  const handleConfigCancel = () => {
    setConfigGate(null);
  };

  // Get CNOT connections for visualization
  const getCNOTConnections = () => {
    const connections: {
      control: number;
      target: number;
      position: number;
      id: number;
    }[] = [];
    circuit.forEach((gate) => {
      if (
        gate.type === "CNOT" &&
        gate.control !== undefined &&
        gate.target !== undefined
      ) {
        connections.push({
          control: gate.control,
          target: gate.target,
          position: gate.position,
          id: gate.id,
        });
      }
    });
    return connections;
  };

  const cnotConnections = getCNOTConnections();

  // Render a single gate
  const renderGate = (gate: QuantumGate, qubit: number, position: number) => {
    if (gate.type === "CNOT") {
      const isControl = gate.control === qubit;
      const isTarget = gate.target === qubit;

      if (!isControl && !isTarget) return null;

      return (
        <div
          key={`${gate.id}-${qubit}`}
          onClick={() => handleGateClick(gate)}
          className={`rounded-full flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:scale-110 transition-transform ${
            isControl
              ? "bg-[#652db4] w-8 h-8 mx-auto my-auto"
              : "bg-[#3f2a61] w-12 h-12"
          }`}
        >
          {isControl ? "" : "⊕"}
        </div>
      );
    } else {
      return (
        <div
          key={gate.id}
          onClick={() => handleGateClick(gate)}
          className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${
            gate.type === "H"
              ? "bg-[#652db4]"
              : gate.type === "X"
              ? "bg-[#3f2a61]"
              : gate.type === "Y"
              ? "bg-[#652db4]"
              : gate.type === "Z"
              ? "bg-[#3f2a61]"
              : gate.type === "RX"
              ? "bg-[#3f2a61]"
              : gate.type === "RY"
              ? "bg-[#652db4]"
              : gate.type === "RZ"
              ? "bg-[#3f2a61]"
              : "bg-[#3f2a61]"
          } ${
            gate.type === "RX" ||
            gate.type === "RY" ||
            gate.type === "RZ" ||
            gate.type === "CNOT"
              ? "cursor-pointer hover:scale-110 transition-transform"
              : ""
          }`}
        >
          {gate.type}
        </div>
      );
    }
  };

  return (
    <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold text-white">Quantum Circuit</h3>
        <div className="flex gap-2 items-center">
          <label className="text-sm text-gray-300">
            Qubits:
            <select
              value={numQubits}
              onChange={(e) => handleQubitCountChange(Number(e.target.value))}
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

      {/* Circuit Visualization */}
      <div className="bg-black/20 p-4 rounded-lg border-2 border-dashed border-white/20 min-h-64 overflow-x-auto">
        {Array.from({ length: numQubits }, (_, i) => (
          <div key={i} className="mb-8 last:mb-0">
            <div className="flex items-center">
              <span className="text-sm font-mono mr-4 w-12 text-gray-300">
                |{i}⟩
              </span>
              <div className="flex-1 relative" style={{ minWidth: "640px" }}>
                <div className="h-0.5 bg-white/30 w-full absolute top-1/2"></div>

                {/* CNOT connection lines */}
                {cnotConnections.map((connection) => (
                  <div
                    key={`connection-${connection.id}`}
                    className="absolute w-0.5 bg-[#652db4]"
                    style={{
                      left: `${connection.position * 80 + 24}px`,
                      top: `${
                        Math.min(connection.control, connection.target) * 80 +
                        24
                      }px`,
                      height: `${
                        Math.abs(connection.target - connection.control) * 80
                      }px`,
                      zIndex: 1,
                    }}
                  />
                ))}

                {Array.from({ length: 8 }, (_, pos) => (
                  <div
                    key={pos}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => handleDrop(i, pos)}
                    className={`absolute w-12 h-12 border-2 border-transparent rounded-full ${
                      activeSection === "manual" ? "hover:border-white/50" : ""
                    }`}
                    style={{ left: `${pos * 80}px`, top: "-24px", zIndex: 2 }}
                  >
                    {circuit
                      .filter(
                        (gate) =>
                          (gate.qubit === i ||
                            gate.control === i ||
                            gate.target === i) &&
                          gate.position === pos
                      )
                      .map((gate) => renderGate(gate, i, pos))}
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

      {/* Gate Configuration Popup */}
      <GateConfigPopup
        gate={configGate}
        numQubits={numQubits}
        onSave={handleConfigSave}
        onCancel={handleConfigCancel}
        isOpen={configGate !== null}
      />
    </div>
  );
}
