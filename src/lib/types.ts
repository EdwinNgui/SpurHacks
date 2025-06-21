export interface Gate {
  type: "H" | "X" | "Z" | "Y" | "CNOT" | "CCNOT" | "NOT" | "RX" | "RY" | "RZ";
  targets: number[];
  params?: number; // for theta value for rx, ry, rz
}

export interface Circuit {
  gates: Gate[][];
}

export type Complex = [number, number]; // [real, imag]
export type Matrix = Complex[][];
export type Vector = Complex[];
