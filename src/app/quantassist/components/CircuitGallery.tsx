'use client';

import React, { useState, useMemo } from 'react';
import { CircuitTemplate, circuitTemplates, getTemplatesByCategory, getTemplatesByDifficulty, searchTemplates } from '@/lib/circuit-templates';
import { QuantumGate } from '../types';
import { CircuitHistoryManager, CircuitHistory } from '@/lib/circuit-templates';

interface CircuitGalleryProps {
  onLoadTemplate: (circuit: QuantumGate[], numQubits: number) => void;
  onLoadHistory: (circuit: QuantumGate[], numQubits: number) => void;
  currentCircuit: QuantumGate[];
  currentQubits: number;
}

export default function CircuitGallery({ 
  onLoadTemplate, 
  onLoadHistory, 
  currentCircuit, 
  currentQubits 
}: CircuitGalleryProps) {
  const [activeTab, setActiveTab] = useState<'templates' | 'history'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CircuitTemplate['category'] | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(5);
  const [showConfirmDialog, setShowConfirmDialog] = useState<string | null>(null);

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' },
    { value: 'algorithm', label: 'Algorithms' },
    { value: 'educational', label: 'Educational' }
  ];

  const difficulties = [
    { value: 1, label: 'Level 1' },
    { value: 2, label: 'Level 2' },
    { value: 3, label: 'Level 3' },
    { value: 4, label: 'Level 4' },
    { value: 5, label: 'Level 5' }
  ];

  const filteredTemplates = useMemo(() => {
    let filtered = circuitTemplates;

    if (searchQuery) {
      filtered = searchTemplates(searchQuery);
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(template => template.category === selectedCategory);
    }

    filtered = filtered.filter(template => template.difficulty <= selectedDifficulty);

    return filtered;
  }, [searchQuery, selectedCategory, selectedDifficulty]);

  const history = useMemo(() => {
    return CircuitHistoryManager.getHistory();
  }, []);

  const handleLoadTemplate = (template: CircuitTemplate) => {
    onLoadTemplate(template.circuit, template.qubits);
  };

  const handleLoadHistory = (entry: CircuitHistory) => {
    onLoadHistory(entry.circuit, entry.numQubits);
  };

  const handleSaveCurrent = () => {
    if (currentCircuit.length > 0) {
      const name = prompt('Enter a name for this circuit:') || `Circuit ${history.length + 1}`;
      CircuitHistoryManager.saveCircuit(currentCircuit, currentQubits, name);
      window.location.reload();
    }
  };

  const handleDeleteHistory = (id: string) => {
    CircuitHistoryManager.deleteCircuit(id);
    window.location.reload();
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to clear all circuit history? This cannot be undone.')) {
      CircuitHistoryManager.clearHistory();
      window.location.reload();
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-blue-100 text-blue-800';
      case 3: return 'bg-yellow-100 text-yellow-800';
      case 4: return 'bg-orange-100 text-orange-800';
      case 5: return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: CircuitTemplate['category']) => {
    switch (category) {
      case 'beginner': return 'bg-green-50 border-green-200';
      case 'intermediate': return 'bg-blue-50 border-blue-200';
      case 'advanced': return 'bg-purple-50 border-purple-200';
      case 'algorithm': return 'bg-orange-50 border-orange-200';
      case 'educational': return 'bg-teal-50 border-teal-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-h-[600px] overflow-y-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Circuit Gallery</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('templates')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'templates'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Templates
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            History
          </button>
        </div>
      </div>

      {activeTab === 'templates' && (
        <div>
          <div className="mb-6 space-y-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as CircuitTemplate['category'] | 'all')}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty.value} value={difficulty.value}>
                    {difficulty.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${getCategoryColor(template.category)}`}
                onClick={() => handleLoadTemplate(template)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-900">{template.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(template.difficulty)}`}>
                    Level {template.difficulty}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{template.qubits} qubit{template.qubits !== 1 ? 's' : ''}</span>
                  <span>{template.circuit.length} gate{template.circuit.length !== 1 ? 's' : ''}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs text-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                  {template.tags.length > 3 && (
                    <span className="px-2 py-1 bg-white bg-opacity-50 rounded-full text-xs text-gray-600">
                      +{template.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredTemplates.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <p>No templates found matching your criteria.</p>
              <p className="text-sm">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      )}

      {activeTab === 'history' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Circuit History</h3>
            <div className="flex space-x-2">
              <button
                onClick={handleSaveCurrent}
                disabled={currentCircuit.length === 0}
                className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Current
              </button>
              {history.length > 0 && (
                <button
                  onClick={handleClearHistory}
                  className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No saved circuits yet.</p>
              <p className="text-sm">Build a circuit and save it to see it here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{entry.name}</h4>
                      <p className="text-sm text-gray-600">
                        {entry.circuit.length} gates, {entry.numQubits} qubits
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp).toLocaleString()}
                      </p>
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleLoadHistory(entry)}
                        className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => setShowConfirmDialog(entry.id)}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Circuit?</h3>
            <p className="text-gray-600 mb-6">This action cannot be undone.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  handleDeleteHistory(showConfirmDialog);
                  setShowConfirmDialog(null);
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={() => setShowConfirmDialog(null)}
                className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 