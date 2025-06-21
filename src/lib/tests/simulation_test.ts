import { Circuit, Complex } from "@/lib/types";
import { runCircuit } from "@/lib/simulation";

// Initial state: |0⟩
const numQubits = 1;

const circuitH: Circuit = {
  gates: [[{ type: "H", targets: [0] }]],
};

const expectedH: Complex[] = [
  [1 / Math.sqrt(2), 0],
  [1 / Math.sqrt(2), 0],
];

const circuitZ: Circuit = {
  gates: [[{ type: "X", targets: [0] }], [{ type: "Z", targets: [0] }]],
};

const expectedZ: Complex[] = [
  [0, 0],
  [-1, 0],
];

const circuitRY: Circuit = {
  gates: [[{ type: "RY", targets: [0], params: Math.PI }]],
};

const expectedRY: Complex[] = [
  [0, 0],
  [1, 0],
];

const circuitX: Circuit = {
  gates: [[{ type: "X", targets: [0] }]],
};

const expectedX: Complex[] = [
  [0, 0],
  [1, 0],
];

const circuitRX: Circuit = {
  gates: [[{ type: "RX", targets: [0], params: Math.PI }]],
};

const expectedRX: Complex[] = [
  [0, 0],
  [0, -1], // i = [0, 1]
];

const circuitCNOT: Circuit = {
  gates: [[{ type: "H", targets: [1] }], [{ type: "CNOT", targets: [1, 0] }]],
};

const expectedCNOT: Complex[] = [
  [1 / Math.sqrt(2), 0], // |00⟩
  [0, 0], // |01⟩
  [0, 0], // |10⟩
  [1 / Math.sqrt(2), 0], // |11⟩
];

function approxEqual(a: Complex, b: Complex, epsilon = 1e-6): boolean {
  return Math.abs(a[0] - b[0]) < epsilon && Math.abs(a[1] - b[1]) < epsilon;
}

function test_single(circuit: Circuit, expected: Complex[]) {
  console.log(circuit.gates);
  const finalState = runCircuit(circuit, 1);
  for (let i = 0; i < expected.length; i++) {
    if (!approxEqual(finalState[i], expected[i])) {
      console.error(
        `Mismatch at index ${i}: got ${finalState[i]}, expected ${expected[i]}`
      );
    } else {
      console.log(`Passed at index ${i}`);
    }
  }
}

function test_double(circuit: Circuit, expected: Complex[]) {
  console.log(circuit.gates);
  const finalState = runCircuit(circuit, 2);
  for (let i = 0; i < expected.length; i++) {
    if (!approxEqual(finalState[i], expected[i])) {
      console.error(
        `Mismatch at index ${i}: got ${finalState[i]}, expected ${expected[i]}`
      );
    } else {
      console.log(`Passed at index ${i}`);
    }
  }
}

test_single(circuitH, expectedH);
test_single(circuitX, expectedX);
test_single(circuitRX, expectedRX);
test_single(circuitRY, expectedRY);
test_single(circuitZ, expectedZ);
test_double(circuitCNOT, expectedCNOT);
