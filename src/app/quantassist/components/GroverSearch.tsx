import React, { useState } from 'react';

interface GroverSearchProps {
  buildGroverCircuit: (password: string, iterations: number) => void;
  isProcessing: boolean;
}

export default function GroverSearch({ buildGroverCircuit, isProcessing }: GroverSearchProps) {
  const [password, setPassword] = useState("10");
  const [iterations, setIterations] = useState(1);

  const handleBuild = () => {
    buildGroverCircuit(password, iterations);
  };

  return (
    <div className="bg-gradient-to-br from-[#652db4]/20 to-[#3f2a61]/20 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
      <h3 className="text-xl font-semibold mb-4 text-white">Grover's Search</h3>
      <div className="space-y-4">
        <div>
          <label htmlFor="password-select" className="block text-sm font-medium text-gray-300 mb-1">
            Secret Password (2-bit)
          </label>
          <select
            id="password-select"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#652db4] text-white"
          >
            <option value="00">00</option>
            <option value="01">01</option>
            <option value="10">10</option>
            <option value="11">11</option>
          </select>
        </div>
        <div>
          <label htmlFor="iterations-input" className="block text-sm font-medium text-gray-300 mb-1">
            Grover Iterations
          </label>
          <input
            type="number"
            id="iterations-input"
            value={iterations}
            onChange={(e) => setIterations(Math.max(0, parseInt(e.target.value) || 0))}
            min="0"
            className="w-full p-2 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#652db4] text-white"
          />
        </div>
        <button
          onClick={handleBuild}
          disabled={isProcessing}
          className="w-full bg-[#652db4] text-white px-4 py-2 rounded-lg hover:bg-[#8145c2] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Build Grover Circuit
        </button>
      </div>
    </div>
  );
} 