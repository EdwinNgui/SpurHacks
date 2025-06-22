import { Complex } from '@/lib/types';

export interface QuantumGate {
  id: number;
  type: string;
  qubit?: number;
  control?: number;
  target?: number;
  position: number;
  theta?: number; // For RX, RY, RZ gates
}

export interface GateTemplate {
  type: string;
  name: string;
  symbol: string;
  color: string;
  description:string;
}

export interface AlgorithmTemplate {
  name: string;
  description: string;
  circuit: QuantumGate[];
  qubits: number;
}

export interface QuantumState {
  [key: string]: number;
}

export interface SimulationResult {
  [key: string]: number;
} 