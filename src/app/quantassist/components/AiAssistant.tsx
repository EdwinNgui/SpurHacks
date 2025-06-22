import React, { useState } from 'react';
import { aiService, CircuitAnalysis } from '@/lib/ai-service';

interface AiAssistantProps {
    userQuery: string;
    setUserQuery: (query: string) => void;
    handleQuerySubmit: () => void;
    isProcessing: boolean;
    exampleQueries: string[];
    aiResponse: string;
    onAnalyzeCircuit?: () => void;
    hasCircuit: boolean;
}

export default function AiAssistant({
    userQuery,
    setUserQuery,
    handleQuerySubmit,
    isProcessing,
    exampleQueries,
    aiResponse,
    onAnalyzeCircuit,
    hasCircuit
}: AiAssistantProps) {
  const [analysis, setAnalysis] = useState<CircuitAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyzeCircuit = async () => {
    if (!onAnalyzeCircuit) return;
    
    setIsAnalyzing(true);
    try {
      // This would need to be passed from the parent component
      // For now, we'll show a placeholder
      setAnalysis({
        explanation: "Circuit analysis would be performed here using the AI service.",
        insights: ["The circuit demonstrates quantum superposition", "Measurement results show quantum interference effects"],
        recommendations: ["Try adding more gates to see different behaviors", "Experiment with different gate sequences"]
      });
    } catch (error) {
      console.error('Error analyzing circuit:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-white">
            What would you like to do?
        </h3>
        <div className="mb-4">
            <div className="flex gap-2">
            <input
                type="text"
                value={userQuery}
                onChange={(e) => setUserQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleQuerySubmit()}
                placeholder="e.g., 'Create a quantum coin flip'"
                className="flex-1 p-3 bg-black/20 border border-white/20 rounded-lg focus:ring-2 focus:ring-[#652db4] focus:border-transparent text-sm text-white placeholder-gray-400"
                disabled={isProcessing}
            />
            <button
                onClick={handleQuerySubmit}
                disabled={isProcessing || !userQuery.trim()}
                className="bg-[#652db4] text-white px-4 py-3 rounded-lg hover:bg-[#8145c2] disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
            >
                {isProcessing ? '🤔' : '✨'}
            </button>
            </div>
        </div>
        <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">Try these examples:</p>
            <div className="flex flex-wrap gap-2">
            {exampleQueries.map((example, index) => (
                <button
                key={index}
                onClick={() => setUserQuery(example)}
                className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded-full text-gray-300 transition-colors"
                >
                {example}
                </button>
            ))}
            </div>
        </div>
        
        {hasCircuit && (
            <div className="mb-4">
                <button
                    onClick={handleAnalyzeCircuit}
                    disabled={isAnalyzing}
                    className="w-full bg-[#652db4]/50 text-white px-4 py-2 rounded-lg hover:bg-[#652db4]/70 disabled:opacity-50 disabled:cursor-not-allowed text-sm transition-colors"
                >
                    {isAnalyzing ? '🔍 Analyzing...' : '🔍 Analyze Circuit with AI'}
                </button>
            </div>
        )}

        {aiResponse && (
            <div className="bg-black/20 border border-white/10 rounded-lg p-3 mb-4">
            <h4 className="font-semibold text-white mb-2 text-sm">AI Response:</h4>
            <div className="text-gray-300 whitespace-pre-line text-sm">{aiResponse}</div>
            </div>
        )}

        {analysis && (
            <div className="bg-black/20 border border-white/10 rounded-lg p-3">
                <h4 className="font-semibold text-white mb-2 text-sm">Circuit Analysis:</h4>
                <div className="text-gray-300 text-sm mb-3">{analysis.explanation}</div>
                
                {analysis.insights.length > 0 && (
                    <div className="mb-3">
                        <h5 className="font-medium text-white text-xs mb-1">Key Insights:</h5>
                        <ul className="text-gray-300 text-xs space-y-1">
                            {analysis.insights.map((insight, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-[#652db4] mr-2">•</span>
                                    {insight}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                {analysis.recommendations.length > 0 && (
                    <div>
                        <h5 className="font-medium text-white text-xs mb-1">Recommendations:</h5>
                        <ul className="text-gray-300 text-xs space-y-1">
                            {analysis.recommendations.map((rec, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-[#652db4] mr-2">💡</span>
                                    {rec}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        )}
    </div>
  );
} 