import React from 'react';
import GatePalette from './GatePalette';
import AiAssistant from './AiAssistant';
import { GateTemplate } from '../types';

interface ControlPanelProps {
    activeSection: 'manual' | 'ai';
    setActiveSection: (section: 'manual' | 'ai') => void;
    gates: GateTemplate[];
    handleDragStart: (gate: GateTemplate) => void;
    userQuery: string;
    setUserQuery: (query: string) => void;
    handleQuerySubmit: () => void;
    isProcessing: boolean;
    exampleQueries: string[];
    aiResponse: string;
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
        aiResponse
    } = props;

  return (
    <div className="lg:col-span-1 space-y-6">
      {/* Section Toggle */}
      <div className="bg-[#3f2a61]/30 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-2">
        <div className="flex">
          <button
            onClick={() => setActiveSection('manual')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeSection === 'manual' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            🔧 Manual
          </button>
          <button
            onClick={() => setActiveSection('ai')}
            className={`flex-1 px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              activeSection === 'ai' 
                ? 'bg-white/20 text-white' 
                : 'text-gray-300 hover:bg-white/10'
            }`}
          >
            🤖 AI Assistant
          </button>
        </div>
      </div>
      {/* Manual Builder Section */}
      {activeSection === 'manual' && (
        <GatePalette gates={gates} handleDragStart={handleDragStart} />
      )}
      {/* AI Assistant Section */}
      {activeSection === 'ai' && (
        <AiAssistant
            userQuery={userQuery}
            setUserQuery={setUserQuery}
            handleQuerySubmit={handleQuerySubmit}
            isProcessing={isProcessing}
            exampleQueries={exampleQueries}
            aiResponse={aiResponse}
        />
      )}
    </div>
  );
} 