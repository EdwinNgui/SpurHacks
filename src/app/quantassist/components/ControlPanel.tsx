import React from "react";
import GatePalette from "./GatePalette";
import AiAssistant from "./AiAssistant";
import GroverSearch from "./GroverSearch";
import { GateTemplate } from "../types";

interface ControlPanelProps {
<<<<<<< HEAD
    activeSection: 'manual' | 'ai' | 'algorithms';
    setActiveSection: (section: 'manual' | 'ai' | 'algorithms') => void;
    gates: GateTemplate[];
    handleDragStart: (gate: GateTemplate) => void;
    userQuery: string;
    setUserQuery: (query: string) => void;
    handleQuerySubmit: () => void;
    isProcessing: boolean;
    exampleQueries: string[];
    aiResponse: string;
    buildGroverCircuit: (password: string, iterations: number) => void;
    onAnalyzeCircuit?: () => void;
    hasCircuit: boolean;
}

export default function ControlPanel(props: ControlPanelProps) {
    const {
        activeSection,
        setActiveSection,
        gates,
        handleDragStart,
        userQuery,
        setUserQuery,
        handleQuerySubmit,
        isProcessing,
        exampleQueries,
        aiResponse,
        buildGroverCircuit,
        onAnalyzeCircuit,
        hasCircuit
    } = props;
=======
  activeSection: "manual" | "ai" | "algorithms";
  setActiveSection: (section: "manual" | "ai" | "algorithms") => void;
  gates: GateTemplate[];
  handleDragStart: (gate: GateTemplate) => void;
  userQuery: string;
  setUserQuery: (query: string) => void;
  handleQuerySubmit: () => void;
  isProcessing: boolean;
  exampleQueries: string[];
  aiResponse: string;
  buildGroverCircuit: (password: string, iterations: number) => void;
  numQubits: number;
}

export default function ControlPanel(props: ControlPanelProps) {
  const {
    activeSection,
    setActiveSection,
    gates,
    handleDragStart,
    userQuery,
    setUserQuery,
    handleQuerySubmit,
    isProcessing,
    exampleQueries,
    aiResponse,
    buildGroverCircuit,
  } = props;
>>>>>>> 27f4445f11db2c3a7406df6e043744f43e36bfeb

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
            onClick={() => setActiveSection("ai")}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors flex flex-col items-center ${
              activeSection === "ai"
                ? "bg-white/20 text-white"
                : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <span>🤖</span>
            <span className="mt-1">AI</span>
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
<<<<<<< HEAD
      
      {activeSection === 'manual' && (
        <GatePalette gates={gates} handleDragStart={handleDragStart} />
      )}
      
      {activeSection === 'ai' && (
        <AiAssistant
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleQuerySubmit={handleQuerySubmit}
            isProcessing={isProcessing}
            exampleQueries={exampleQueries}
            aiResponse={aiResponse}
            onAnalyzeCircuit={onAnalyzeCircuit}
            hasCircuit={hasCircuit}
=======

      {activeSection === "manual" && (
        <GatePalette
          gates={gates}
          handleDragStart={handleDragStart}
          numQubits={props.numQubits}
>>>>>>> 27f4445f11db2c3a7406df6e043744f43e36bfeb
        />
      )}

      {activeSection === "ai" && (
        <AiAssistant
          userQuery={userQuery}
          setUserQuery={setUserQuery}
          handleQuerySubmit={handleQuerySubmit}
          isProcessing={isProcessing}
          exampleQueries={exampleQueries}
          aiResponse={aiResponse}
        />
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
