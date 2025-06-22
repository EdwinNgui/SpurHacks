"use client";

import React, { useState, useEffect } from "react";
import { runCircuit } from "@/lib/simulation";
import { Circuit, Gate, Complex } from "@/lib/types";
import {
  QuantumGate,
  GateTemplate,
  SimulationResult,
  AlgorithmTemplate,
} from "./types";

import ControlPanel from "./components/ControlPanel";
import CircuitBuilder from "./components/CircuitBuilder";
import ResultsPanel from "./components/ResultsPanel";

const pageConfig = {
  manual: {
    title: "Quantum Circuit Sandbox",
    description:
      "Manually build and simulate your own quantum circuits by dragging gates.",
  },
  ai: {
    title: "AI Circuit Builder",
    description:
      "Describe the circuit you want, and let the AI build it for you.",
  },
  algorithms: {
    title: "Grover's Playground",
    description:
      "Explore the quantum search algorithm in an interactive sandbox.",
  },
};

export default function QuantumCircuitAssistantPage() {
  const [numQubits, setNumQubitsState] = useState<number>(2);
  const [circuit, setCircuit] = useState<QuantumGate[]>([]);
  const [draggedGate, setDraggedGate] = useState<GateTemplate | null>(null);
  const [simulationResult, setSimulationResult] =
    useState<SimulationResult | null>(null);
  const [finalStateVector, setFinalStateVector] = useState<Complex[] | null>(
    null
  );
  const [interpretationMode, setInterpretationMode] = useState<
    "simple" | "technical"
  >("simple");
  const [userQuery, setUserQuery] = useState<string>("");
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<
    "manual" | "ai" | "algorithms"
  >("manual");

  const currentPage = pageConfig[activeSection];

  // Available quantum gates
  const gates: GateTemplate[] = [
    {
      type: "H",
      name: "Hadamard",
      symbol: "H",
      color: "bg-purple-500",
      description: "Creates superposition",
    },
    {
      type: "X",
      name: "Pauli-X",
      symbol: "X",
      color: "bg-purple-700",
      description: "Bit flip (NOT gate)",
    },
    {
      type: "Y",
      name: "Pauli-Y",
      symbol: "Y",
      color: "bg-purple-500",
      description: "Y rotation",
    },
    {
      type: "Z",
      name: "Pauli-Z",
      symbol: "Z",
      color: "bg-purple-700",
      description: "Phase flip",
    },
    {
      type: "CNOT",
      name: "CNOT",
      symbol: "⊕",
      color: "bg-purple-500",
      description: "Controlled NOT",
    },
    {
      type: "RX",
      name: "RX",
      symbol: "RX",
      color: "bg-purple-700",
      description: "X rotation",
    },
    {
      type: "RY",
      name: "RY",
      symbol: "RY",
      color: "bg-purple-500",
      description: "Y rotation",
    },
  ];

  // Quantum algorithm templates
  const quantumAlgorithms: { [key: string]: AlgorithmTemplate } = {
    bell_state: {
      name: "Bell State (Entanglement)",
      description: "Creates maximum entanglement between two qubits",
      circuit: [
        { id: 1, type: "H", qubit: 0, position: 0 },
        { id: 2, type: "CNOT", control: 0, target: 1, position: 1 },
      ],
      qubits: 2,
    },
    superposition: {
      name: "Quantum Superposition",
      description: "Puts a qubit in equal superposition of |0⟩ and |1⟩",
      circuit: [{ id: 1, type: "H", qubit: 0, position: 0 }],
      qubits: 1,
    },
    quantum_coin_flip: {
      name: "Quantum Coin Flip",
      description: "True random coin flip using quantum superposition",
      circuit: [{ id: 1, type: "H", qubit: 0, position: 0 }],
      qubits: 1,
    },
    grover_2bit: {
      name: "Grover Search (2-bit)",
      description: "Simple Grover search for 2 qubits",
      circuit: [
        { id: 1, type: "H", qubit: 0, position: 0 },
        { id: 2, type: "H", qubit: 1, position: 0 },
        { id: 3, type: "Z", qubit: 0, position: 1 },
        { id: 4, type: "Z", qubit: 1, position: 1 },
        { id: 5, type: "H", qubit: 0, position: 2 },
        { id: 6, type: "H", qubit: 1, position: 2 },
      ],
      qubits: 2,
    },
    quantum_interference: {
      name: "Quantum Interference",
      description: "Demonstrates wave-like interference in quantum systems",
      circuit: [
        { id: 1, type: "H", qubit: 0, position: 0 },
        { id: 2, type: "Z", qubit: 0, position: 1 },
        { id: 3, type: "H", qubit: 0, position: 2 },
      ],
      qubits: 1,
    },
  };

  // AI-powered processing for user queries
  const processUserQuery = async (query: string) => {
    setIsProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    const lowerQuery = query.toLowerCase();
    let selectedAlgorithm: AlgorithmTemplate | null = null;
    let explanation = "";
    if (
      lowerQuery.includes("entangle") ||
      lowerQuery.includes("bell") ||
      lowerQuery.includes("correlated")
    ) {
      selectedAlgorithm = quantumAlgorithms.bell_state;
      explanation =
        "I'll create a Bell state to demonstrate quantum entanglement. This circuit puts two qubits in a maximally entangled state where measuring one instantly affects the other, regardless of distance.";
    } else if (
      lowerQuery.includes("superposition") ||
      lowerQuery.includes("both states") ||
      lowerQuery.includes("0 and 1")
    ) {
      selectedAlgorithm = quantumAlgorithms.superposition;
      explanation =
        "I'll create a superposition state where a qubit exists in both |0⟩ and |1⟩ states simultaneously. The Hadamard gate creates this quantum superposition.";
    } else if (
      lowerQuery.includes("coin flip") ||
      lowerQuery.includes("random") ||
      lowerQuery.includes("50/50")
    ) {
      selectedAlgorithm = quantumAlgorithms.quantum_coin_flip;
      explanation =
        "I'll build a true quantum random number generator. Unlike classical randomness, this uses quantum superposition to create genuinely random results.";
    } else if (
      lowerQuery.includes("search") ||
      lowerQuery.includes("grover") ||
      lowerQuery.includes("find")
    ) {
      selectedAlgorithm = quantumAlgorithms.grover_2bit;
      explanation =
        "I'll implement a simplified Grover search algorithm. This quantum algorithm can search unsorted databases quadratically faster than classical methods.";
    } else if (
      lowerQuery.includes("interference") ||
      lowerQuery.includes("wave") ||
      lowerQuery.includes("cancel")
    ) {
      selectedAlgorithm = quantumAlgorithms.quantum_interference;
      explanation =
        "I'll demonstrate quantum interference where quantum states can constructively or destructively interfere, similar to waves in physics.";
    } else if (lowerQuery.includes("teleport")) {
      explanation =
        "Quantum teleportation requires 3 qubits and is quite complex. Let me show you entanglement first, which is a key component of teleportation.";
      selectedAlgorithm = quantumAlgorithms.bell_state;
    } else if (lowerQuery.includes("factor") || lowerQuery.includes("shor")) {
      explanation =
        "Shor's factoring algorithm is very complex and requires many qubits. Let me show you a simpler quantum algorithm instead - quantum interference, which demonstrates key quantum principles.";
      selectedAlgorithm = quantumAlgorithms.quantum_interference;
    } else {
      explanation =
        "I understand you want to explore quantum computing! Let me show you quantum superposition - a fundamental concept where particles exist in multiple states simultaneously.";
      selectedAlgorithm = quantumAlgorithms.superposition;
    }
    if (selectedAlgorithm) {
      setNumQubitsState(selectedAlgorithm.qubits);
      setCircuit(
        selectedAlgorithm.circuit.map((gate, index) => ({
          ...gate,
          id: Date.now() + index,
        }))
      );
      setAiResponse(
        `${explanation}\n\n**Algorithm:** ${selectedAlgorithm.name}\n**Description:** ${selectedAlgorithm.description}\n\nI've built the circuit for you. Click "Run Quantum Circuit" to see the results!`
      );
    }
    setIsProcessing(false);
  };

  const handleQuerySubmit = () => {
    if (userQuery.trim()) {
      processUserQuery(userQuery);
    }
  };

  const exampleQueries = [
    "Create a quantum coin flip",
    "Show me quantum entanglement",
    "I want to see superposition",
    "Build a quantum search algorithm",
    "Demonstrate quantum interference",
  ];

  const simulateCircuit = () => {
    const maxPosition = circuit.reduce(
      (max, gate) => Math.max(max, gate.position),
      0
    );
    const steps: Gate[][] = Array.from({ length: maxPosition + 1 }, () => []);

    for (const gate of circuit) {
      const backendGate: Gate = {
        type: gate.type as Gate["type"],
        targets: [],
      };

      if (gate.type === "CNOT") {
        if (gate.control !== undefined && gate.target !== undefined) {
          backendGate.targets = [gate.control, gate.target];
        }
      } else if (gate.type === "CCNOT") {
        if (
          gate.control !== undefined &&
          gate.control2 !== undefined &&
          gate.target !== undefined
        ) {
          backendGate.targets = [gate.control, gate.control2, gate.target];
        }
      } else {
        if (gate.qubit !== undefined) {
          backendGate.targets = [gate.qubit];
        }
      }

      // Handle rotation gates with theta parameter
      if (gate.type === "RX" || gate.type === "RY" || gate.type === "RZ") {
        backendGate.params =
          gate.theta !== undefined ? gate.theta : Math.PI / 2;
      }

      if (backendGate.targets.length > 0) {
        steps[gate.position].push(backendGate);
      }
    }

    const backendCircuit: Circuit = { gates: steps };

    if (backendCircuit.gates.every((step) => step.length === 0)) {
      setSimulationResult(null);
      return;
    }

    // 2. Run the simulation using the backend.
    const finalState = runCircuit(backendCircuit, numQubits);
    setFinalStateVector(finalState);

    // 3. Process the results.
    const probabilities: SimulationResult = {};
    finalState.forEach((amplitude, index) => {
      const probability =
        amplitude[0] * amplitude[0] + amplitude[1] * amplitude[1]; // prob = |a+bi|^2 = a^2+b^2
      if (probability > 0.001) {
        const stateKey = index.toString(2).padStart(numQubits, "0");
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

    // Prevent CNOT gates when there's only 1 qubit
    if (draggedGate.type === "CNOT" && numQubits === 1) {
      console.log("CNOT gates require at least 2 qubits");
      return; // Don't allow CNOT gates with only 1 qubit
    }

    // Prevent CNOT gates from being placed on the last qubit
    if (draggedGate.type === "CNOT" && qubit === numQubits - 1) {
      console.log("CNOT gates cannot be placed on the last qubit");
      return; // Don't allow CNOT gates on the last qubit
    }

    const newGate: QuantumGate = {
      id: Date.now(),
      type: draggedGate.type,
      qubit: qubit,
      position: position,
    };
    if (draggedGate.type === "CNOT") {
      const control = qubit;
      // Ensure target is not the same as control and not the last qubit
      const target = qubit === 0 ? 1 : 0;
      newGate.control = control;
      newGate.target = target;
      delete newGate.qubit;
    } else if (draggedGate.type === "CCNOT") {
      newGate.control = 0;
      newGate.control2 = 1;
      newGate.target = 2;
      delete newGate.qubit;
    }
    // Add default theta for rotation gates
    if (
      draggedGate.type === "RX" ||
      draggedGate.type === "RY" ||
      draggedGate.type === "RZ"
    ) {
      newGate.theta = Math.PI / 2;
    }
    setCircuit([...circuit, newGate]);
    setDraggedGate(null);
  };

  const clearCircuit = () => {
    setCircuit([]);
    setSimulationResult(null);
    setFinalStateVector(null);
    setAiResponse("");
  };

  const buildGroverCircuit = (password: string, iterations: number) => {
    setNumQubitsState(3);
    const newCircuit: QuantumGate[] = [];
    let position = 0;
    let idCounter = Date.now();

    const addGate = (gate: Omit<QuantumGate, "id">) => {
      newCircuit.push({ ...gate, id: idCounter++ });
    };

    // 1. Initial Superposition
    addGate({ type: "H", qubit: 0, position });
    addGate({ type: "H", qubit: 1, position });
    position++;

    for (let i = 0; i < iterations; i++) {
      // 2. Oracle
      if (password[1] === "0") addGate({ type: "X", qubit: 0, position });
      if (password[0] === "0") addGate({ type: "X", qubit: 1, position });
      position++;

      addGate({ type: "CCNOT", control: 0, control2: 1, target: 2, position });
      position++;

      if (password[1] === "0") addGate({ type: "X", qubit: 0, position });
      if (password[0] === "0") addGate({ type: "X", qubit: 1, position });
      position++;

      // 3. Diffuser
      addGate({ type: "H", qubit: 0, position });
      addGate({ type: "H", qubit: 1, position });
      position++;
      addGate({ type: "X", qubit: 0, position });
      addGate({ type: "X", qubit: 1, position });
      position++;
      addGate({ type: "H", qubit: 1, position });
      position++;
      addGate({ type: "CNOT", control: 0, target: 1, position });
      position++;
      addGate({ type: "H", qubit: 1, position });
      position++;
      addGate({ type: "X", qubit: 0, position });
      addGate({ type: "X", qubit: 1, position });
      position++;
      addGate({ type: "H", qubit: 0, position });
      addGate({ type: "H", qubit: 1, position });
      position++;
    }

    setCircuit(newCircuit);
    setActiveSection("manual"); // Switch to manual view to see the circuit
  };

  // Development helper - remove in production
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).testCircuitSimulation = () => {
        console.log('Testing circuit simulation...');
        try {
          // Test with a simple valid circuit
          const testCircuit: Circuit = {
            gates: [
              [
                { type: 'H' as const, targets: [0] }
              ],
              [
                { type: 'H' as const, targets: [0] } // Using H instead of MEASURE since MEASURE isn't in the Gate type
              ]
            ]
          };
          
          const result = runCircuit(testCircuit, 1);
          console.log('Simulation test result:', result);
          return result;
        } catch (error) {
          console.error('Simulation test error:', error);
          return null;
        }
      };
      
      (window as any).debugCircuit = (circuit: any) => {
        console.log('Debugging circuit:', circuit);
        if (circuit && Array.isArray(circuit)) {
          circuit.forEach((gate: any, index: number) => {
            console.log(`Gate ${index}:`, gate);
            if (!gate || typeof gate !== 'object' || Object.keys(gate).length === 0) {
              console.warn(`Gate ${index} is empty or invalid:`, gate);
            }
          });
        }
      };
      
      (window as any).testQiskit = async () => {
        console.log('Testing Qiskit Code Generation...');
        try {
          const response = await fetch('/api/test-qiskit');
          const result = await response.json();
          console.log('Qiskit Test Result:', result);
          return result;
        } catch (error) {
          console.error('Qiskit Test Error:', error);
          return null;
        }
      };
      
      (window as any).generateQiskitCode = async (circuit: any, numQubits: number) => {
        console.log('Generating Qiskit code for circuit:', circuit);
        try {
          const response = await fetch('/api/qiskit-code', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ circuit, numQubits })
          });
          
          const result = await response.json();
          console.log('Qiskit Code Generation Result:', result);
          return result;
        } catch (error) {
          console.error('Qiskit Code Generation Error:', error);
          return null;
        }
      };
    }
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10rem] left-[-10rem] w-96 h-96 bg-[#652db4]/40 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
        <div
          className="absolute bottom-[-10rem] right-[-2.5rem] w-96 h-96 bg-[#3f2a61]/50 rounded-full filter blur-3xl opacity-80 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute bottom-[-5rem] left-[-5rem] w-80 h-80 bg-[#652db4]/30 rounded-full filter blur-2xl opacity-80 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
        <div
          className="absolute top-1/3 right-1/4 w-72 h-72 bg-[#652db4]/50 rounded-full filter blur-3xl opacity-60 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-1/3 left-1/3 w-64 h-64 bg-[#3f2a61]/40 rounded-full filter blur-2xl opacity-70 animate-pulse"
          style={{ animationDelay: "3s" }}
        ></div>
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#652db4]/60 rounded-full filter blur-2xl opacity-50 animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>
      <div className="relative z-10 p-6 text-gray-300">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-white">
            {currentPage.title}
          </h1>
          <p className="text-center text-gray-300 mb-8">
            {currentPage.description}
          </p>

          {/* Glow effect behind title */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
            <div className="w-[40rem] h-[40rem] bg-[#652db4]/50 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute w-[30rem] h-[30rem] bg-[#3f2a61]/40 rounded-full blur-2xl animate-pulse"
              style={{ animationDelay: "1.5s" }}
            ></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <ControlPanel
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              gates={gates}
              handleDragStart={handleDragStart}
              userQuery={userQuery}
              setUserQuery={setUserQuery}
              handleQuerySubmit={handleQuerySubmit}
              isProcessing={isProcessing}
              exampleQueries={exampleQueries}
              aiResponse={aiResponse}
              buildGroverCircuit={buildGroverCircuit}
              hasCircuit={circuit.length > 0}
              numQubits={numQubits}
            />
            <div className="lg:col-span-3 flex flex-col gap-6">
              <CircuitBuilder
                numQubits={numQubits}
                setNumQubits={setNumQubitsState}
                clearCircuit={clearCircuit}
                circuit={circuit}
                setCircuit={setCircuit}
                handleDrop={handleDrop}
                activeSection={activeSection}
                simulateCircuit={simulateCircuit}
              />
              <ResultsPanel
                simulationResult={simulationResult}
                interpretationMode={interpretationMode}
                setInterpretationMode={setInterpretationMode}
                finalStateVector={finalStateVector}
                numQubits={numQubits}
                circuit={circuit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
