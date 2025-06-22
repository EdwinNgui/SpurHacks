'use client';

import React, { useState, useEffect, useRef } from 'react';
import { QuantumGate } from '../types';

interface CircuitVisualizerProps {
  circuit: QuantumGate[];
  numQubits: number;
  isAnimating: boolean;
  onAnimationComplete?: () => void;
  showStepByStep?: boolean;
}

interface AnimationState {
  currentStep: number;
  isRunning: boolean;
  speed: number;
}

export default function CircuitVisualizer({
  circuit,
  numQubits,
  isAnimating,
  onAnimationComplete,
  showStepByStep = false
}: CircuitVisualizerProps) {
  const [animationState, setAnimationState] = useState<AnimationState>({
    currentStep: 0,
    isRunning: false,
    speed: 1000
  });
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const maxPosition = circuit.length > 0 ? Math.max(...circuit.map(g => g.position), 0) : 0;
  const totalSteps = maxPosition + 1;

  useEffect(() => {
    if (isAnimating && !animationState.isRunning) {
      startAnimation();
    } else if (!isAnimating && animationState.isRunning) {
      stopAnimation();
    }
  }, [isAnimating]);

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const startAnimation = () => {
    setAnimationState(prev => ({ ...prev, isRunning: true, currentStep: 0 }));
    runNextStep();
  };

  const stopAnimation = () => {
    setAnimationState(prev => ({ ...prev, isRunning: false }));
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
  };

  const runNextStep = () => {
    if (!animationState.isRunning) return;

    if (animationState.currentStep >= totalSteps) {
      setAnimationState(prev => ({ ...prev, isRunning: false }));
      onAnimationComplete?.();
      return;
    }

    animationRef.current = setTimeout(() => {
      setAnimationState(prev => ({
        ...prev,
        currentStep: prev.currentStep + 1
      }));
      runNextStep();
    }, animationState.speed);
  };

  const resetAnimation = () => {
    stopAnimation();
    setAnimationState(prev => ({ ...prev, currentStep: 0 }));
  };

  const setSpeed = (speed: number) => {
    setAnimationState(prev => ({ ...prev, speed }));
  };

  const getGateAtPosition = (qubit: number, position: number) => {
    return circuit.find(gate => {
      if (gate.type === 'CNOT') {
        return (gate.control === qubit || gate.target === qubit) && gate.position === position;
      }
      return gate.qubit === qubit && gate.position === position;
    });
  };

  const getGateColor = (gate: QuantumGate, isActive: boolean) => {
    if (!isActive) return 'bg-gray-300';
    
    switch (gate.type) {
      case 'H': return 'bg-blue-500';
      case 'X': return 'bg-red-500';
      case 'Y': return 'bg-yellow-500';
      case 'Z': return 'bg-purple-500';
      case 'CNOT': return 'bg-green-500';
      case 'MEASURE': return 'bg-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getGateSymbol = (gate: QuantumGate) => {
    switch (gate.type) {
      case 'H': return 'H';
      case 'X': return 'X';
      case 'Y': return 'Y';
      case 'Z': return 'Z';
      case 'CNOT': return '⊕';
      case 'MEASURE': return 'M';
      default: return '?';
    }
  };

  const renderQubitLine = (qubitIndex: number) => {
    const cells = [];
    for (let pos = 0; pos <= maxPosition; pos++) {
      const gate = getGateAtPosition(qubitIndex, pos);
      const isActive = animationState.currentStep > pos;
      const isCurrent = animationState.currentStep === pos + 1;
      
      cells.push(
        <div
          key={pos}
          className={`relative flex items-center justify-center w-12 h-12 border border-gray-300 ${
            isCurrent ? 'bg-yellow-100 border-yellow-400' : ''
          }`}
        >
          {gate ? (
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-300 ${
                getGateColor(gate, isActive)
              } ${isCurrent ? 'scale-110 shadow-lg' : ''}`}
            >
              {getGateSymbol(gate)}
            </div>
          ) : (
            <div className="w-8 h-8 border-2 border-dashed border-gray-300 rounded-lg" />
          )}
        </div>
      );
    }
    return cells;
  };

  const renderCNOTConnections = () => {
    const connections: React.JSX.Element[] = [];
    circuit.forEach((gate, index) => {
      if (gate.type === 'CNOT' && gate.control !== undefined && gate.target !== undefined) {
        const isActive = animationState.currentStep > gate.position;
        const isCurrent = animationState.currentStep === gate.position + 1;
        
        const controlY = gate.control * 48 + 24; // 48px per qubit line height
        const targetY = gate.target * 48 + 24;
        const x = gate.position * 48 + 24; // 48px per column width
        
        connections.push(
          <g key={`cnot-${index}`}>
            {/* Control dot */}
            <circle
              cx={x}
              cy={controlY}
              r={isActive ? 4 : 2}
              fill={isActive ? '#10b981' : '#9ca3af'}
              className="transition-all duration-300"
            />
            {/* Target cross */}
            <circle
              cx={x}
              cy={targetY}
              r={isActive ? 6 : 4}
              fill="white"
              stroke={isActive ? '#10b981' : '#9ca3af'}
              strokeWidth={2}
              className="transition-all duration-300"
            />
            <text
              x={x}
              y={targetY + 1}
              textAnchor="middle"
              className={`text-xs font-bold ${isActive ? 'text-green-600' : 'text-gray-500'}`}
            >
              ⊕
            </text>
            {/* Connection line */}
            <line
              x1={x}
              y1={controlY}
              x2={x}
              y2={targetY}
              stroke={isActive ? '#10b981' : '#d1d5db'}
              strokeWidth={isCurrent ? 3 : 1}
              className="transition-all duration-300"
            />
          </g>
        );
      }
    });
    return connections;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Circuit Visualization</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetAnimation}
            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
          >
            Reset
          </button>
          <select
            value={animationState.speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-2 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={2000}>Slow</option>
            <option value={1000}>Normal</option>
            <option value={500}>Fast</option>
            <option value={200}>Very Fast</option>
          </select>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>Step {animationState.currentStep} of {totalSteps}</span>
          <div className="w-32 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(animationState.currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="relative overflow-x-auto">
        <svg
          className="absolute inset-0 pointer-events-none"
          style={{
            width: `${(maxPosition + 1) * 48}px`,
            height: `${numQubits * 48}px`
          }}
        >
          {renderCNOTConnections()}
        </svg>
        
        <div className="relative">
          {/* Position labels */}
          <div className="flex mb-2">
            {Array.from({ length: maxPosition + 1 }, (_, i) => (
              <div key={i} className="w-12 text-center text-xs text-gray-500">
                {i}
              </div>
            ))}
          </div>

          {/* Qubit lines */}
          <div className="space-y-0">
            {Array.from({ length: numQubits }, (_, i) => (
              <div key={i} className="flex">
                <div className="w-16 text-right pr-2 text-sm text-gray-600 flex items-center">
                  Qubit {i}
                </div>
                {renderQubitLine(i)}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showStepByStep && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-900 mb-2">Step-by-Step Execution</h4>
          <div className="space-y-2">
            {Array.from({ length: totalSteps }, (_, step) => {
              const gatesAtStep = circuit.filter(gate => gate.position === step);
              const isActive = animationState.currentStep > step;
              const isCurrent = animationState.currentStep === step + 1;
              
              return (
                <div
                  key={step}
                  className={`p-2 rounded text-sm ${
                    isCurrent ? 'bg-yellow-100 border border-yellow-300' :
                    isActive ? 'bg-green-50 border border-green-200' :
                    'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div className="font-medium">
                    Step {step}: {gatesAtStep.length > 0 ? 'Executing gates' : 'No gates'}
                  </div>
                  {gatesAtStep.map((gate, index) => (
                    <div key={index} className="text-gray-600 ml-4">
                      • {gate.type} gate on qubit {gate.qubit !== undefined ? gate.qubit : 
                        gate.type === 'CNOT' ? `${gate.control}→${gate.target}` : 'N/A'}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 