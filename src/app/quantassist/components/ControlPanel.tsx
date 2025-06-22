import React from "react";
import GatePalette from "./GatePalette";
import GroverSearch from "./GroverSearch";
import { GateTemplate } from "../types";

interface ControlPanelProps {
  activeSection: "manual" | "algorithms";
  setActiveSection: (section: "manual" | "algorithms") => void;
  gates: GateTemplate[];
  handleDragStart: (gate: GateTemplate) => void;
  buildGroverCircuit: (password: string, iterations: number) => void;
  isProcessing: boolean;
  numQubits: number;
}

export default function ControlPanel(props: ControlPanelProps) {
  const {
    activeSection,
    setActiveSection,
    gates,
    handleDragStart,
    buildGroverCircuit,
    isProcessing,
    numQubits,
  } = props;

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Section Toggle */}
      <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-2">
        <div className="flex">
          <button
            onClick={() => setActiveSection("manual")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex flex-col items-center ${
              activeSection === "manual"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>🔧</span>
            <span className="mt-1">Manual</span>
          </button>
          <button
            onClick={() => setActiveSection("algorithms")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex flex-col items-center ${
              activeSection === "algorithms"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>🔬</span>
            <span className="mt-1">Algorithms</span>
          </button>
        </div>
      </div>

      {activeSection === "manual" && (
        <GatePalette gates={gates} handleDragStart={handleDragStart} numQubits={numQubits} />
      )}

      {activeSection === "algorithms" && (
        <GroverSearch
          buildGroverCircuit={buildGroverCircuit}
          isProcessing={isProcessing}
        />
      )}
    </div>
  );
}
