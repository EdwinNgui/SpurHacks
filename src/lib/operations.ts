import { Matrix, Complex, Vector } from "@/lib/types";

function identityMatrix(size: number): Complex[][] {
  const matrix: Complex[][] = [];
  for (let i = 0; i < size; i++) {
    const row: Complex[] = [];
    for (let j = 0; j < size; j++) {
      row.push(i === j ? [1, 0] : [0, 0]);
    }
    matrix.push(row);
  }
  return matrix;
}

function kron(a: Complex[][], b: Complex[][]): Complex[][] {
  const result: Complex[][] = [];
  for (let i = 0; i < a.length; i++) {
    for (let j = 0; j < b.length; j++) {
      const row: Complex[] = [];
      for (let k = 0; k < a[0].length; k++) {
        for (let l = 0; l < b[0].length; l++) {
          row.push(mulComplex(a[i][k], b[j][l]));
        }
      }
      result.push(row);
    }
  }
  return result;
}

function matrixVectorMultiply(
  matrix: Complex[][],
  vector: Complex[]
): Complex[] {
  const result: Complex[] = [];
  for (let i = 0; i < matrix.length; i++) {
    let sum: Complex = [0, 0];
    for (let j = 0; j < vector.length; j++) {
      sum = addComplex(sum, mulComplex(matrix[i][j], vector[j]));
    }
    result.push(sum);
  }
  return result;
}

function addComplex([a, b]: Complex, [c, d]: Complex): Complex {
  // Validate inputs
  if (!Array.isArray([a, b]) || !Array.isArray([c, d])) {
    console.error('addComplex received invalid inputs:', [a, b], [c, d]);
    return [0, 0]; // Return zero complex number as fallback
  }
  
  // Ensure all values are numbers
  const aVal = typeof a === 'number' ? a : 0;
  const bVal = typeof b === 'number' ? b : 0;
  const cVal = typeof c === 'number' ? c : 0;
  const dVal = typeof d === 'number' ? d : 0;
  
  return [aVal + cVal, bVal + dVal];
}

function mulComplex([a, b]: Complex, [c, d]: Complex): Complex {
  // Validate inputs
  if (!Array.isArray([a, b]) || !Array.isArray([c, d])) {
    console.error('mulComplex received invalid inputs:', [a, b], [c, d]);
    return [0, 0]; // Return zero complex number as fallback
  }
  
  // Ensure all values are numbers
  const aVal = typeof a === 'number' ? a : 0;
  const bVal = typeof b === 'number' ? b : 0;
  const cVal = typeof c === 'number' ? c : 0;
  const dVal = typeof d === 'number' ? d : 0;
  
  return [aVal * cVal - bVal * dVal, aVal * dVal + bVal * cVal];
}

/**
 * Apply a single-qubit gate to a multi-qubit state vector.
 */
export function applySingleQubitGate(
  stateVector: Vector, // Length = 2^n
  gate: Matrix, // 2x2 matrix
  targetQubit: number, // 0 = least significant
  numQubits: number // total qubits
): Vector {
  let fullOperator: Matrix = identityMatrix(1);

  for (let i = numQubits - 1; i >= 0; i--) {
    if (i === targetQubit) {
      fullOperator = kron(fullOperator, gate);
    } else {
      fullOperator = kron(fullOperator, identityMatrix(2));
    }
  }

  return matrixVectorMultiply(fullOperator, stateVector);
}

/**
 * Apply a 2-qubit gate (e.g., CNOT) to a multi-qubit state vector.
 */
export function applyTwoQubitGate(
  stateVector: Vector, // Length = 2^n
  gate4x4: Matrix, // 4x4 gate matrix
  control: number, // control qubit index
  target: number, // target qubit index
  numQubits: number
): Vector {
  const high = Math.max(control, target);
  const low = Math.min(control, target);
  let fullOp: Matrix = identityMatrix(1);
  let inserted = false;

  for (let i = numQubits - 1; i >= 0; ) {
    if (i === high) {
      fullOp = kron(fullOp, gate4x4);
      inserted = true;
      i -= 2; // skip both control and target
    } else if (i === low && inserted) {
      i -= 1; // already included
    } else {
      fullOp = kron(fullOp, identityMatrix(2));
      i -= 1;
    }
  }

  return matrixVectorMultiply(fullOp, stateVector);
}
