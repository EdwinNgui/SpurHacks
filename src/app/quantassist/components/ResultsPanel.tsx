import React from 'react';
import { Complex } from '@/lib/types';
import { SimulationResult } from '../types';

interface ResultsPanelProps {
    simulationResult: SimulationResult | null;
    interpretationMode: 'simple' | 'technical';
    setInterpretationMode: (mode: 'simple' | 'technical') => void;
    finalStateVector: Complex[] | null;
    numQubits: number;
}

function MeasurementProbabilities({ simulationResult }: { simulationResult: SimulationResult | null }) {
    return (
        <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Measurement Probabilities</h3>
            {simulationResult ? (
                <div className="space-y-3">
                    {Object.entries(simulationResult).map(([state, probability]) => (
                        <div key={state} className="flex justify-between items-center">
                            <span className="font-mono text-gray-300">|{state}⟩</span>
                            <div className="flex items-center">
                                <div className="w-20 bg-white/20 rounded-full h-2 mr-2">
                                    <div
                                        className="bg-[#652db4] h-2 rounded-full"
                                        style={{ width: `${probability * 100}%` }}
                                    ></div>
                                </div>
                                <span className="text-sm text-gray-300">{(probability * 100).toFixed(1)}%</span>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-400 italic">Build and run a circuit to see results!</p>
            )}
        </div>
    );
}

function Interpretation({
    interpretationMode,
    setInterpretationMode,
    simulationResult,
    finalStateVector,
    numQubits
}: Omit<ResultsPanelProps, 'simulationResult'> & { simulationResult: SimulationResult | null }) {
    return (
        <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Interpretation</h3>
                <div className="flex items-center gap-2">
                    <span className={`text-sm ${interpretationMode === 'simple' ? 'text-white' : 'text-gray-400'}`}>Simple</span>
                    <button
                        onClick={() => setInterpretationMode(interpretationMode === 'simple' ? 'technical' : 'simple')}
                        className="w-12 h-6 rounded-full p-1 bg-black/20 flex items-center transition-colors"
                    >
                        <div
                            className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                                interpretationMode === 'technical' ? 'translate-x-6' : ''
                            }`}
                        />
                    </button>
                    <span className={`text-sm ${interpretationMode === 'technical' ? 'text-white' : 'text-gray-400'}`}>Technical</span>
                </div>
            </div>

            {simulationResult ? (
                <>
                    {interpretationMode === 'simple' ? (
                        <div className="mt-2 p-3 bg-black/20 rounded-lg flex-1 border border-white/10">
                            <h4 className="font-semibold text-white mb-2">Result Analysis:</h4>
                            <p className="text-sm text-gray-300">
                                Each |state⟩ represents a possible measurement outcome.<br />
                                The percentages show the probability of observing each state when the qubits are measured.<br />
                                {Object.keys(simulationResult).length > 1 ? (
                                    <>This mix of outcomes indicates the circuit has created <b>quantum superposition</b>!</>
                                ) : (
                                    <>A single outcome suggests the circuit produced a <b>classical state</b>.</>
                                )}
                            </p>
                        </div>
                    ) : (
                        <div className="mt-2 p-3 bg-black/40 rounded-lg flex-1 border border-white/10 text-sm text-gray-300 overflow-y-auto" style={{ maxHeight: '300px' }}>
                            <h4 className="font-semibold text-white mb-2">Technical Details:</h4>
                            <p className="mb-2">The final state of the system is described by a state vector in a Hilbert space of dimension 2<sup>{numQubits}</sup>. Each component is a complex amplitude for a basis state.</p>
                            <div className="font-mono text-xs whitespace-pre-wrap break-words bg-black/20 p-2 rounded">
                                {finalStateVector && finalStateVector.map((c, i) =>
                                    `|${i.toString(2).padStart(numQubits, '0')}⟩: ${c[0].toFixed(3)} + ${c[1].toFixed(3)}i`
                                ).join('\n')}
                            </div>
                            <p className="mt-2">
                                The probability of measuring a state is the squared magnitude of its amplitude: P = |a+bi|² = a² + b².
                            </p>
                        </div>
                    )}
                </>
            ) : (
                <p className="text-gray-400 italic flex-1">Interpretation will appear here after running a circuit.</p>
            )}
        </div>
    );
}


export default function ResultsPanel(props: ResultsPanelProps) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      <MeasurementProbabilities simulationResult={props.simulationResult} />
      <Interpretation {...props} />
    </div>
  );
} 