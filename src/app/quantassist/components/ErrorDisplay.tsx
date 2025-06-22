'use client';

import React, { useState } from 'react';
import { ValidationError, ValidationResult } from '@/lib/circuit-validation';

interface ErrorDisplayProps {
  validation: ValidationResult;
  onFixError?: (error: ValidationError) => void;
}

export default function ErrorDisplay({ validation, onFixError }: ErrorDisplayProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['errors']));

  const toggleSection = (section: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const getErrorIcon = (type: ValidationError['type']) => {
    switch (type) {
      case 'error':
        return (
          <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
        );
      case 'warning':
        return (
          <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  const getSectionIcon = (expanded: boolean) => (
    <svg 
      className={`w-4 h-4 transition-transform ${expanded ? 'rotate-90' : ''}`} 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const renderErrorList = (errors: ValidationError[], type: string) => {
    if (errors.length === 0) return null;

    const expanded = expandedSections.has(type);
    const typeConfigs = {
      errors: { title: 'Errors', color: 'red', bgColor: 'bg-red-50', borderColor: 'border-red-200' },
      warnings: { title: 'Warnings', color: 'yellow', bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
      suggestions: { title: 'Suggestions', color: 'blue', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
    };
    const typeConfig = typeConfigs[type as keyof typeof typeConfigs];

    if (!typeConfig) return null;

    return (
      <div className={`border rounded-lg ${typeConfig.borderColor} ${typeConfig.bgColor}`}>
        <button
          onClick={() => toggleSection(type)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-opacity-75 transition-colors"
        >
          <div className="flex items-center space-x-2">
            {getErrorIcon(errors[0].type)}
            <span className={`font-medium text-${typeConfig.color}-800`}>
              {typeConfig.title} ({errors.length})
            </span>
          </div>
          {getSectionIcon(expanded)}
        </button>
        
        {expanded && (
          <div className="px-4 pb-4 space-y-3">
            {errors.map((error, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="flex items-start space-x-3">
                  {getErrorIcon(error.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{error.message}</p>
                    {error.suggestion && (
                      <p className="text-sm text-gray-600 mt-1">
                        💡 {error.suggestion}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                      {error.gateId && (
                        <span>Gate ID: {error.gateId}</span>
                      )}
                      {error.position !== undefined && (
                        <span>Position: {error.position}</span>
                      )}
                      {error.qubit !== undefined && (
                        <span>Qubit: {error.qubit}</span>
                      )}
                    </div>
                  </div>
                  {onFixError && (
                    <button
                      onClick={() => onFixError(error)}
                      className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
                      Fix
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderCircuitStats = () => (
    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <h3 className="font-medium text-gray-900 mb-3">Circuit Statistics</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{validation.circuitStats.totalGates}</div>
          <div className="text-xs text-gray-600">Total Gates</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{validation.circuitStats.depth}</div>
          <div className="text-xs text-gray-600">Depth</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{validation.circuitStats.width}</div>
          <div className="text-xs text-gray-600">Width</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{validation.circuitStats.complexity}</div>
          <div className="text-xs text-gray-600">Complexity</div>
        </div>
      </div>
      <div className="mt-3 text-center">
        <div className="text-sm text-gray-600">
          Efficiency: {validation.circuitStats.efficiency}
        </div>
      </div>
    </div>
  );

  const renderOptimizationTips = () => {
    if (validation.optimizationTips.length === 0) return null;

    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Optimization Tips
        </h3>
        <ul className="space-y-2">
          {validation.optimizationTips.map((tip, index) => (
            <li key={index} className="text-sm text-green-800 flex items-start">
              <span className="mr-2">•</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const totalIssues = validation.errors.length + validation.warnings.length + validation.suggestions.length;

  if (totalIssues === 0 && validation.optimizationTips.length === 0) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium text-green-900">Circuit is valid and ready to run!</span>
        </div>
        {renderCircuitStats()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {renderErrorList(validation.errors, 'errors')}
      {renderErrorList(validation.warnings, 'warnings')}
      {renderErrorList(validation.suggestions, 'suggestions')}
      {renderOptimizationTips()}
      {renderCircuitStats()}
    </div>
  );
} 