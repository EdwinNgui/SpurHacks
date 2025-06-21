import { Complex, Circuit } from "@/lib/types";
import { applySingleQubitGate, applyTwoQubitGate } from "@/lib/operations";
import { hGate, xGate, zGate, rxGate, ryGate, cnotGate } from "@/lib/gates";

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
            ryGate(gate.params!),
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
      }
    }
  }
  return state;
}
