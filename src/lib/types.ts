export interface Gate {
  type: "H" | "X" | "Z" | "CNOT" | "RY" | "RZ";
  qubit: number;
  control?: number;
  time: number;
}

export interface Circuit {
  qubits: number;
  gates: Gate[];
}

type Complex = [number, number]; // [real, imag]
type Matrix = Complex[][];
type Vector = Complex[];
