import { Complex, Circuit } from "@/lib/types";
import { applySingleQubitGate, applyTwoQubitGate } from "@/lib/operations";
import { hGate, xGate, yGate, zGate, rxGate, ryGate, rzGate, cnotGate } from "@/lib/gates";

export function applyCCNOT(state: Complex[], c1: number, c2: number, t: number, numQubits: number): Complex[] {
    const newState = [...state];
    const c1Mask = 1 << (numQubits - 1 - c1);
    const c2Mask = 1 << (numQubits - 1 - c2);
    const tMask = 1 << (numQubits - 1 - t);

    for (let i = 0; i < state.length; i++) {
        // Check if both control bits are set in the current basis state 'i'
        if ((i & c1Mask) !== 0 && (i & c2Mask) !== 0) {
            // If so, the target bit is flipped. This corresponds to swapping the amplitude
            // with the state where the target bit is flipped.
            const j = i ^ tMask; 
            // We only iterate up to i < j to avoid swapping back.
            if (i < j) {
                const temp = newState[i];
                newState[i] = newState[j];
                newState[j] = temp;
            }
        }
    }
    return newState;
}

export function initialState(numQubits: number): Complex[] {
  const size = 2 ** numQubits;
  const state: Complex[] = Array(size).fill([0, 0]);
  state[0] = [1, 0]; // |00...0⟩
  return state;
}

export function runCircuit(circuit: Circuit, numQubits: number): Complex[] {
  let state = initialState(numQubits);
  for (const step of circuit.gates) {
    for (const gate of step) {
      switch (gate.type) {
        case "H":
          state = applySingleQubitGate(
            state,
            hGate,
            gate.targets[0],
            numQubits
          );
          break;
        case "X":
          state = applySingleQubitGate(
            state,
            xGate,
            gate.targets[0],
            numQubits
          );
          break;
        case "Y":
          state = applySingleQubitGate(
            state,
            yGate,
            gate.targets[0],
            numQubits
          );
          break;
        case "Z":
          state = applySingleQubitGate(
            state,
            zGate,
            gate.targets[0],
            numQubits
          );
          break;
        case "RX":
          state = applySingleQubitGate(
            state,
            rxGate(gate.params!),
            gate.targets[0],
            numQubits
          );
          break;
        case "RY":
          state = applySingleQubitGate(
            state,
            ryGate(gate.params!),
            gate.targets[0],
            numQubits
          );
          break;
        case "RZ":
          state = applySingleQubitGate(
            state,
            rzGate(gate.params!),
            gate.targets[0],
            numQubits
          );
          break;
        case "CNOT":
          state = applyTwoQubitGate(
            state,
            cnotGate,
            gate.targets[0],
            gate.targets[1],
            numQubits
          );
          break;
        case "CCNOT":
            state = applyCCNOT(
                state,
                gate.targets[0], // control1
                gate.targets[1], // control2
                gate.targets[2], // target
                numQubits
            );
            break;
      }
    }
  }
  return state;
}
