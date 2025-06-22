import React, { useState, useEffect } from 'react';
import { Complex } from '@/lib/types';
import { SimulationResult, QuantumGate } from '../types';

interface ResultsPanelProps {
    simulationResult: SimulationResult | null;
    interpretationMode: 'simple' | 'technical';
    setInterpretationMode: (mode: 'simple' | 'technical') => void;
    finalStateVector: Complex[] | null;
    numQubits: number;
    circuit: QuantumGate[];
}

interface QiskitCodeData {
    code: string;
    explanation: string;
    circuitName: string;
    installationInstructions: string;
    advancedCode?: string;
    circuitStats: {
        totalGates: number;
        gateTypes: Record<string, number>;
        maxPosition: number;
    };
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
                            <h4 className="font-semibold text-white mb-2">What just happened? 🤔</h4>
                            <p className="text-sm text-gray-300">
                                Think of your qubits like magical coins that can be both heads AND tails at the same time!<br /><br />
                                
                                {Object.keys(simulationResult).length > 1 ? (
                                    <>
                                        <span className="text-[#652db4] font-semibold">✨ Magic happened!</span><br />
                                        Your circuit created a <b>quantum superposition</b> - like having a coin that's somehow both heads AND tails until you look at it!<br /><br />
                                        
                                        <span className="text-yellow-400">🎯 Real-world analogy:</span><br />
                                        It's like Schrödinger's cat - the cat is both alive AND dead until you open the box to check. Your qubits are in multiple states at once!<br /><br />
                                        
                                        <span className="text-green-400">📊 What you'll see:</span><br />
                                        When you measure, you'll randomly get one of these results with the percentages shown above. It's like flipping a weighted coin!
                                    </>
                                ) : (
                                    <>
                                        <span className="text-blue-400 font-semibold">📌 Classic result!</span><br />
                                        Your circuit gave you a <b>definite answer</b> - like a regular coin that's definitely heads or tails.<br /><br />
                                        
                                        <span className="text-yellow-400">🎯 Real-world analogy:</span><br />
                                        It's like flipping a regular coin and getting a clear heads or tails. No quantum magic here - just a straightforward result!<br /><br />
                                        
                                        <span className="text-green-400">📊 What you'll see:</span><br />
                                        You'll always get this same result when you measure. It's predictable, like a regular coin flip!
                                    </>
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

function QiskitCodeBlock({ circuit, numQubits }: { circuit: QuantumGate[]; numQubits: number }) {
    const [qiskitData, setQiskitData] = useState<QiskitCodeData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const generateQiskitCode = async () => {
        if (circuit.length === 0) {
            setError('No circuit to generate code for');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/qiskit-code', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    circuit,
                    numQubits,
                })
            });

            const result = await response.json();

            if (result.success) {
                setQiskitData(result.data);
            } else {
                setError(result.error || 'Failed to generate Qiskit code');
            }
        } catch (err) {
            setError('Failed to connect to Qiskit code generator');
            console.error('Error generating Qiskit code:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text).then(() => {
            // You could add a toast notification here
            console.log('Code copied to clipboard');
        }).catch(err => {
            console.error('Failed to copy code:', err);
        });
    };

    const downloadCode = (code: string, filename: string) => {
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    useEffect(() => {
        if (circuit.length > 0) {
            generateQiskitCode();
        } else {
            setQiskitData(null);
        }
    }, [circuit, numQubits]);

    return (
        <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">Qiskit Code</h3>
            </div>

            {isLoading && (
                <div className="bg-black/40 rounded-lg border border-white/10 p-4 min-h-[200px] flex items-center justify-center">
                    <div className="text-gray-400">Generating Qiskit code...</div>
                </div>
            )}

            {error && (
                <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 mb-4">
                    <div className="text-red-400 text-sm">{error}</div>
                </div>
            )}

            {qiskitData && (
                <div className="space-y-4">
                    {/* Circuit Info */}
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">{qiskitData.circuitName}</h4>
                        <div className="text-sm text-gray-300">
                            <p>Total gates: {qiskitData.circuitStats.totalGates}</p>
                            <p>Circuit depth: {qiskitData.circuitStats.maxPosition}</p>
                            <p>Qubits: {numQubits}</p>
                        </div>
                    </div>

                    {/* Qiskit Code */}
                    <div className="bg-black/40 rounded-lg border border-white/10 p-4">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="font-semibold text-white">IBM Qiskit Code (Python)</h4>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => downloadCode(qiskitData.code, `${qiskitData.circuitName.toLowerCase().replace(/\s+/g, '_')}.py`)}
                                    className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                                >
                                    Download
                                </button>
                                <button
                                    onClick={() => copyToClipboard(qiskitData.code)}
                                    className="px-3 py-1 bg-[#652db4] text-white rounded text-sm hover:bg-[#8145c2] transition-colors"
                                >
                                    Copy Code
                                </button>
                            </div>
                        </div>
                        <div className="bg-black/60 rounded border border-white/20 p-3 max-h-96 overflow-y-auto">
                            <pre className="text-xs text-gray-300 whitespace-pre-wrap font-mono">
                                {qiskitData.code.split('\n').map((line, index) => {
                                    // Simple syntax highlighting
                                    let highlightedLine = line;
                                    
                                    // Highlight comments
                                    if (line.trim().startsWith('#')) {
                                        highlightedLine = `<span class="text-green-400">${line}</span>`;
                                    }
                                    // Highlight strings
                                    else if (line.includes("'") || line.includes('"')) {
                                        highlightedLine = line.replace(/(['"])(.*?)\1/g, '<span class="text-yellow-400">$1$2$1</span>');
                                    }
                                    // Highlight keywords
                                    else {
                                        const keywords = ['from', 'import', 'def', 'class', 'if', 'else', 'for', 'while', 'return', 'print', 'qc', 'Aer', 'execute', 'plot_histogram'];
                                        keywords.forEach(keyword => {
                                            const regex = new RegExp(`\\b${keyword}\\b`, 'g');
                                            highlightedLine = highlightedLine.replace(regex, `<span class="text-blue-400">${keyword}</span>`);
                                        });
                                    }
                                    
                                    return (
                                        <div key={index} 
                                             className="hover:bg-white/5 px-1 rounded"
                                             dangerouslySetInnerHTML={{ __html: highlightedLine }}
                                        />
                                    );
                                })}
                            </pre>
                        </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-black/20 rounded-lg p-3 border border-white/10">
                        <h4 className="font-semibold text-white mb-2">Code Explanation</h4>
                        <p className="text-sm text-gray-300 whitespace-pre-wrap">{qiskitData.explanation}</p>
                    </div>
                </div>
            )}

            {!qiskitData && !isLoading && circuit.length === 0 && (
                <div className="bg-black/40 rounded-lg border border-white/10 p-4 min-h-[200px] flex items-center justify-center">
                    <div className="text-gray-400 italic text-sm">
                        Build a circuit to generate Qiskit code...
                    </div>
                </div>
            )}
        </div>
    );
}

export default function ResultsPanel(props: ResultsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <MeasurementProbabilities simulationResult={props.simulationResult} />
        <Interpretation {...props} />
      </div>
      <QiskitCodeBlock circuit={props.circuit} numQubits={props.numQubits} />
    </div>
  );
} 